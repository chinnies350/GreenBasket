import React, {  Component } from "react";
import { withRouter } from "react-router-dom";

import Home from 'components/user/form/userHome';
import { getCookieData } from "./CookiesFunc";
import { LoginCurrentMerchantId } from "../../service/authService";
import { subDirectory } from "../../config.json";


class MerchantRouting extends Component {
    async componentDidMount() {
      try {
        const merchantData = JSON.parse(
          '{"' +
            decodeURI(
              this.props.location.search
                .substring(1)
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
            ) +
            '"}'
        );

        console.log(merchantData)

        // merchantData
        await this.saveToCookie(merchantData);
      } catch {
        window.location.href = "/Error"
    }
    }
  
    saveToCookie = async (merchantData) => {

        console.log(merchantData)

      try {
        await LoginCurrentMerchantId(merchantData);
        if (getCookieData("refId") === ""){
            window.location.href = "/Error"

        }else{
            var routing=`${subDirectory}/user/home`
            this.props.history.push(routing);
            window.location.reload("/");
        }
        // else if (getCookieData("userRole") === "Sadmin"){
        //   this.props.history.push("/HotelDashboard");
        //   window.location.reload("/");
        // }
        setTimeout(
          function () {
            this.setState({ loading: false });
          }.bind(this),
          800
        );
      } catch {

        window.location.href = "/Error"

        // window.location.href = "http://ttdc.in/";
      }
    };
  
    render() {
      return (
        <div>
          {/* <Loader loading={true} /> */}
        </div>
      );
    }
  }
  
  export default withRouter(MerchantRouting);