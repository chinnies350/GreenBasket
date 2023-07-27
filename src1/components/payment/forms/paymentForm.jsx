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
import {
  addPaymentDetails,
  updatePaymentDetails,
} from "service/paymentService";

import { subDirectory } from "../../../config.json";

class AddContact extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  state = {
    data: {},
    status: [
      { id: "A", name: "Active" },
      { id: "D", name: "InActive" },
    ],
  };

  async componentDidMount() {
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
    data.deliveryCharges = data.deliveryCharges;
    await this.setState({ data, id: data.merchantId });
    try {
      await this.formApi.setValues(data);
    } catch (err) {}
  };

  schema = {
    redirectUrl: Joi.string().required().label("Redirect Url"),
    cancelUrl: Joi.string().required().label("Cancel Url"),
    secureUrl: Joi.string().required().label("Secure Url"),
    merchantId: Joi.number().required().label("Merchant Id"),
    upiId: Joi.number().required().label("Upi Id"),
    accessCode: Joi.string().required().label("Access Code"),
    workingKey: Joi.string().required().label("Working Key"),
  };

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name);
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  setFormApi = (formApi) => {
    this.formApi = formApi;
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
      response = await addPaymentDetails(data);
      console.log(response);
    } else {
      response = await updatePaymentDetails(data);
      console.log(data, response);
    }
    if (response.data.statusCode !== 1)
      return this.addNotification(response.data.data, "danger");
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.message);
      setTimeout(`location.href = '${subDirectory}/payment/list';`);
    }
  };

  resetForm = async () => {
    this.formApi.reset();
    let path = `${subDirectory}/payment/list`;
    const {
      match: {
        params: { pageName },
      },
    } = this.props.props;
    if (pageName === "editform") {
      setTimeout(() => {
        this.props.props.history.push({
          pathname: path,
        });
      }, 3000);
    }
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
    const {
      match: {
        params: { pageName },
      },
    } = this.props.props;
    if (pageName === "addform") {
      FromName = "Add Payment";
    } else {
      FromName = "Edit Payment";
    }
    // const logo = this.props.props.location.state.row.merchantLogo;
    const breadCrumbItems = {
      title: `${FromName}`,
      items: [
        { name: "Home", link: `${subDirectory}/dashboard` },
        { name: "Payment", link: `${subDirectory}/payment/list` },
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
                    field="merchantId"
                    label="Merchant Id"
                    name="merchantId"
                  />
                </Col>

                <Col md={3} sm={12}>
                  <Input
                    field="paymentType"
                    label="Payment Type"
                    name="paymentType"
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="accessCode"
                    label="AccessCode"
                    name="accessCode"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("accessCode", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="workingKey"
                    label="Working Key"
                    name="workingKey"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("workingKey", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="redirectUrl"
                    label="Redirect Url"
                    name="redirectUrl"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("redirectUrl", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="cancelUrl"
                    label="Cancel Url"
                    name="cancelUrl"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("cancelUrl", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="secureUrl"
                    label="Secure Url"
                    name="secureUrl"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("secureUrl", e)}
                  />
                </Col>
                <Col md={3} sm={12}>
                  <Input
                    field="upiId"
                    label="Upi Id"
                    name="upiId"
                    onChange={this.handleChange}
                    validateOnBlur
                    validate={(e) => this.validateProperty("upiId", e)}
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
