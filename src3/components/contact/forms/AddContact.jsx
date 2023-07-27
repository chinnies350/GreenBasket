import "styles/forms.css";

import BreadCrumb from "components/common/forms/BreadCrumb";
import { CustomSelect } from "components/common/forms/custom-select";
import { Input } from "components/common/forms/Input";
import { Textarea } from "components/common/forms/textarea";
import { Form } from "informed";
import Joi from "joi-browser";
import { post } from "axios";
import { withSnackbar } from "notistack";
import React, { Fragment, PureComponent } from "react";
import { Col, Row } from "reactstrap";
import ImageView from "components/common/forms/ImageView";
import { getCurrentUser, getJwt } from "service/authService";
import {
  addContactDetails,
  updateContactDetails,
} from "../../../service/contactService";

import { subDirectory,apiUrl2 } from "../../../config.json";

class AddContact extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      logo: "",
      ImageUrl: "",
      merchantId: "",
    };
  }

  state = {
    data: {},
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
    const {
      match: {
        params: { pageName },
      },
    } = this.props.props;
    if (pageName === "editform") {
      const {
        location: { state },
      } = this.props.props;
      return this.formStateCheck(state.row);
    }
  }

  formStateCheck = async (data) => {
    console.log(data.merchantLogo, "gyugju");
    // data.deliveryCharges = data.deliveryCharges;
    // data.delete = data.merchantLogo
    await this.setState({ ImageUrl: data.merchantLogo });
    await this.setState({ data, id: data.merchantId });
    try {
      await this.formApi.setValues(data);
    } catch (err) {}
  };

  schema = {
    email: Joi.string().required().label("Email"),
    contactNumber: Joi.number().required().label("contactNumber"),
    addressLine1: Joi.string().required().label("Primary Address"),
    facebook: Joi.string().required().label("Facebook"),
    whatsapp: Joi.string().required().label("Whatsapp"),
    twitter: Joi.string().required().label("Twitter"),
    aboutUs: Joi.string().required().label("About Us"),
    terms: Joi.string().required().label("Terms"),
    policy: Joi.string().required().label("Policy"),
    minDeliveryChargeLimit: Joi.number().required().label("Charge Limit"),
    deliveryCharges: Joi.number().required().label("Delivery charge"),
    gstPercentage: Joi.number().required().label("Gst Percentage"),
    gstNumber: Joi.number().required().label("Gst Number"),
    status: Joi.string().required().label("Status"),
    instagram: Joi.string().required().label("instagram"),
    merchantLogo: Joi.string().required().label("merchantLogo"),
  };

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name);
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
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

    console.log(data);
    const {
      match: {
        params: { pageName },
      },
    } = this.props.props;
    if (pageName === "addform") {
      console.log(data);
      delete data.categoryImage;
      let merchantLogo = this.state.ImageUrl;
      data.merchantLogo = merchantLogo;
      data.merchantId = this.state.merchantId;
      console.log(data);
      response = await addContactDetails(data);
      console.log(data);
      if (response.data.statusCode !== 1)
        return this.addNotification(response.data.data, "danger");
      if (response.data.statusCode === 1) {
        this.addNotification(response.data.message);
        // let path = `${subDirectory}/merchant/list`;
        // setTimeout(() => {
        //   this.props.props.history.push({
        //     pathname: path,
        //   });
        // }, 500);
        await this.resetForm();
      }
    } else {
      delete data.categoryImage;
      let merchantLogo = this.state.ImageUrl;
      data.merchantLogo = merchantLogo;
      response = await updateContactDetails(data);
      console.log(data, response);

      if (response.data.statusCode !== 1)
        return this.addNotification(response.data.data, "danger");
      if (response.data.statusCode === 1) {
        this.addNotification(response.data.message);
        // let path = `${subDirectory}/merchant/list`;
        // setTimeout(() => {
        //   this.props.props.history.push({
        //     pathname: path,
        //   });
        // }, 500);
        await this.resetForm();
      }
    }
  };

  resetForm = async () => {
    let path = `${subDirectory}/merchant/list`;
    const {
      match: {
        params: { pageName },
      },
    } = this.props.props;

    setTimeout(() => {
      this.props.props.history.push({
        pathname: path,
      });
    }, 500);
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
    let FromName;
    const { ImageUrl } = this.state;
    const {
      match: {
        params: { pageName },
      },
    } = this.props.props;
    if (pageName === "addform") {
      FromName = "Add Merchants";
    } else {
      FromName = "Edit Merchant";
    }
    // const logo = this.props.props.location.state.row.merchantLogo;
    const breadCrumbItems = {
      title: `${FromName}`,
      items: [
        { name: "Home", link: `${subDirectory}/dashboard` },
        { name: "Merchant List", link: `${subDirectory}/merchant/list` },
        { name: `${FromName}`, active: true },
      ],
    };
    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <Row className="form-div">
                <Col md={3} sm={12}>
                  <Input
                    field="merchantName"
                    label="Merchant Name"
                    name="merchantName"
                  />
                </Col>

                <Col md={3} sm={12}>
                  <Input
                    field="colorCode"
                    label="Color Code"
                    name="colorCode"
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="email"
                    label="Email"
                    name="email"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("email", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="contactNumber"
                    label="Contact No"
                    name="contactNumber"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("contactNumber", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="facebook"
                    label="Facebook"
                    name="facebook"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("facebook", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="twitter"
                    label="Twitter"
                    name="twitter"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("twitter", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="instagram"
                    label="Instagram"
                    name="instagram"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("instagram", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="minDeliveryChargeLimit"
                    label="Charge Limit"
                    name="minDeliveryChargeLimit"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) =>
                      this.validateProperty("minDeliveryChargeLimit", e)
                    }
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="deliveryCharges"
                    label="Delivery Charges"
                    name="deliveryCharges"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) =>
                      this.validateProperty("deliveryCharges", e)
                    }
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="gstPercentage"
                    label="GST Percentage"
                    name="gstPercentage"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("gstPercentage", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="gstNumber"
                    label="GST Number"
                    name="gstNumber"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("gstNumber", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="categoryImage"
                    type="file"
                    multiple
                    label="Choose Category Image"
                    onChange={(e) => {
                      this.handleImage("merchantLogo", e);
                    }}
                  />
                </Col>
                <ImageView
                  label="merchantLogo"
                  field="merchantLogo"
                  image={ImageUrl}
                  alt={"hello"}
                />
                <Col md={3} sm={12}>
                  <Input
                    field="status"
                    label="Status"
                    name="status"
                    validateOnBlur
                    validate={(e) => this.validateProperty("status", e)}
                  />
                </Col>
                <Col md={12} sm={12}>
                  <Textarea
                    field="addressLine1"
                    label="Primary Address"
                    name="addressLine1"
                    validateOnBlur
                    validate={(e) => this.validateProperty("addressLine1", e)}
                  />
                </Col>
                <Col md={12} sm={12}>
                  <Textarea
                    field="addressLine2"
                    label="Secondary Address"
                    name="addressLine2"
                  />
                </Col>
                <Col md={4} sm={12}>
                  <Textarea
                    field="aboutUs"
                    label="About Us"
                    name="aboutUs"
                    validateOnBlur
                    validate={(e) => this.validateProperty("aboutUs", e)}
                  />
                </Col>
                <Col md={4} sm={12}>
                  <Textarea
                    field="terms"
                    label="Terms"
                    name="terms"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("terms", e)}
                  />
                </Col>
                <Col md={4} sm={12}>
                  <Textarea
                    field="policy"
                    label="Policy"
                    name="policy"
                    // onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("policy", e)}
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

export default withSnackbar(AddContact);
