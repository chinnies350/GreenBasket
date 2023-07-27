import React, { Fragment } from "react";

import { staticToken } from "../../../config.json";
import Dashboard2 from "../../../components/dashboard";
import { subDirectory } from "../../../config.json";
import User from "components/user";
import UsersideNav, {
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
import { getuserRightsEdit } from "../../../service/UserAccessRights";

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: true,
      visible: false,
      dropDownValue: "",
      Merchants: "",
      merchantID: "",

      sample: [],
    };
  }
  componentDidMount = async () => {
    await this.Userrightsdata();
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

  Userrightsdata = async () => {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    let sample = [];
    let res = await getuserRightsEdit();
    console.log(res)
    if (res.data.data) {
      let mappingdata = res.data.data;
      console.log(mappingdata, "ssssssssssssss")
      mappingdata.map((i, j) => {
        console.log(i.menuName, "@@@@@@@@@@@@@");

        sample.push(i.menuName);
        sample = [...new Set(sample)];
        console.log("*****************", sample);
      });

      await this.setState({ sample: [...new Set(sample)], loading: false });
      console.log(sample, this.state);
      console.log(res.data.data[0].menuName, "checking data boopalan");
    }
  };

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
    window.localStorage.setItem("merchantId", this.state.id);
    console.log(window.localStorage.getItem("merchantId"));
    this.setState({ merchantID: window.localStorage.getItem("merchantId") });
  };
  onSubmit = async (data, e) => {
    console.log(data, this.props);
    const props = this.props;
    let inputData = {
      merchantid: this.state.id,
    };
    console.log(inputData);

    props.history.push({
      pathname: "/dashboard",
      state: { merchantid: this.state.id },
    });
    window.location.reload();
  };

  render() {
    console.log(this.props);
    const { userRole } = this.props;
    const { visible, loading } = this.state;
    const { merchantID } = this.state.merchantID;
    console.log(this.state);
    return (
      <div>
        {
          this.state.loading ?
            <p>Loading.....</p>
            :
            <div className="nav-wrapper">
              <Modal isOpen={visible} toggle={visible}>
                <ModalHeader toggle={this.handleCancel}>Modal title</ModalHeader>
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
                  {/* <Link to={{ pathname: "/user/home" }} params={{ merchantId: this.state.id }}> */}{" "}
                  <a href={`${subDirectory}/dashboard`} props={this.state.id}>
                    <Button
                      color="primary"
                    // onClick={this.onSubmit}
                    >
                      Get Merchant
                            </Button>{" "}
                  </a>
                  <Button color="secondary" onClick={this.handleCancel}>
                    Cancel
                          </Button>
                </ModalFooter>
              </Modal>
              <Nav className="nav--no-borders flex-column">
                <UsersideNav expanded={true}>
                  <UsersideNav.Nav>
                    {/* dashboard */}
                    {console.log(this.state.sample, "vvvvvvvvvvvvvvvvvvvvvvvvvv")}
                    {this.state.sample.includes("Dashboard") ? <NavItem eventKey="Dashboard" id="sidenavpadding">
                      <NavText>
                        <IONIcons.IoIosCube className="icon1 svgheight" />
                        <a
                          href={`${subDirectory}/dashboard`}
                          props={this.props}
                          id="sidenavcolor"
                        >
                          {" "}
                          <span style={{ paddingLeft: "12px" }}>
                            {" "}
                                        Dashboard
                                      </span>{" "}
                        </a>
                      </NavText>
                    </NavItem>
                      : null
                    }
                    {/* Home settings */}
                    {this.state.sample.includes("Home Settings") ?
                      <NavItem eventKey="Dashboard" id="sidenavpadding">
                        <NavText>
                          <IONIcons.IoMdContact className="icon1 svgheight" />

                          <a
                            href={`${subDirectory}/customer/home/config`}
                            props={this.props}
                            id="sidenavcolor"
                          >
                            {" "}
                            <span style={{ paddingLeft: "12px" }}>
                              Home Settings
                                    </span>{" "}
                          </a>
                        </NavText>
                      </NavItem>
                      : null}
                    {/* Merchant Deails */}
                    {this.state.sample.includes("user access rights") ?
                      <NavItem eventKey="Dashboard" id="sidenavpadding">
                        <NavText>
                          <IONIcons.IoMdContact className="icon1 svgheight" />

                          <a
                            href={`${subDirectory}/UserAccessRights/list`}
                            props={this.props}
                            id="sidenavcolor"
                          >
                            {" "}
                            <span style={{ paddingLeft: "12px" }}>
                              User Access Rights
                                    </span>{" "}
                          </a>
                        </NavText>
                      </NavItem>
                      : null}
                    {this.state.sample.includes("Merchant Details") ?
                      <NavItem eventKey="Dashboard" id="sidenavpadding">
                        <NavText>
                          <IONIcons.IoMdContact className="icon1 svgheight" />

                          <a
                            href={`${subDirectory}/merchant/list`}
                            props={this.props}
                            id="sidenavcolor"
                          >
                            {" "}
                            <span style={{ paddingLeft: "12px" }}>
                              Merchant Details
                                    </span>{" "}
                          </a>
                        </NavText>
                      </NavItem>
                      : null}

                    {this.state.sample.includes("Merchant Login") ?
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

                      : null}

                    {/* orders */}
                    {this.state.sample.includes("orders") ?
                      <NavItem eventKey="Dashboard" id="sidenavpadding">
                        <NavText>
                          <IONIcons.IoIosApps className="icon1 svgheight" />
                          <a
                            href={`${subDirectory}/orders/order-list`}
                            id="sidenavcolor"
                          >
                            {" "}
                            <span style={{ paddingLeft: "12px" }}>Orders</span>{" "}
                          </a>
                        </NavText>
                      </NavItem>
                      : null}

                    {/* catalog */}
                    {this.state.sample.includes("Catalog") ?
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
                            <a
                              href={`${subDirectory}/catalog/categories`}
                              id="sidenavcolor"
                            >
                              {" "}
                              <span style={{ paddingLeft: "10px" }}>
                                Categories
                                      </span>{" "}
                            </a>
                          </NavText>
                        </NavItem>
                        <NavItem eventKey="Products" id="submenupadding1">
                          <NavText id="submenupadding">
                            <IONIcons.IoIosList
                              className="icon1 svgheight"
                              style={{ color: "white" }}
                            />
                            <a
                              href={`${subDirectory}/catalog/products`}
                              id="sidenavcolor"
                            >
                              {" "}
                              <span style={{ paddingLeft: "10px" }}>
                                Products
                                      </span>{" "}
                            </a>
                          </NavText>
                        </NavItem>
                        <NavItem eventKey="Products" id="submenupadding1">
                          <NavText id="submenupadding">
                            <IONIcons.IoMdCart
                              className="icon1 svgheight"
                              style={{ color: "white" }}
                            />{" "}
                            <a
                              href={`${subDirectory}/catalog/offers`}
                              id="sidenavcolor"
                            >
                              {" "}
                              <span style={{ paddingLeft: "10px" }}>Offers</span>{" "}
                            </a>
                          </NavText>
                        </NavItem>
                      </NavItem>
                      : null}
                    {/* customers */}
                    {this.state.sample.includes("Customers") ?
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
                            <a
                              href={`${subDirectory}/customer/details`}
                              id="sidenavcolor"
                            >
                              {" "}
                              <span style={{ paddingLeft: "10px" }}>
                                Users List
                                      </span>{" "}
                            </a>
                          </NavText>
                        </NavItem>
                        <NavItem eventKey="Products" id="submenupadding1">
                          <NavText id="submenupadding">
                            <IONIcons.IoIosChatboxes
                              className="icon1 svgheight"
                              style={{ color: "white" }}
                            />{" "}
                            <a
                              href={`${subDirectory}/customer/feedback`}
                              id="sidenavcolor"
                            >
                              {" "}
                              <span style={{ paddingLeft: "10px" }}>
                                Feedback
                                      </span>{" "}
                            </a>
                          </NavText>
                        </NavItem>
                      </NavItem>
                      : null}

                    {/* banners */}
                    {this.state.sample.includes("Banners") ?
                      <NavItem eventKey="Dashboard" id="sidenavpadding">
                        <NavText>
                          <IONIcons.IoMdImages className="icon1 svgheight" />
                          <a href={`${subDirectory}/banner/list`} id="sidenavcolor">
                            {" "}
                            <span style={{ paddingLeft: "12px" }}>Banners</span>{" "}
                          </a>
                        </NavText>
                      </NavItem>
                      : null}
                  </UsersideNav.Nav>
                </UsersideNav>
              </Nav>

            </div>
        }
      </div>



    );
  }
}

export default SidebarNavItems;
