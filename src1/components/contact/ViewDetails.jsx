import BreadCrumb from "components/common/forms/BreadCrumb";
import { Input } from "components/common/forms/Input";
import { Textarea } from "components/common/forms/textarea";
import ImageView from "components/common/forms/ImageView";
import { Form } from "informed";
import React, { Component, Fragment } from "react";
import { Col, Row } from "reactstrap";

import { subDirectory } from "../../config.json";

export default class ViewDetails extends Component {
  componentDidMount() {
    const {
      location: { state },
    } = this.props.props;
    return this.formStateCheck(state.row);
  }

  formStateCheck = async (data) => {
    data.deliveryCharges = data.deliveryCharges;
    await this.setState({ data, id: data.merchantId });
    try {
      await this.formApi.setValues(data);
    } catch (err) {}
  };

  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  render() {
    const breadCrumbItems = {
      title: "View Contact",
      items: [
        { name: "Home", link: `${subDirectory}/dashboard` },
        { name: "Contact List", link: `${subDirectory}/contact/list` },
        { name: `View Contact`, active: true },
      ],
    };
    console.log(
      this.props.props.location.state.row.merchantLogo,
      this.props,
      "gjukjkjk"
    );
    const  logo  =  this.props.props.location.state.row.merchantLogo;
    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <Form getApi={this.setFormApi}>
          {({ formApi, formState }) => (
            <Row className="form-div">
              <Col md={3} sm={12}>
                <Input field="email" label="Email" name="email" readOnly />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="merchantName"
                  label="Merchant Name"
                  name="merchantName"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="merchantId"
                  label="Merchan tId"
                  name="merchantId"
                  readOnly
                />
              </Col>

              <Col md={3} sm={12}>
                <Input
                  field="colorCode"
                  label="Color Code"
                  name="colorCode"
                  readOnly
                />
              </Col>

              <Col md={3} sm={12}>
                <Input
                  field="contactNumber"
                  label="Contact No"
                  name="contactNumber"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="facebook"
                  label="Facebook"
                  name="facebook"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="instagram"
                  label="Instagram"
                  name="instagram"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="twitter"
                  label="Twitter"
                  name="twitter"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="minDeliveryChargeLimit"
                  label="Charge Limit"
                  name="minDeliveryChargeLimit"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="deliveryCharges"
                  label="Delivery Charges"
                  name="deliveryCharges"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="gstPercentage"
                  label="GST Percentage"
                  name="gstPercentage"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input
                  field="gstNumber"
                  label="GST Number"
                  name="gstNumber"
                  readOnly
                />
              </Col>
              <Col md={3} sm={12}>
                <Input field="status" label="Status" name="status" readOnly />
              </Col>
              <ImageView
                label="merchantLogo"
                
                image={logo}
              />
              <img src="" />
              <Col md={12} sm={12}>
                <Textarea
                  field="addressLine1"
                  label="Primary Address"
                  name="addressLine1"
                  readOnly
                />
              </Col>
              <Col md={12} sm={12}>
                <Textarea
                  field="addressLine2"
                  label="Secondary Address"
                  name="addressLine2"
                  readOnly
                />
              </Col>
              <Col md={12} sm={12}>
                <Textarea
                  field="aboutUs"
                  label="About Us"
                  name="aboutUs"
                  readOnly
                />
              </Col>
              <Col md={12} sm={12}>
                <Textarea field="terms" label="Terms" name="terms" readOnly />
              </Col>
              <Col md={12} sm={12}>
                <Textarea
                  field="policy"
                  label="Policy"
                  name="policy"
                  readOnly
                />
              </Col>
            </Row>
          )}
        </Form>
      </Fragment>
    );
  }
}
