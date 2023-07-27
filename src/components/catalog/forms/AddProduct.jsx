import "styles/forms.css";

import { post } from "axios";
import BreadCrumb from "components/common/forms/BreadCrumb";
import { CustomRadio } from "components/common/forms/custom-radio";
import { CustomSelect } from "components/common/forms/custom-select";
import { Input } from "components/common/forms/Input";
import { Textarea } from "components/common/forms/textarea";
import { Form } from "informed";
import Joi from "joi-browser";
import { withSnackbar } from "notistack";
import ImageView from "components/common/forms/ImageView";
import React, { Fragment, PureComponent } from "react";
import { Col, Row } from "reactstrap";
import {
  getcategoryByStatus,
  getSubCategory,
  getUoM,
} from "service/catalogService";
import { getJwt } from "service/authService";
import { addProduct, updateProduct } from "../../../service/catalogService";
import { apiUrl2 } from "./../../../config.json";

import { subDirectory } from "../../../config.json";

class AddProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  state = {
    allCatagoryList: [],
    uomList: [],
    ImageUrl: "",
    isCatagoryLoading: true,
    isLoading: true,
    isload: true,
    data: {},
    logo: "",
    merchantId: "",
    status: [
      { id: "A", name: "Active" },
      { id: "D", name: "InActive" },
    ],
    bestSelling: ["Y", "N"],
    uomList: [
      { id: "1", name: "KG" },
      { id: "2", name: "MG" },
    ],
  };

  componentDidMount = async () => {
    let res = await getJwt("__info");
    console.log(res);
    const { merchantId } = res;
    const { userRole } = res;
    await this.setState({ userRole: userRole });
    await this.setState({ merchantId: merchantId });
    console.log(this.state.merchantId, "MId");
    const { formType } = this.props;
    if (formType === "edit") {
      const {
        location: { state },
      } = this.props.props;
      return this.formStateCheck(state.row);
    }
  };

  formStateCheck = async (data) => {
    data.productUom = data.productUom;
    data.productMrp = data.productMrp;
    data.productSellingPrice = data.productSellingPrice;
    await this.setState({
      data,
      productId: data.productId,
      ImageUrl: data.productImage,
    });
    try {
      await this.formApi.setValues(data);
    } catch (err) {}
  };

  schema = {
    categoryId: Joi.number().required().label("categoryId"),
    description: Joi.string().required().label("Description"),
    productQuantity: Joi.number().required().label("Quantity"),
    productUom: Joi.string().required().label("productUom"),
    productMrp: Joi.number().required().label("MRP (Rs)"),
    productId: Joi.number().required().label("Product Id"),
    productSellingPrice: Joi.number().required().label("Selling Price(Rs)"),

    productStatus: Joi.string().required().label("Status"),
    productName: Joi.string().required().label("Product Name"),
    bestSelling: Joi.string().required().label("Best Selling"),
  };

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name);
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  getCategories = async () => {
    const res = await getcategoryByStatus();
    const {
      data: { statusCode, data },
    } = res;
    if (!statusCode)
      return this.setState({ allCatagoryList: [], isCatagoryLoading: false });
    await this.setState({ allCatagoryList: data, isCatagoryLoading: false });
  };

  getUom = async () => {
    const res = await getUoM();
    const {
      data: { statusCode, data },
    } = res;
    if (!statusCode) return this.setState({ uomList: [], isLoading: false });
    await this.setState({ uomList: data, isLoading: false });
  };

  getSubCategory = async () => {
    const res = await getSubCategory();
    const {
      data: { statusCode, data },
    } = res;
    if (!statusCode) return this.setState({ subCategory: [], isload: false });
    await this.setState({ subCategory: data, isload: false });
  };

  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    console.log(Input);
    const { data } = this.state;
    data[name] = value;
    await this.setState({
      [name]: value,
    });
  };
  handleImage = async (fieldName, e) => {
    console.log(e);
    let imgUrl = await this.fileUpload(e.target.files[0]);
    console.log(imgUrl.data.data);
    await this.setState({ ImageUrl: imgUrl.data.data });
  };

  fileUpload = (file) => {
    const url = `${apiUrl2}/uploadImage`;
    const formData = new FormData();
    formData.append("image", file);

    return post(url, formData);
  };

  onSubmit = async () => {
    let response;
    const data = this.formApi.getState().values;
    console.log(data, "dg");
    const { productId } = this.state;
    const { formType } = this.props;
    if (formType === "add") {
      let merchantLogo = this.state.ImageUrl;
      delete data.productimage;
      data.productImage = this.state.ImageUrl;
      delete data.categoryName;
      data.merchantId = this.state.merchantId;
      response = await addProduct(data);
    } else {
      let merchantLogo = this.state.ImageUrl;
      data.productImage = merchantLogo;
      data["productId"] = productId;
      response = await updateProduct(data);
    }
    if (response.data.statusCode !== 1)
      return this.addNotification(response.data.message, "danger");
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.message);
      this.resetForm();
    }
  };

  resetForm = async () => {
    this.formApi.reset();
    let path = `${subDirectory}/catalog/products`;

    setTimeout(() => {
      this.props.props.history.push({
        pathname: path,
      });
    }, 100);
  };

  addNotification = (message, variant = "success") => {
    const { enqueueSnackbar } = this.props;
    const options = {
      variant,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
        autoHideDuration: 1000,
      },
    };
    enqueueSnackbar(message, options);
  };

  render() {
    let FormName;
    const { formType } = this.props;
    if (formType === "addform") {
      FormName = "Add Products";
    } else {
      FormName = "Edit Products";
    }
    const breadCrumbItems = {
      title: `${FormName}`,
      items: [
        { name: "Home", link: `${subDirectory}/dashboard` },
        { name: "Products", link: `${subDirectory}/catalog/products` },
        { name: `${FormName}`, active: true },
      ],
    };
    const { ImageUrl } = this.state;
    //
    return (
      <Fragment>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <BreadCrumb data={breadCrumbItems} />
              <Row className="form-div">
                <Col md={3} sm={12}>
                  <Input
                    field="categoryId"
                    label="categoryId"
                    name="categoryId"
                    validateOnBlur
                    validate={(e) => this.validateProperty("categoryId", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="productName"
                    label="Product Name"
                    name="productName"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("productName", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="productId"
                    label="Product Id"
                    name="productId"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("productId", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="productQuantity"
                    label="Quantity"
                    name="Quantity"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) =>
                      this.validateProperty("productQuantity", e)
                    }
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="productUom"
                    label="productUom"
                    name="productUom"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("productUom", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="subCategoryId"
                    label="subCategoryId"
                    name="subCategoryId"
                    onChange={this.handleChange}
                    validateOnBlur

                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="productMrp"
                    label="MRP(Rs)"
                    name="productMrp"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("productMrp", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="productSellingPrice"
                    label="Selling Price(Rs)"
                    name="productSellingPrice"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) =>
                      this.validateProperty("productSellingPrice", e)
                    }
                  />
                </Col>
                <Col md={3} sm={12}>
                  <CustomSelect
                    field="productStatus"
                    label="Status"
                    name="categoryStatus"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    options={this.state.status}
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("productStatus", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="bestSelling"
                    label="Best Selling"
                    name="bestSelling"
                    validateOnBlur
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="productimage"
                    type="file"
                    multiple
                    label="Choose Category Image"
                    name="productImage"
                    onChange={(e) => {
                      this.handleImage("merchantLogo", e);
                    }}
                  />
                </Col>
                <ImageView label="productImage" image={ImageUrl} alt="hello" />
                <Col md={12} sm={12}>
                  <Textarea
                    field="description"
                    label="Description"
                    name="Description"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("description", e)}
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-warning btn-sm mr-3"
                  id="cancelbtn"
                  onClick={() => this.resetForm()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Submit
                </button>
              </div>
            </div>
          )}
        </Form>
      </Fragment>
    );
  }
}

export default withSnackbar(AddProduct);
