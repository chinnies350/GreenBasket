import React, { Component } from "react";
import { Table } from "reactstrap";
import "../../styles/upiTransactionDetails.scss";
import logo from "../../images/userimages/EFV-Logo.png";
import { getOrderbyId } from "../../service/ordersService";
export class upiPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
        data:[]
    };
  }

componentDidMount = async()=>{

    const res = await getOrderbyId();
}

  render() {
      const {data} = this.state;
    console.log(this.props);
    return (
      <div>
        <div className="col-sm-4 ">
          <img src={logo} className="logoimg" alt="" />
        </div>
        <div className="e-receipt ">
          <span>E-Receipt:Bhuvi</span>
        </div>
        <div className="content2">
          <div
            className="sgst"
            style={{ display: "flex", marginBottom: "-19px", flex: 1 }}
          >
            <div style={{ display: "flex", flex: 0.5, marginLeft: "0.2vh" }}>
              <p className="data">Order Date</p>
            </div>
            <div style={{ display: "flex", flex: 0.03 }}>
              <p className="data">:</p>
            </div>
            <div style={{ display: "flex", flex: 1.17 }}>
              {/* <p className="data">
                {OrderDate.split("T")[0]}, {OrderDate.slice(11, 16)}
              </p> */}
            </div>
          </div>

          <div
            className="sgst"
            style={{ display: "flex", marginBottom: "-19px", flex: 1 }}
          >
            <div style={{ display: "flex", marginLeft: "0.2vh", flex: 0.5 }}>
              <p className="data">Booking Type</p>
            </div>
            <div style={{ display: "flex", flex: 0.03 }}>
              <p className="data">:</p>
            </div>
            <div style={{ display: "flex", flex: 1.17 }}>
              <p className="data">Onilne</p>
            </div>
          </div>
          {/* {GuestMobile != "null" && GuestMobile != "" && ( */}
          <div
            className="sgst"
            style={{ display: "flex", marginBottom: "-19px", flex: 1 }}
          >
            <div style={{ display: "flex", marginLeft: "0.2vh", flex: 0.5 }}>
              <p className="data">Guest Mobile</p>
            </div>
            <div style={{ display: "flex", flex: 0.03 }}>
              <p className="data">:</p>
            </div>
            <div style={{ display: "flex", flex: 1.17 }}>
              <p className="data">9629848645</p>
            </div>
          </div>
          {/* )} */}
        </div>
        <div className="post-table">
          <Table>
            <thead>
              <tr>
                <th>
                  <span className="text1">Order Name</span>
                </th>
                <th>
                  <span className="text1">Quantity</span>
                </th>
                <th>
                  <span className="text1">Amount</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <td></td>
              <td></td>
              <td></td>
            </tbody>
            {/* <tbody>
              {BOrderDetails.map((bar, index) => (
                <tr>
                  {bar.BevarageQuantityType === "B" ? (
                    <td>
                      <span
                        style={{
                          fontSize: "14px",
                          marginLeft: "-10px",
                          marginRight: "30px",
                        }}
                      >
                        {bar.BeverageName}(
                        {bar.BeverageQuantityName +
                          "-" +
                          bar.BreakupBeverageQuantityName}
                        )
                      </span>
                    </td>
                  ) : (
                    <td>
                      {" "}
                      <span
                        style={{
                          fontSize: "14px",
                          marginLeft: "-10px",
                          marginRight: "30px",
                        }}
                      >
                        {bar.BeverageName} ({bar.BeverageQuantityName})
                      </span>
                    </td>
                  )}
                  {bar.BevarageQuantityType === "B" ? (
                    <td>{bar.BreakupOrderQuantity}</td>
                  ) : (
                    <td>{bar.OrderQuantity}</td>
                  )}
                  {bar.BevarageQuantityType === "B" ? (
                    <td>
                      {(bar.BreakupOrderQuantity * bar.Tariff).toFixed(2)}
                    </td>
                  ) : (
                    <td>{(bar.OrderQuantity * bar.Tariff).toFixed(2)}</td>
                  )}
                </tr>
              ))}
              {/* {ROrderDetails.map((resto, rindex) => (
                <tr>
                  <td>{resto.FoodName}</td>
                  <td>{resto.OrderQuantity}</td>
                  <td>{(resto.OrderQuantity * resto.Tariff).toFixed(2)}</td>
                </tr>
              ))} *
            </tbody> */}
          </Table>
        </div>
        {/* {CustomerGSTNo != "null" && CustomerGSTNo != "" && (
          <div className="gst-in">GSTIN:{CustomerGSTNo}</div>
        )} */}

        <div className="pre-table">
          <table class="table">
            <thead>
              <tr>
                <th colSpan={2}>SUMMARY</th>
              </tr>
            </thead>

            <tbody>
              {/* <tr>
                <td>Bill Amount</td>
                <td>₹ {BillAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>VAT</td>
                <td>₹ {VatAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>GST</td>
                <td>₹ {TaxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td> ₹ {NetAmount.toFixed(2)}</td>
              </tr> */}
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  <button
                    type="submit"
                    className="btn btn-success btn-sm p-2"
                    style={{ width: "100px" }}
                    onClick={() => this.PayButton()}
                  >
                    PAY
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default upiPayment;
