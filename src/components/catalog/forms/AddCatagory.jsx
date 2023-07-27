import "styles/forms.css";

import { post } from "axios";
import BreadCrumb from "components/common/forms/BreadCrumb";
import { CustomSelect } from "components/common/forms/custom-select";
import { Input } from "components/common/forms/Input";
import { Form } from "informed";
import Joi from "joi-browser";
import { withSnackbar } from "notistack";
import React, { Fragment, PureComponent } from "react";
import { Col, Row } from "reactstrap";
import { getJwt } from "service/authService";
import { addCategory, updateCategory } from "../../../service/catalogService";
import { apiUrl } from "./../../../config.json";
import ImageView from "components/common/forms/ImageView";

import { subDirectory,apiUrl2 } from "../../../config.json";

class AddCatagory extends PureComponent {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  state = {
    data: {},
    ImageUrl: "",
    merchantId:"",
    status: [
      { id: "A", name: "Active" },
      { id: "D", name: "InActive" },
    ],
  };

  async componentDidMount() {
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
  }

  formStateCheck = async (data) => {
    console.log(data,"gyugju");
    
    data.deliveryCharges = data.deliveryCharges;
    await this.setState({ ImageUrl: data.imageUrl });
    await this.setState({ data, id: data.merchantId });
    try {
      await this.formApi.setValues(data);
    } catch (err) {}
  };

  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;
    await this.setState({ [name]: value });
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

  schema = {
    categoryName: Joi.string().required().label("Category Name"),
    imageUrl: Joi.string().required().label("Category Image"),
    categoryStatus: Joi.string().required().label("Status"),
  };

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name);
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  onSubmit = async () => {
    let response;
    const data = this.formApi.getState().values;
    const { formType } = this.props;
    const { categoryId } = this.state;
    if (formType === "add") {
      delete data.imageUrl2;
      let merchantLogo = this.state.ImageUrl;
      data.imageUrl = merchantLogo;
      data.merchantId=this.state.merchantId
      response = await addCategory(data);

    } else {
      let merchantLogo = this.state.ImageUrl;
      data.imageUrl = merchantLogo;
      response = await updateCategory(data);
      console.log(response);
    }
    if (response.data.statusCode !== 1)
      return await this.addNotification(response.data.data, "danger");
    if (response.data.statusCode === 1) {
      await this.addNotification(response.data.message);
      await this.resetForm();
    }
  };

  resetForm = async () => {
    this.formApi.reset();
    let path = `${subDirectory}/catalog/categories`;
    const { formType } = this.props;

      setTimeout(() => {
        this.props.props.history.push(path);
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
    const {
      match: {
        params: { pageName },
      },
    } = this.props.props;
    if (pageName === "add") {
      FormName = "Add Catagories";
    } else {
      FormName = "Edit Catagories";
    }
    const breadCrumbItems = {
      title: `${FormName}`,
      items: [
        { name: "Home", link: `${subDirectory}/dashboard` },
        { name: "Categories", link: `${subDirectory}/catalog/categories` },
        { name: `${FormName}  `, active: true },
      ],
    };
    const { ImageUrl } = this.state;
    return (
      <Fragment>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <BreadCrumb data={breadCrumbItems} />
              <div className="form-div">
                <Row>
                  <Col md={3} sm={12}>
                    <Input
                      field="categoryName"
                      label="Category Name"
                      name="categoryName"
                      onChange={this.handleChange}
                      validateOnBlur
                      validate={(e) => this.validateProperty("categoryName", e)}
                    />
                  </Col>
                  <Col md={3} sm={12}>
                    <CustomSelect
                      field="categoryStatus"
                      label="Status"
                      name="categoryStatus"
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => option.name}
                      options={this.state.status}
                      onChange={this.handleChange}
                      validateOnBlur
                      validate={(e) =>
                        this.validateProperty("categoryStatus", e)
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={3} sm={12}>
                    <Input
                      field="imageUrl2"
                      type="file"
                      multiple
                      label="Choose Category Image"
                      name="categoryImage"
                      onChange={(e) => {
                        this.handleImage("imageUrl2", e);
                      }}
                    />
                  </Col>
                  <ImageView
                    label="merchantLogo"
                    image={ImageUrl}
                    alt="hello"
                  />

                  {/* {formType !== "add" && (
                    <Col md={6} sm={12}>
                      <Input
                        field="imageUrl"
                        label="Category Image"
                        name="imageUrl"
                        readOnly
                        validateOnBlur
                        validate={(e) => this.validateProperty("imageUrl", e)}
                      />
                    </Col>
                  )} */}
                </Row>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-warning btn-sm mr-2"
                  id="cancelbtn"
                  onClick={() => this.resetForm()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="cancelbtn"
                  className="btn btn-primary btn-sm mr-2"
                >
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

export default withSnackbar(AddCatagory);
