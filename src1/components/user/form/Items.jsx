import 'styles/userstyle.css';

import nodataFound from 'images/cartisempty.svg';
import _ from 'lodash';
import { withSnackbar } from 'notistack';
import React, { Fragment, PureComponent } from 'react';
import * as IonIcons from 'react-icons/io';
import ReactNotification from 'react-notifications-component';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { getJwt } from 'service/authService';
import { deleteCartItem, getCartItems, getGSTdetails } from 'service/cartService';

import {subDirectory} from '../../../config.json'


class Items extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      uid: '',
      data: [],
      userInfo: {},
      grantTotal: 0,
      gstPercentage: 0,
      isDataAvailable: false,

      isLoading: true
    }
    this.notificationDOMRef = React.createRef();
  }

  componentDidMount = async () => {
    await this.setState({ isLoading: true, isDataAvailable: false });
    await this.getUserInfo();
    await this.getGSTvalue();
    await this.getCartItems();
    // await this.subTotal();

  }

  componentWillUnmount = async () => {
    await this.cartDataStore();
  }

  /** 
   * Get the GST Information from server for deliver charge calculation
   */

  getGSTvalue = async () => {
    try {
      const res = await getGSTdetails();
      const { gstPercentage, minDelChargeLimit, deliveryCharges } = res.data.data[0];
      await this.setState({ gstPercentage: gstPercentage, minDelChargeLimit: minDelChargeLimit, deliveryCharges: deliveryCharges });
    } catch (err) {
      this.handleError(err)
    }
  }
  /**
   * Get User Information from session storage
   */
  getUserInfo = async () => {
    try {
      let res = await getJwt('__info');
      const { uid } = res;
      await this.setState({ uid: uid, userInfo: res });
    } catch (err) {
      this.handleError(err)
    }
  }
  /**
   * Get the user cart Items from the server
   */
  getCartItems = async () => {
    try {
      const { uid } = this.state;
      console.log(this.state.uid);
      const res = await getCartItems(uid);
      console.log(res);
      const { data, statusCode } = res.data;
      if (statusCode) {
        await this.setState({ data, isLoading: false, isDataAvailable: true });
        return await this.subTotal();
      }
      await this.setState({ data: [], isLoading: true, isDataAvailable: false });
      await this.subTotal();
    } catch (err) {
      this.handleError(err)
    }
  }

  /**
   * Delete the Cart Item
   */

  deleteItems = async (cartId) => {
    await this.setState({ isLoading: true })
    const res = await deleteCartItem(cartId);
    console.log(res,"cart deleted");
    await this.getCartItems();
    // await this.addNotification("Item deleted Successfully.",200);
  }

  /**
   * To Map the Cart items for display
   */
  itemsLoad = () => {
    const { data } = this.state;
    console.log(data);
    return _.map(data, (f, i) => <tr key={i}>
      <td> <img src={f["productImage"]} className="img-responisve" id="productImage" alt="Prematix" /></td>
      <td>
        <h3 id="h3heading9">{f["productName"]}</h3>
        <span id="showrupeecolor">₹ {f["productSellingPrice"]}</span>
        <span id="hiderupeecolor">₹ {f["productMrp"]}</span>
        <span id="gmscolor"> {f["productQuantity"] + " " + f["productUom"]}</span>
      </td>
      <td>
        <input type="button" value="-" id="subs3" className="minusbtn" onClick={() => this.subItem(i)} />
        <input type="text" id="noOfRoom3" value={f["noOfOrders"]} className="quantitybox" />
        <input type="button" value="+" id="adds3" className="plusbtn" onClick={() => this.addItem(i)} />
      </td>
      <td>
        <span>₹ {f["productSellingPrice"] * f["noOfOrders"]}</span>
      </td>
      <td> <IonIcons.IoMdTrash style={{ fontSize: "1.7rem", color: 'red' }} onClick={() => this.deleteItems(f["cartId"])} />
      </td>
    </tr>)
  }

  /**
   * Increase the product count 
   */

  addItem = async (index) => {
    await this.setState({ isLoading: true })
    const { data } = this.state;
    let number;
    if (data[index]["noOfOrders"] < 10)
     number = Number(data[index]["noOfOrders"]);
     console.log(number);
      number=number+ 1;
    await this.setState({ data, isLoading: false });
    await this.subTotal();

  }

  subItem = async (index) => {
    await this.setState({ isLoading: true })
    const { data } = this.state;
    if (data[index]["noOfOrders"] !== 1)
      data[index]["noOfOrders"] -= 1;
    await this.setState({ data, isLoading: false });
    await this.subTotal();
  }
  /**
   * Calculate the Subtotal
   */
  subTotal = async () => {
    const { data, gstPercentage } = this.state;
    let subTotal = 0;
    await _.map(data, v => { subTotal += (v["noOfOrders"] * v["productSellingPrice"]) });
    const gst = Math.round(subTotal * (gstPercentage / 100));
    await this.setState({ subTotal: subTotal, gst: gst });
  }


  /**
   * To store the data for paymant process as well as place the order
   */
  cartDataStore = async () => {
    const { cartDataStore } = this.props;
    const { subTotal, gst, deliveryCharges, minDelChargeLimit, gstPercentage } = this.state;
    let { data } = this.state;
    await _.map(data, v => v["productUom"] = v["productUom"])
    await _.map(data, v => v["noOfOrders"] = v["noOfOrders"])
    await _.map(data, v => v["totalAmount"] = v["noOfOrders"] * v["productSellingPrice"])

    let obj = {
      "products": data,
      "gstPercentage": gstPercentage,
      "gstAmount": gst,
      "shippingCharge": (minDelChargeLimit < subTotal ? 0 : deliveryCharges),
      "netAmount": subTotal + gst + (minDelChargeLimit < subTotal ? 0 : deliveryCharges),
      "totalAmount": subTotal

    }
    await cartDataStore(obj);
  }
  /**
   * To Display the User Information with the better UI experience
   */
  addNotification = (message, variant = "success") => {
    const { enqueueSnackbar } = this.props
    const options = { variant, anchorOrigin: { vertical: "bottom", horizontal: "center", autoHideDuration: 1000 } };
    enqueueSnackbar(message, options)
  }


  handleError = err => {
  }

  render() {
    const { isLoading, isDataAvailable, subTotal, gst, deliveryCharges, minDelChargeLimit } = this.state;
    const { handleNext } = this.props;
    console.log(this.props);
    return (
      <Fragment>
        <ReactNotification ref={this.notificationDOMRef} />

        {isDataAvailable && <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ITEMS</th>
                <th>DESCRIPTION</th>
                <th>QUANTITY</th>
                <th>SUB-TOTAL</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && this.itemsLoad()}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}></td>
                <td className="lft" >Sub-Total</td>
                <td className="rht" colSpan={1}>₹ {subTotal || 0}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="lft" >GST</td>
                <td className="rht" colSpan={1}>₹ {gst || 0}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="lft" >Shipping Charges</td>
                <td className="rht" colSpan={1}> {minDelChargeLimit < subTotal ? 'FREE' : '₹' + deliveryCharges}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="lft" >Grand-Total</td>
                <td className="rht" colSpan={1}>₹ {subTotal + gst + (minDelChargeLimit < subTotal ? 0 : deliveryCharges)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>}
        {isDataAvailable && <div className="text-right">
          {/* <Button disabled onClick={() => handleBack()} size={"sm"} > Back</Button> */}
          <Button variant="contained" color="primary" size={"sm"} className="ml-3" onClick={() => handleNext()} > Check Out </Button>
        </div>}

        {
          !isDataAvailable &&
          <Fragment>
            <div className="text-center">
              <img src={nodataFound} className="img-fluid" alt="No data Found" />
            </div>
            <h3 style={{ textAlign: 'center', padding: '1rem', boxShadow: '-1px 5px 20px -8px #ddd', borderRadius: '0.5rem', fontWeight: 400, fontSize: "1rem" }}>No Cart Item Found  <Link to="/user/home">click here</Link> Continue shopping.</h3>
          </Fragment>
        }
      </Fragment>
    )
  }
}

export default withSnackbar(Items);