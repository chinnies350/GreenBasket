import "rc-datetime-picker/dist/picker.min.css";

import { CustomRadio } from "components/common/forms/custom-radio";
import { CustomSelect } from "components/common/forms/custom-select";
import { Input } from "components/common/forms/Input";
import { Textarea } from "components/common/forms/textarea";
import { Form } from "informed";
import Joi from "joi-browser";
import _ from "lodash";
import moment from "moment";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import React, { Fragment, PureComponent, createRef } from "react";
import * as IosIcons from "react-icons/io";
import ReactNotification from "react-notifications-component";
import { Button, Col, Container, Row } from "reactstrap";
import { getJwt, sendOtp } from "service/authService";
import { getPincodedetails } from "service/cartService";
import { getLocation } from "service/location";
import { placeOrder, sendSms } from "service/ordersService";
import {
  getProfileDetails,
  updateProfileDetails,
} from "service/profileService";
import { withSnackbar } from "notistack";

import { subDirectory } from "../../../config.json";

class Address extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newAddress: false,
      addType1: "",
      addType2: "",
      otpfeild: false,
      isCOD: false,
      isOTPsended: false,
      isOTPverified: false,
      isUpi: false,
      btnName: "Send OTP",
      data: {},
      paymode: ["Online Payment", "Cash on Delivery", "Upi"],
      addressList: [],
      pincodes: [],
      deliverytime: ["Standard Delivery Time", "Preferred Delivery Time"],
      addressTypeList: ["Home", "Office"],
      date: new Date(),
      stdDeliveryTime: moment().add(1, "hours").format("YYYY-MM-DD HH:mm"),
      preDeliveryTime: moment().add(1, "hours").format("YYYY-MM-DD HH:mm"),
    };

    this.notificationDOMRef = createRef();
    this.preDeliverDate = createRef();
  }

  schema = {
    paymode: Joi.string().required().label("Payment Mode"),
    address: Joi.string().required().label("Address"),
    city: Joi.string().required().label("City"),
    state: Joi.string().required().label("State"),
    pincode: Joi.number().required().label("Pincode"),
    mobileNo: Joi.string()
      .min(10)
      .max(10)
      .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
      .required()
      .label("Mobile No"),
    otp: Joi.string().min(4).max(4).required().label("OTP"),
    preDeliveryTime: Joi.string().required().label("Pre Delivery Time"),
    delName: Joi.string().required().label("Delivery Name"),
    deliverytime: Joi.string().required().label("Standard Delivery Time"),
    addrType: Joi.string().required().label("Address Type"),
  };

  /**
   *  @function componentDidMount  It will run  at the startup of or app
   *
   *
   */
  componentDidMount = async () => {
    await this.getUserInfo();
    await this.profileDetails();
    await this.pincodeDetails();
    await this.dataSet();

    let res = await getLocation();

    if (res.data.statusCode === 1) {
      await this.setState({
        locations: res.data.data,
      });
    }
  };

  componentWillReceiveProps = async () => {};

  dataSet = async () => {
    const { profileData } = this.state;
    profileData[0].delName = profileData[0].userName;
    await this.formApi.setValues(profileData[0]);
    await this.setState({ delName: profileData[0].userName });
  };

  //Validating All the feilds
  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name);
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  /**
   * @function getPincodedetails  API call for getting the Pincode Details
   * @var res to store the API responce
   */
  async pincodeDetails() {
    let res = await getPincodedetails();
    if (res.data.statusCode === 1) {
      await this.setState({ pincodes: res.data.data });
    }
  }
  /**
   * API Call for getting User login details
   */
  getUserInfo = async () => {
    let res = await getJwt("__info");
    const { uid } = res;
    await this.setState({ uid: uid, userInfo: res });
  };

  /**
   * Storeing the form datas
   */
  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  sendUserSms = async () => {
    const data = this.formApi.getState().values;
    const { phone } = data;
    let mobileNo = phone;
    let orderId = "1";
    const res = await sendSms(
      mobileNo,
      `Thanks For Your Visit! Link For Payment http://192.168.1.51:3000/easyfruitveg/upi/upiPayment?OrderId=${orderId}`

      // `Thanks For Your Visit! Link For Payment http://ttdc.in/bar/bar/upiTransaction?PaymentStatus=&OrderId=${this.state.OrderHeaderSl}`

      // `Thanks For Your Visit! Link For Payment http://192.168.1.179:3000/bar/bar/upiTransaction`
    );

    console.log(res, "upiData");
    if (res) {
      this.addNotification("Please Go to the page we have sent you", "Success");
    } else {
      this.addNotification("Please dont Go to the page we have sent you", "Warning");
    }
  };
  /**
   * Open the Address After
   */

  toggleAddress = async () => {
    await this.setState((state) => ({ newAddress: !state.newAddress }));
  };
  /**
   * API call for getting the user profile details
   */

  profileDetails = async () => {
    const { uid } = this.state;
    let params = `userId=${uid}`;
    let res = await getProfileDetails(params);
    if (res.data.statusCode) {
      await this.setState({ profileData: res.data.data });
      return await this.addressListPrepare();
    } else return await this.setState({ profileData: [] });
  };

  /**
   * Converting the Object to list for dispalying the address
   */

  addressListPrepare = async () => {
    try {
      const {
        address1,
        address2,
        city1,
        city2,
        pincode1,
        pincode2,
        phone,
        secondaryContactNo,
        userName,
        state1,
        state2,
      } = this.state.profileData[0];
      let addressList = [
        {
          address: address1,
          city: city1,
          pinCode: pincode1,
          state: state1,
          phone: phone,
          name: userName,
        },
        {
          address: address2,
          city: city2,
          pinCode: pincode2,
          state: state2,
          phone: secondaryContactNo,
          name: userName,
        },
      ];
      await this.setState({ addressList });
    } catch (err) {
      await this.setState({ addressList: [] });
    }
  };

  /**
   * Displaying the address design
   */
  addressLoad = () => {
    const { addressList } = this.state;
    console.log(this.formApi.getState().values);

    return _.map(addressList, (v, i) => (
      <div className="hole-div">
        <div className="address-div">
          <p className="cover-p">
            <span className="name">{v["name"]}</span>
            <span className="ml-3 name">{v["phone"]}</span>
          </p>
          <span className="cover-p info">
            {v["address"] ? v["address"] + "," : null}
            {v["city"] ? v["city"] + "," : null}
            {v["state"] ? v["state"] + "-" : null}{" "}
            <span className="name">{v["pinCode"]}</span>
          </span>
          {v["address"] && v["city"] && v["state"] ? (
            <button
              type="button"
              className={`btn-style btn-font btn-bg ${
                this.state.addressIndex === i ? "bg-success" : ""
              }`}
              onClick={async () => await this.setState({ addressIndex: i })}
            >
              {" "}
              Deliver to this address{" "}
              {this.state.addressIndex === i ? (
                <span class="color-success">✔</span>
              ) : (
                ""
              )}
            </button>
          ) : (
            <span
              style={{
                fontSize: "0.7rem",
                background: "red",
                padding: "0.1rem 01rem",
                borderRadius: "1rem",
                color: "#fff",
              }}
            >
              Please update your Address
            </span>
          )}
        </div>
        <div className="edit-btn-div">
          <button
            type="button"
            className="edit-btn"
            onClick={() => this.editAddress(i)}
          >
            EDIT
          </button>
        </div>
      </div>
    ));
  };

  /**
   * Make the displaying address editable form
   */

  editAddress = async (index) => {
    await this.setState({ addressIndex: index });
    await this.toggleAddress();
    const obj = this.state.profileData[0];
    const state = _.assign({}, this.state);
    delete state["profileData"];
    _.assign(obj, state);
    if (!index) {
      obj["address2"] = obj["address1"];
      obj["city2"] = obj["city1"];
      obj["pincode2"] = obj["pincode1"];
      obj["state2"] = obj["state1"];
      obj["secondaryContactNo"] = obj["phone"];
    }
    await this.formApi.setValues(obj);
  };

  /**
   * Store the updated Address to server
   */
  updateAddress = async () => {
    if (!this.checkPincode())
      return this.addNotification(
        "Our Service is not available for this zone. Soon we will give a best Service",
        "warning"
      );
    try {
      const data = this.formApi.getState().values;
      const {
        address2,
        pincode2,
        city2,
        state2,
        secondaryContactNo,
        addrType,
      } = data;
      const { addressIndex } = this.state;
      let postData = this.state.profileData[0];

      postData["defaultAddress"] = "1";
      postData["name"] = postData["userName"];
      postData["primaryContactNo"] = postData["phone"];
      let obj = {};
      if (!addressIndex) {
        obj = {
          address1: address2,
          city1: city2,
          pincode1: pincode2,
          state1: state2,
          primaryContactNo: secondaryContactNo,
          addType1: addrType.charAt(0).toLowerCase(),
        };
        await _.assign(postData, obj);
      } else {
        obj = {
          address2: address2,
          city2: city2,
          pincode2: pincode2,
          state2: state2,
          secondaryContactNo: secondaryContactNo,
          addType2: addrType.charAt(0).toLowerCase(),
        };
        await _.assign(postData, obj);
      }
      let res = await updateProfileDetails(postData);

      if (res.data.statusCode === 1) {
        await this.profileDetails();
        await this.toggleAddress();
        return this.addNotification(res.data.message);
      }
      return this.addNotification(res.data.message, "warning");
    } catch (err) {
      // this.addNotification("Addresss Updated Successfully");
      // await this.toggleAddress();

      return this.addNotification("Update your profile first!!!", "warning");
    }
  };
  /**
   * Storing the values to state according to the changes
   */

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;
    await this.setState({ [name]: value });
  };

  /**
   * API call for storng the form data values
   */
  onSubmit = async () => {
    const {
      isCOD,
      isOTPverified,
      newAddress,
      otpfeild,
      isOTPsended,
      addressIndex,
    } = this.state;
    // if (isUpi && !isOTPverified && !newAddress && !isOTPsended && !isCOD) {
    //   return await this.sendSms();
    // }

    if (isCOD && !isOTPverified && !newAddress && !isOTPsended)
      return await this.sendOtp();
    if (isCOD && otpfeild && isOTPsended) return await this.checkOtp();
    if (newAddress) return await this.updateAddress();
    if (addressIndex !== undefined) return await this.delAddressChoose();
    return this.addNotification("please select delivery address", "warning");
  };

  /**
   * API call for getting OTP
   */
  sendOtp = async () => {
    const data = this.formApi.getState().values;
    const { phone } = data;
    let params = `mobileNo=${phone}&type=COD`;
    let res = await sendOtp(params);
    if (res.data.statusCode === 1)
      return await this.setState({
        sentOtp: res.data.message,
        otpfeild: true,
        isOTPsended: true,
        btnName: "Verify OTP",
      });
    return await this.setState({
      sentOtp: "",
      otpfeild: false,
      isOTPsended: false,
      btnName: "Verify OTP",
    });
  };
  /**
   * Checking the OTP values
   */
  checkOtp = async () => {
    const data = this.formApi.getState().values;
    const { sentOtp } = this.state;
    if (sentOtp !== data.otp)
      return this.addNotification("please Enter a valid OTP", "warning");
    await this.setState({ otpfeild: false, isOTPverified: true });
  };
  /**
   * Checking pincode Availablity for delivery
   */
  checkPincode = () => {
    const data = this.formApi.getState().values;
    const { pincodes } = this.state;
    if (pincodes) {
      let temp = _.filter(pincodes, (v) => v["configValue"] === data.pincode2);
      if (temp.length !== 0) return true;
      return false;
    }
  };
  /**
   * Get the delivery options
   */
  getValue = async (data) => {
    const {
      target: { value },
    } = data;
    await this.setState({ isCOD: value === "Cash on Delivery" ? true : false });
    await this.setState({ isUpi: value === "Upi" ? true : false });
  };

  getDeliveryValue = async (name, data) => {
    const {
      target: { value },
    } = data;
    await this.setState({ [name]: value });
  };
  /**
   * Delivery address choose for delivery
   */
  delAddressChoose = async () => {
    const {
      stdDeliveryTime,
      preDeliveryTime,
      uid,
      addressIndex: index,
      delName,
      isCOD,
      isOTPverified,
      isUpi,
      newAddress,
    } = this.state;
    const data = this.formApi.getState().values;
    const { phone } = data;
    const {
      address1,
      address2,
      city1,
      city2,
      pincode1,
      pincode2,
      email,
    } = this.state.profileData[0];
    let address = {
      email,
      stdDeliveryTime,
      preDeliveryTime,
      userId: uid,
      delName: delName,
      delPhone: phone,
      delAddress: address1,
      delCity: city1,
      delPincode: pincode1,
    };
    if (!index) {
      const address1 = {
        delPhone: phone,
        delAddress: address2,
        delCity: city2,
        delPincode: pincode2,
      };
      _.assign(address, address1);
    }

    if (isCOD && isOTPverified && !newAddress && !isUpi) {
      alert("cod");
      return await this.paymentLoad(address);
    }
    if (!isCOD && !newAddress && !isUpi) {
      alert("payment");
      return await this.cartDataStore(address);
    }
    if (isUpi && !isOTPverified & !isCOD && !newAddress) {
      alert("upi");
       await this.paymentLoad(address);
      return await this.sendUserSms();

    }
  };

  /**
   * Payment data prepare for COD
   */
  paymentLoad = async (address) => {
    const { data } = this.props;

    const obj = {
      deliveryStatus: "N",
      deliveredTime: "0000-00-00 00:00:00",
      deliveredBy: "",
      deliveredTo: "",

      cancellationFlag: "Y",
      cancellationReason: "",
      paymentMode: "COD",

      transactionStatus:this.state.isUpi ?"P":"S",
      failureReason: "",
    };
    await _.assign(data, address);
    await _.assign(data, obj);
    await _.assign(data, this.state);
    await this.placeOrder(data);
  };
  /**
   * Place the order to server
   */
  placeOrder = async (payload) => {
    console.log(";;;;;;;;;;;;;;;;;;;; place order json");

    try {
      const { transactionStatus } = payload;
      const res = await placeOrder(payload);
      console.log(";;;;;;;;;;;;;;;;;;;; place order json", res);
      const {
        data: { statusCode, data },
      } = res;
      console.log(";;;;;;;;;;;;;;;;;;;; place order json", res);

      if (statusCode) {
        this.addNotification("Order was Placed Successfully");
        let temp = data[0];
        temp["transactionStatus"] = transactionStatus;
        return this.redirectTo(temp, "forward");
      }
      return this.addNotification(
        "Something went wrong please try again after some time",
        "danger"
      );
    } catch (err) {}
  };
  /**
   * To store the component data in parent component
   */
  cartDataStore = async (address) => {
    const { cartDataStore } = this.props;
    await cartDataStore(address);
  };

  /**
   * to get the delivery date with timing
   */
  dateChange = async (dateTime) => {
    let preDeliveryTime;
    const currentHour = dateTime.format("HH");
    if (parseInt(currentHour) >= 7 && parseInt(currentHour) < 21) {
      preDeliveryTime = dateTime.format("YYYY-MM-DD HH:mm");
      this.setState({ preDeliveryTime });
      await this.formApi.setValue(
        "preDeliveryTime",
        dateTime.format("YYYY-MM-DD HH:mm")
      );
    } else {
      this.addNotification("we cant deliver this timings", "danger");
    }
    this.preDeliverDate.current.focus();
  };
  /**
   *
   * @param {String} message It was a notification message
   * @param {*} variant It was defining the notification style
   */
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
  /**
   * redirect its based on the direction
   */
  redirectTo = (data = {}, direction = "back") => {
    const { props } = this.props;
    if (direction === "back")
      return props.history.push(`${subDirectory}user/home`);
    return props.history.push({
      pathname: `${subDirectory}/user/payment`,
      state: data,
    });
  };

  render() {
    const {
      newAddress,
      btnName,
      otpfeild,
      isOTPverified,
      isCOD,
      isUpi,
      delivery,
      preDeliveryTime,
      addressTypeList,
    } = this.state;
    const { handleBack } = this.props;
    const { handleNext } = this.props;
    console.log(this.props, this.state, "gdsjg");
    return (
      <Fragment>
        <ReactNotification ref={this.notificationDOMRef} />

        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formState }) => (
            <Container>
              <div className="well cartwell ">
                <Row className="adddetails">
                  <Col md={12} className="contactformrowpadding">
                    <Row>
                      <Col sm={6} md={6}>
                        <p style={{ color: "#FF9800" }}>
                          Your Standard Delivery Time :{" "}
                          {this.state.stdDeliveryTime}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3} sm={12}>
                        <CustomRadio
                          field="deliverytime"
                          label="Delivery Time"
                          name="delivery"
                          options={this.state.deliverytime}
                          checked={this.state.checked}
                          validateOnBlur
                          validate={(e) =>
                            this.validateProperty("deliverytime", e)
                          }
                          onChange={(e) => this.getDeliveryValue("delivery", e)}
                        />
                      </Col>
                    </Row>
                    <Row>
                      {delivery === "Preferred Delivery Time" && (
                        <Col md={6} sm={12}>
                          <DatetimePickerTrigger
                            minDate={moment()}
                            maxDate={moment().add(1, "day")}
                            moment={moment(preDeliveryTime)}
                            format={"YYYY-MM-DD HH:mm"}
                            onChange={this.dateChange}
                          >
                            <Input
                              field="preDeliveryTime"
                              name="preDeliveryTime"
                              autocomplete="off"
                              label="Pre Delevery Time"
                              validateOnBlur
                              validate={(e) =>
                                this.validateProperty("preDeliveryTime", e)
                              }
                              forwardedRef={this.preDeliverDate}
                            />
                          </DatetimePickerTrigger>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      <Col md={3} sm={12}>
                        <CustomRadio
                          field="paymode"
                          label="Payment Mode"
                          name="paymode"
                          options={this.state.paymode}
                          validateOnBlur
                          validate={(e) => this.validateProperty("paymode", e)}
                          onChange={(e) => this.getValue(e)}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3}>
                        <Input
                          field="delName"
                          name="delName"
                          label="Delivery Name"
                          onChange={this.handleChange}
                          validateOnBlur
                          validate={(e) => this.validateProperty("delName", e)}
                        />
                      </Col>
                      <Col md={3}>
                        <Input
                          field="phone"
                          name="mobile"
                          label="Mobile No"
                          onChange={this.handleChange}
                          readOnly={isOTPverified}
                          validateOnBlur
                          validate={(e) => this.validateProperty("mobileNo", e)}
                        />
                      </Col>
                      {isCOD && !isOTPverified && otpfeild && !newAddress && (
                        <Fragment>
                          <Col md={3}>
                            <Input
                              field="otp"
                              name="otp"
                              label="OTP"
                              validateOnBlur
                              validate={(e) => this.validateProperty("otp", e)}
                              onChange={this.handleChange}
                            />
                          </Col>
                        </Fragment>
                      )}
                      <Col md={3} style={{ paddingTop: "0.4rem" }}>
                        {isCOD && !isOTPverified && otpfeild && !newAddress && (
                          <Button
                            type="button"
                            onClick={this.sendOtp}
                            color={"warning"}
                            className="mt-3 mr-2"
                            size={"sm"}
                          >
                            Resend OTP
                          </Button>
                        )}
                        {isCOD && !isOTPverified && !newAddress ? (
                          <Fragment>
                            <Button
                              type="submit"
                              color={"success"}
                              size={"sm"}
                              className="mt-3"
                            >
                              {btnName}
                            </Button>
                          </Fragment>
                        ) : (
                          isOTPverified && (
                            <p className="otp-verified">
                              {" "}
                              <IosIcons.IoIosCheckmark
                                style={{ fontSize: "1.5rem" }}
                              />{" "}
                              OTP Verified
                            </p>
                          )
                        )}
                      </Col>
                    </Row>
                    <Row>
                      {!newAddress && (
                        <Col md={12} id="savedaddress" name="btn">
                          <p className="note">
                            Note :{" "}
                            <span> Please select the delivery address </span>
                          </p>

                          {this.addressLoad()}
                        </Col>
                      )}
                      <br />
                      {/* {!newAddress && <Col md={12} name="btn">
                      <p>Click <span style={{ color: "#004cff" }} onClick={() => this.toggleAddress()}>here </span> add new address.</p>
                    </Col>} */}
                    </Row>
                    {newAddress && (
                      <Fragment>
                        <Row>
                          <Col md={3} sm={12}>
                            <CustomRadio
                              field="addrType"
                              label="Address Type"
                              name="addrType"
                              options={addressTypeList}
                              checked={this.state.checked}
                              validateOnBlur
                              validate={(e) =>
                                this.validateProperty("addrType", e)
                              }
                              onChange={(e) =>
                                this.getDeliveryValue("addrType", e)
                              }
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col md={3} name="btn">
                            <Input
                              field="city2"
                              name="city"
                              label="City"
                              onChange={this.handleChange}
                              validateOnBlur
                              validate={(e) => this.validateProperty("city", e)}
                            />
                          </Col>
                          <Col md={3} name="btn">
                            <Input
                              field="state2"
                              name="state"
                              label="State"
                              onChange={this.handleChange}
                              validateOnBlur
                              validate={(e) =>
                                this.validateProperty("state", e)
                              }
                            />
                          </Col>
                          <Col md={3} name="btn">
                            {/* <Input field="pincode2" name="pincode" label="Pincode" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('pincode', e)} /> */}
                            <div class="form-group">
                              <CustomSelect
                                field="pincode2"
                                name="pincode"
                                label="Pincode"
                                required
                                getOptionValue={(option) => option.configValue}
                                getOptionLabel={(option) => option.configValue}
                                options={this.state.locations}
                                onChange={this.handleChange}
                                validateOnBlur
                                validate={(e) =>
                                  this.validateProperty("pincode", e)
                                }
                              />
                              <div class="help-block with-errors"></div>
                            </div>
                          </Col>
                          <Col md={3} name="btn">
                            <Input
                              field="secondaryContactNo"
                              name="Mobile No"
                              label="Mobile No"
                              onChange={this.handleChange}
                              validateOnBlur
                              validate={(e) =>
                                this.validateProperty("mobileNo", e)
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} name="btn">
                            <Textarea
                              field="address2"
                              label="Address"
                              name="address1"
                              onChange={this.handleChange}
                              validateOnBlur
                              validate={(e) =>
                                this.validateProperty("address", e)
                              }
                            />
                          </Col>

                          <Col style={{ textAlign: "right" }}>
                            <Button
                              color={"warning"}
                              className="mr-3"
                              size={"sm"}
                              onClick={this.toggleAddress}
                            >
                              Cancel
                            </Button>
                            <Button
                              disabled={formState.invalid}
                              color={"success"}
                              size={"sm"}
                            >
                              Update & Deliver to this address
                            </Button>
                          </Col>
                        </Row>
                      </Fragment>
                    )}
                  </Col>
                </Row>
              </div>
              <div className="text-right">
                <Button
                  variant="contained"
                  type="button"
                  color="warning"
                  size={"sm"}
                  className="mr-3"
                  onClick={() => handleBack()}
                >
                  {" "}
                  Back{" "}
                </Button>
                {(isOTPverified || isCOD || isUpi) && (
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    size={"sm"}
                    className="ml-3"
                    // onClick={}
                  >
                    {" "}
                    Proceed to checkout{" "}
                  </Button>
                )}
              </div>
            </Container>
          )}
        </Form>
      </Fragment>
    );
  }
}

export default withSnackbar(Address);
