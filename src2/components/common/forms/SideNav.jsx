// import _ from 'lodash';
// import React, { Fragment, PureComponent } from 'react';
// import * as IONIcons from 'react-icons/io';
// import { NavLink } from 'react-router-dom';
// import { Collapse, Nav, Navbar, NavItem } from 'reactstrap';

// import {subDirectory} from '../../../config.json'

// const menuOptions = [
//   {
//     "url": `${subDirectory}/dashboard`,
//     "icon": <IONIcons.IoIosCube className="icon1" />,
//     "text": "Dashboard",
//     "userTypes": ["A", "D", "S"]
//   },
//   {
//     "url": `${subDirectory}/orders/order-list`,
//     "icon": <IONIcons.IoIosApps className="icon1" />,
//     "text": "Orders",
//     "userTypes": ["A", "D", "S"],
//     // "submenu": [
//     //   { "text": "Order List", "url": "/orders/order-list", "userTypes": ["A", "D", "S"] },
//     //   // { "text": "Statics", "url": "/orders/order-statistics", "userTypes": ["A", "D", "S"] },
//     // ]
//   },
//   {
//     "url": `${subDirectory}/dashboard`,
//     "icon": <IONIcons.IoMdBookmarks className="icon1" />,
//     "text": "Catalog",
//     "userTypes": ["A", "S"],
//     "submenu": [
//       { "text": "Categories", "url":`${subDirectory}/catalog/categories`, "userTypes": ["A", "S"] },
//       { "text": "Products", "url": `${subDirectory}/catalog/products`, "userTypes": ["A", "S"] },
//       { "text": "Offers", "url": `${subDirectory}/catalog/offers`, "userTypes": ["A", "S"] },
//     ]
//   },
//   {
//     "url": `${subDirectory}/dashboard`,
//     "icon": <IONIcons.IoIosPeople className="icon1" />,
//     "text": "Customers",
//     "userTypes": ["A", "S"],
//     "submenu": [
//       { "text": "Users List", "url":`${subDirectory}/customer/details` , "userTypes": ["A", "S"] },
//       { "text": "Feedback", "url":`${subDirectory}/customer/feedback` , "userTypes": ["A", "S"] },
//     ]
//   },
//   {
//     "url": `${subDirectory}/banner/list`,
//     "icon": <IONIcons.IoMdImages className="icon1" />,
//     "text": "Banners",
//     "userTypes": ["A", "S"],
//     // "submenu": [
//     //   { "text": "Banners", "url": "/banner/list", "userTypes": ["A", "S"] },
//     // ]
//   },
//   {
//     "url":`${subDirectory}/contact/list` ,
//     "icon": <IONIcons.IoMdContact className="icon1" />,
//     "text": "Contact Details",
//     "userTypes": ["A", "S"],
//     // "submenu": [
//     //   { "text": "Contact Details", "url": "/contact/list", "userTypes": ["A", "S"] },
//     // ]
//   },
//   {
//     "url": `${subDirectory}/project/config`,
//     "icon": <IONIcons.IoIosConstruct className="icon1" />,
//     "text": "URL Config",
//     "userTypes": ["S"]
//   },{
//     "url": `${subDirectory}/customer/home/config`,
//     "icon": <IONIcons.IoIosConstruct className="icon1" />,
//     "text": "Home Settings",
//     "userTypes": ["S"]
//   },
// ]
// class SideNav extends PureComponent {
//   state = {
//     collapse: 0,
//   }

//   componentDidMount = async () => {
//     await this.menuFormation();
//   }

//   menuFormation = () => {
//     const { userRole } = this.props;
//     const { collapse } = this.state
//     const rightsList = _.filter(menuOptions, v => _.includes(v["userTypes"], userRole));
//     return <div className="left-panel">
//       <Navbar className="sidemenu pl-0 pr-0" >
//         {rightsList &&
//           <Nav navbar style={{ width: "100%" }}>
//             {_.map(rightsList, (item, i) =>
//               <NavItem key={i}>
//                 {!item["submenu"] &&
//                   <NavLink to={item.url} onClick={this.toggle} data-event={i} className="nav-link  ">{item.icon} {item.text}</NavLink>
//                 }
//                 {item["submenu"] &&
//                   <div onClick={this.toggle} data-event={i} className="nav-link  ">  {item.icon}  {item.text}</div>
//                 }
//                 {item.submenu &&
//                   <Collapse isOpen={collapse !== i} >
//                     {_.map(item.submenu, (sm, i) =>
//                       <NavLink to={sm.url} className="nav-link inner-a"> {sm.text}</NavLink>
//                     )}
//                   </Collapse>
//                 }
//               </NavItem>
//             )}
//           </Nav>
//         }
//       </Navbar>
//     </div>
//   }

//   toggle = async (e) => {
//     let event = e.target.dataset.event;
//     await this.setState(state => ({ collapse: state.collapse === Number(event) ? 0 : Number(event) }));
//   }

//   render() {
//     return (
//       <Fragment>
//         {this.menuFormation()}
//       </Fragment>
//     )
//   }
// }

// export default SideNav;

import React, { Fragment } from "react";

import { staticToken } from "../../../config.json";
import Dashboard2 from "../../../components/dashboard";
import { subDirectory } from "../../../config.json";
import User from "components/user";
import SideNav, {
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import { Container, Col, Row, Breadcrumb, BreadcrumbItem } from "reactstrap";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import * as InoIcons from "react-icons/io";
import * as MnoIcons from "react-icons/md";
import speedometer from "../../../images/speedometer.svg";

import * as IONIcons from "react-icons/io";
import "../../../styles/sidenav.css";
import "../../../styles/nav.css";
import { Form } from "informed";
import { Routes } from "../Routes";
import { Redirect, Route, Router, Switch, Link } from "react-router-dom";
import {
  Modal,
  Button,
  ModalHeader,
  DropdownItem,
  ModalBody,
  DropdownMenu,
  ModalFooter,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import "antd/dist/antd.css";
import {
  FaListAlt,
  FaUsers,
  FaList,
  FaRulerVertical,
  FaRupeeSign,
  FaTable,
  FaWineGlassAlt,
  FaAddressBook,
} from "react-icons/fa";
import DropDown from "../forms/DropDown";
import { Input } from "components/common/forms/Input";
import { getActiveMerchants } from "../../../service/contactService";
import Dashboard from "../../dashboard/DashboardPage";
import { localStorage } from "localStorage";

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      visible: false,
      dropDownValue: "",
      Merchants: "",
      merchantID: "",
    };
  }
  componentDidMount = async () => {
    const res = await getActiveMerchants();
    console.log(res.data.data);
    console.log(";;;;;;;;;;; props", this.props);

    this.setState({ Merchants: res.data.data });
  };

  // componentWillMount() {
  //   console.log(";;;;;;;;;;; props", this.props);
  //   localStorage.setItem('MerchantId', this.state.Merchants);
  //   const rememberMe = localStorage.getItem('MerchantId');
  //   console.log(rememberMe);
  // }
  createSelectItems() {
    let items = [];
    for (let i = 0; i <= this.props.maxValue; i++) {
      items.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
      //here I will be creating my options dynamically based on
      //what props are currently passed to the parent component
    }
    return items;
  }

  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    //here you will see the current selected value of the select input
  }
  openModal = async () => {
    await this.setState({ visible: true });
  };
  handleCancel = async () => {
    await this.setState({ visible: false });
  };

  summaryType = async (e) => {
    let id = e.target.value;
    await this.setState({ id: id });
  };
  onSubmit = async (data, e) => {
    window.localStorage.setItem("merchantId", this.state.id);
    console.log(window.localStorage.getItem("merchantId"));
    this.setState({ merchantID: window.localStorage.getItem("merchantId") });
    console.log(this.state.merchantID);
    // console.log(data, this.props);
    const props = this.props;
    // let inputData = {
    //   merchantid: this.state.id,
    // };
    // console.log(inputData);

    props.history.push({
      pathname: "/dashboard",
      state: { merchantid: this.state.id },
    });
    // window.location.reload();

    await this.setState({ visible: false });
  };

  render() {
    console.log(this.props);
    const { userRole } = this.props;
    const {merchantId } = this.props;
    console.log(userRole,merchantId);
    const { visible, loading } = this.state;
    const { merchantID } = this.state;
    console.log(this.state.merchantID);
    return (
      <div className="nav-wrapper">
        <Modal isOpen={visible} toggle={visible}>
          <ModalHeader toggle={this.handleCancel}>Select Merchant</ModalHeader>
          <ModalBody>
            <Form
              getApi={this.setFormApi}
              onSubmit={this.onSubmit}
              // initialValues={assignInitialValues}
            >
              {({ formApi, formState }) => (
                <Col md={4} style={{ width: "200px" }}>
                  <DropDown
                    field="Select Merchant"
                    className="form-control-sm"
                    icon={<FaAddressBook />}
                    label="Active Merchants"
                    optionsNames={{
                      value: "merchantId",
                      label: "merchantName",
                    }}
                    onChange={(e) => {
                      this.summaryType(e);
                    }}
                    options={this.state.Merchants}
                    // required={true}
                    // validateOnBlur
                    // validate={(e) =>
                    //   validateProperty(true, "name", e, "Summary Type")
                    // }
                    initialValue={this.state.id}
                  />
                </Col>
              )}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>
              Get Merchant
            </Button>{" "}
            <Button color="secondary" onClick={this.handleCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Nav className="nav--no-borders flex-column">
          <SideNav expanded={true}>
            <SideNav.Nav>
              {userRole && (
                <NavItem eventKey="Dashboard" id="sidenavpadding">
                  <NavText>
                    <IONIcons.IoIosCube className="icon1 svgheight" />
                    <Link
                      to={`${subDirectory}/dashboard`}
                      props={this.props}
                      id="sidenavcolor"
                    >
                      {" "}
                      <span style={{ paddingLeft: "12px" }}>
                        {" "}
                        Dashboard
                      </span>{" "}
                    </Link>
                  </NavText>
                </NavItem>
              )}
              {/* Merchant Deails */}
              {(userRole === "SA" || userRole === "A")  && (
                <NavItem eventKey="Merchant" id="sidenavpadding">
                  <NavText>
                    <IONIcons.IoMdContact className="icon1 svgheight" />

                    <Link
                      to={`${subDirectory}/merchant/list`}
                      props={this.props}
                      id="sidenavcolor"
                    >
                      {" "}
                      <span style={{ paddingLeft: "12px" }}>
                        Merchant Details
                      </span>{" "}
                    </Link>
                  </NavText>
                </NavItem>
              )}
              {userRole == "SA" && (
                <NavItem eventKey="Payment" id="sidenavpadding">
                  <NavText>
                    <IONIcons.IoMdContact className="icon1 svgheight" />

                    <Link
                      to={`${subDirectory}/payment/list`}
                      props={this.props}
                      id="sidenavcolor"
                    >
                      {" "}
                      <span style={{ paddingLeft: "12px" }}>
                        Payment Details
                      </span>{" "}
                    </Link>
                  </NavText>
                </NavItem>
              )}
              {userRole == "SA"  && (
                <NavItem eventKey="Dashboard" id="sidenavpadding">
                  <NavText>
                    <IONIcons.IoMdContact className="icon1 svgheight" />
                    <span
                      style={{ paddingLeft: "12px" }}
                      id="sidenavcolor"
                      onClick={this.openModal}
                    >
                      Merchant Login
                    </span>
                  </NavText>
                </NavItem>
              )}

              {/* orders */}
              {/* {(userRole == "SA" || userRole == "A") && merchantID && ( */}
              <NavItem eventKey="Dashboard" id="sidenavpadding">
                <NavText>
                  <IONIcons.IoIosApps className="icon1 svgheight" />
                  <Link
                    to={`${subDirectory}/orders/order-list`}
                    id="sidenavcolor"
                  >
                    {" "}
                    <span style={{ paddingLeft: "12px" }}>Orders</span>{" "}
                  </Link>
                </NavText>
              </NavItem>
              {/* )} */}

              {/* catalog */}
              { userRole=="A"&& (
                <NavItem eventKey="Catalog">
                  <NavText>
                    <IONIcons.IoMdBookmarks className="icon1 svgheight" />
                    <span
                      style={{
                        color: "#3d5170",
                        paddingLeft: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Catalog
                    </span>{" "}
                    <span style={{ paddingLeft: "49px" }}></span>{" "}
                    <MnoIcons.MdKeyboardArrowRight
                      style={{ fontSize: "32px", color: "#fc4a1a" }}
                    />
                  </NavText>
                  <NavItem eventKey="Products" id="submenupadding1">
                    <NavText id="submenupadding">
                      <IONIcons.IoIosListBox
                        className="icon1 svgheight"
                        style={{ color: "white" }}
                      />{" "}
                      <Link
                        to={`${subDirectory}/catalog/categories`}
                        id="sidenavcolor"
                      >
                        {" "}
                        <span style={{ paddingLeft: "10px" }}>
                          Categories
                        </span>{" "}
                      </Link>
                    </NavText>
                  </NavItem>
                  <NavItem eventKey="Products" id="submenupadding1">
                    <NavText id="submenupadding">
                      <IONIcons.IoIosList
                        className="icon1 svgheight"
                        style={{ color: "white" }}
                      />
                      <Link
                        to={`${subDirectory}/catalog/products`}
                        id="sidenavcolor"
                      >
                        {" "}
                        <span style={{ paddingLeft: "10px" }}>
                          Products
                        </span>{" "}
                      </Link>
                    </NavText>
                  </NavItem>
                  <NavItem eventKey="Products" id="submenupadding1">
                    <NavText id="submenupadding">
                      <IONIcons.IoMdCart
                        className="icon1 svgheight"
                        style={{ color: "white" }}
                      />{" "}
                      <Link
                        to={`${subDirectory}/catalog/offers`}
                        id="sidenavcolor"
                      >
                        {" "}
                        <span style={{ paddingLeft: "10px" }}>Offers</span>{" "}
                      </Link>
                    </NavText>
                  </NavItem>
                </NavItem>
              )}
              {/* customers */}
              {/* {userRole == "SA" && ( */}
                <NavItem eventKey="Customers">
                  <NavText>
                    <IONIcons.IoIosPeople className="icon1 svgheight" />
                    <span
                      style={{
                        color: "#3d5170",
                        paddingLeft: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Customers
                    </span>{" "}
                    <span style={{ paddingLeft: "28px" }}></span>{" "}
                    <MnoIcons.MdKeyboardArrowRight
                      style={{ fontSize: "32px", color: "#fc4a1a" }}
                    />
                  </NavText>
                  <NavItem eventKey="Products" id="submenupadding1">
                    <NavText id="submenupadding">
                      <IONIcons.IoIosPersonAdd
                        className="icon1 svgheight"
                        style={{ color: "white" }}
                      />
                      <Link
                        to={`${subDirectory}/customer/details`}
                        id="sidenavcolor"
                      >
                        {" "}
                        <span style={{ paddingLeft: "10px" }}>
                          Users List
                        </span>{" "}
                      </Link>
                    </NavText>
                  </NavItem>
                  <NavItem eventKey="Products" id="submenupadding1">
                    <NavText id="submenupadding">
                      <IONIcons.IoIosChatboxes
                        className="icon1 svgheight"
                        style={{ color: "white" }}
                      />{" "}
                      <Link
                        to={`${subDirectory}/customer/feedback`}
                        id="sidenavcolor"
                      >
                        {" "}
                        <span style={{ paddingLeft: "10px" }}>
                          Feedback
                        </span>{" "}
                      </Link>
                    </NavText>
                  </NavItem>
                </NavItem>
              {/* )} */}

              {/* banners */}
              {/* {(userRole == "SA" || userRole == "A") && merchantID && ( */}
                <NavItem eventKey="Dashboard" id="sidenavpadding">
                  <NavText>
                    <IONIcons.IoMdImages className="icon1 svgheight" />
                    <Link to={`${subDirectory}/banner/list`} id="sidenavcolor">
                      {" "}
                      <span style={{ paddingLeft: "12px" }}>Banners</span>{" "}
                    </Link>
                  </NavText>
                </NavItem>
              {/* )} */}
            </SideNav.Nav>
          </SideNav>
        </Nav>
        {/* <Router>
          <Switch>
            <Route
              path={`${subDirectory}/user/home`}
              exact
              component={User}
            />
          </Switch>
        </Router> */}
      </div>

      // <div>
      //   <div>

      //     <div class="sidenav">
      //       <a href="#about">About</a>
      //       <a href="#services">Services</a>
      //       <a href="#clients">Clients</a>
      //       <a href="#contact">Contact</a>
      //     </div>
      //   </div>

      // </div>
    );
  }
}

export default SidebarNavItems;
