import BreadCrumb from "components/common/forms/BreadCrumb";
import { Input } from "components/common/forms/Input";
import { Textarea } from "components/common/forms/textarea";
import { Form } from "informed";
import Joi from "joi-browser";
import { withSnackbar } from "notistack";
import React, { Fragment, PureComponent } from "react";
import ReactNotification from "react-notifications-component";
import { Col, Row } from "reactstrap";
import { signUp } from "service/authService";
import { updateUserDetails } from "service/customerService";

import { subDirectory } from "../../../config.json";

class AddUser extends PureComponent {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  state = {
    data: {},
  };

  async componentDidMount() {
    const { formType } = this.props;
    if (formType === "edit") {
      const {
        location: { state },
      } = this.props.props;
      return this.formStateCheck(state.row);
    }
  }

  formStateCheck = async (data) => {
    data.name = data.userName;
    data.contact = data.phone;
    await this.setState({ data, userId: data.userId });
    try {
      await this.formApi.setValues(data);
    } catch (err) {}
  };

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name);
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  schema = {
    name: Joi.string().required().label("Name"),
    merchantId: Joi.string().required().label("Merchan tId"),
    email: Joi.string().email().required().label("Mail"),
    contact: Joi.string()
      .min(10)
      .max(10)
      .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
      .required()
      .label("Contact Number"),
    password: Joi.string().required().label("Password"),
    confirmPassword: Joi.string().required().label("Confirm Password"),
    address1: Joi.string().required().label("Address"),
    city1: Joi.string().required().label("City"),
    state1: Joi.string().required().label("State"),
    pincode1: Joi.string().required().label("Pincode"),
  };

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;
    await this.setState({ data });
  };

  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  onSubmit = async () => {
    let response;
    const data = this.formApi.getState().values;
    console.log(data);
    const { formType } = this.props;
    if (formType === "add") {
      if (data.password !== data.confirmPassword) {
        this.addNotification("Password Mismatch", "warning");
        this.formApi.setValue("password", "");
        this.formApi.setValue("confirmPassword", "");
      } else {
        const { password, name, email, contact } = data;
        let payload = {
          password: password,
          name: name,
          email: email,
          contact: contact,
          userRole: "U",
        };
        let res = await signUp(payload);
        if (res.data.statusCode === 1) {
          this.addNotification(res.data.message);
          this.resetForm();
          this.props.props.history.push(`${subDirectory}/customer/details`);
        } else if (res.data.statusCode !== 1) {
          this.addNotification(res.data.message, "warning");
        }
      }
    } else {
      response = await updateUserDetails(data);
      console.log(data, response);

      if (response.data.statusCode !== 1)
        return this.addNotification(response.data.data, "danger");
      if (response.data.statusCode === 1) {
        this.addNotification(response.data.message);
        this.resetForm();
      }
    }
  };

  resetForm = async () => {
    this.formApi.reset();
    let path = `${subDirectory}/customer/details`;
    const { formType } = this.props;
    if (formType === "edit") {
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
    const { formType } = this.props;
    const breadCrumbItems = {
      title: formType + " Customer",
      items: [
        { name: "Home", link: `${subDirectory}/dashboard` },
        { name: "User Details", link: `${subDirectory}/customer/details` },
        { name: `${formType} Customer `, active: true },
      ],
    };
    return (
      <Fragment>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <BreadCrumb data={breadCrumbItems} />
              <ReactNotification ref={this.notificationDOMRef} />
              <div className="form-div">
                <Row style={{ margin: "10px" }}>
                  <Col md={4} sm={12}>
                    <Input
                      field="userName"
                      label="Name"
                      name="userName"
                      onChange={this.handleChange}
                      validateOnBlur
                      validate={(e) => this.validateProperty("name", e)}
                    />
                  </Col>
                  {/* <Col md={4} sm={12}>
                    <Input
                      field="merchantId"
                      label="Merchant Id"
                      name="merchantId"
                      readOnly
                      validateOnBlur
                    />
                  </Col> */}
                  <Col md={4} sm={12}>
                    <Input
                      field="email"
                      label="Email"
                      name="email"
                      onChange={this.handleChange}
                      validateOnBlur
                      validate={(e) => this.validateProperty("email", e)}
                    />
                  </Col>
                  <Col md={4} sm={12}>
                    <Input
                      field="primaryPhone"
                      label="Contact No"
                      maxLength="10"
                      name="primaryPhone"
                      onChange={this.handleChange}
                      validateOnBlur
                      validate={(e) => this.validateProperty("contact", e)}
                    />
                  </Col>
                </Row>
                {this.props.formType === "add" && (
                  <Row style={{ margin: "10px" }}>
                    <Col md={4} sm={12}>
                      <Input
                        field="password"
                        type="password"
                        label="Password"
                        name="password"
                        onChange={this.handleChange}
                        validateOnBlur
                        validate={(e) => this.validateProperty("password", e)}
                      />
                    </Col>
                    <Col md={4} sm={12}>
                      <Input
                        field="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                        validateOnBlur
                        validate={(e) =>
                          this.validateProperty("confirmPassword", e)
                        }
                      />
                    </Col>
                  </Row>
                )}
                {this.props.formType === "edit" && (
                  <Row style={{ margin: "10px" }}>
                    <Col md={4} sm={12}>
                      <Textarea
                        field="delAddress1"
                        label="Address"
                        name="delAddress1"
                        onChange={this.handleChange}
                        validateOnBlur
                        validate={(e) => this.validateProperty("address1", e)}
                      />
                    </Col>
                    <Col md={4} sm={12}>
                      <Input
                        field="delCity1"
                        label="City"
                        name="delCity1"
                        onChange={this.handleChange}
                        validateOnBlur
                        validate={(e) => this.validateProperty("city1", e)}
                      />
                    </Col>
                    <Col md={4} sm={12}>
                      <Input
                        field="delState1"
                        label="State"
                        name="delState1"
                        onChange={this.handleChange}
                        validateOnBlur
                        validate={(e) => this.validateProperty("state1", e)}
                      />
                    </Col>
                    <Col md={4} sm={12}>
                      <Input
                        field="delPincode1"
                        label="Pincode"
                        name="delPincode1"
                        onChange={this.handleChange}
                        validateOnBlur
                        validate={(e) => this.validateProperty("pincode1", e)}
                      />
                    </Col>
                  </Row>
                )}
              </div>
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

export default withSnackbar(AddUser);
