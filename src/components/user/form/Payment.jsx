import "styles/forms.css";

import _ from "lodash";
import { withSnackbar } from "notistack";
import React, { Fragment, PureComponent } from "react";
import ReactNotification from "react-notifications-component";
import { Button } from "reactstrap";
import { placeOrder } from "service/ordersService";
import { paymentGatwayURI } from "config.json";

import { subDirectory } from "../../../config.json";

class Payment extends PureComponent {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  state = {
    transactionStatus: "",
    orderId: "",
    paymentMode: "",
    failureReason: "",
  };

  /**
   * To open a payment gate way
   */
  paymentLoad = () => {
    const {
      data: { netAmount, email, delPhone },
    } = this.props;
    try {
      return (
        <iframe
          title="Payment"
          id="paymentFrame"
          ref={"paymentFrame"}
          className="payment-frame"
          src={`${paymentGatwayURI}/about?amt=${netAmount}&email=${email}&mobileno=${delPhone}`}
          onLoad={this.iframeLoad}
        ></iframe>
      );
    } catch (err) {}
  };

  /**
   *  It was used to deduct the pament status
   */

  iframeLoad = async (e) => {
    var ipath = document.getElementById("paymentFrame");
    const htmlcont = ipath.contentWindow.document.body.innerHTML;
    const frameURL = ipath.contentWindow.location.href;
    if (frameURL === `${paymentGatwayURI}/ccavRequestHandler`) {
    }
    if (frameURL === `${paymentGatwayURI}/ccavResponseHandler`) {
      let obj = {
        deliveryStatus: "N",
        deliveredTime: "0000-00-00 00:00:00",
        deliveredBy: "",
        deliveredTo: "",
        orderId: htmlcont.split("&amp;")[0].split("=")[1],
        cancellationFlag: "Y",
        cancellationReason: htmlcont.split("&amp;")[8].split("=")[1],
        paymentMode: "Online Payment" || "",

        transactionStatus:
          htmlcont.split("&amp;")[3].split("=")[1] === "Aborted" ? "N" : "S",
        failureReason: htmlcont.split("&amp;")[4].split("=")[1] || "",
      };
      return this.payloadForm(obj);
    }
  };

  /**
   * To Prepare the payload for place the order
   */

  payloadForm = async (payment = {}) => {
    let { data } = this.props;
    payment["uid"] = data["userId"];
    payment["orderDate"] = data["preDeliveryTime"];
    await _.assign(data, payment);
    await this.placeOrder(data);
  };

  /**
   *  Place the user order to server
   */
  placeOrder = async (payload) => {
    try {
      const { transactionStatus } = payload;
      let tansData = { transactionStatus };
      const res = await placeOrder(payload);
      const {
        data: { statusCode, data },
      } = res;
      if (statusCode) {
        if (transactionStatus === "S")
          await this.addNotification("Order was Placed Successfully");
        if (transactionStatus !== "S")
          await this.addNotification("Order was Canceled BY User.", "warning");
        _.assign(tansData, data[0]);
        return this.redirectTo(tansData, "forward");
      }
      return this.addNotification(
        "Something went wrong please try again after some time",
        "error"
      );
    } catch (err) {}
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

  redirectTo = (data = {}, direction = "back") => {
    const { props } = this.props;
    return props.history.push({
      pathname: `${subDirectory}/user/payment`,
      state: data,
    });
  };

  render() {
    const { handleBack } = this.props;
    return (
      <Fragment>
        <ReactNotification ref={this.notificationDOMRef} />
        {this.paymentLoad()}
        <div className="text-right">
          <Button onClick={() => handleBack()} color="warning" size={"sm"}>
            {" "}
            Back
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default withSnackbar(Payment);
