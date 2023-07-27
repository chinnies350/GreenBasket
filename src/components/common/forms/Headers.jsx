import 'styles/userstyle.css';

import _ from 'lodash';
import React, { Fragment, PureComponent } from 'react';
import { Dropdown } from 'react-bootstrap';
import * as IonIcons from 'react-icons/io';
import { Link } from 'react-router-dom';
import PageProgress from "react-page-progress"
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import { getCurrentUser, getJwt, logout } from 'service/authService';
import { getCategoriesById } from 'service/catalogService';
import { getContactList } from 'service/contactService';
import Static from 'service/static';
import { getContactList2 } from "service/contactService";

// import logo from './../../../images/userimages/EFV-Logo.png';
import { getCookieData, storeCookieData } from "../../common/CookiesFunc";

import { subDirectory } from '../../../config.json'


var classNames = require('classnames');
class Headers extends PureComponent {


  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      categoryData: [],
      allCategories: '',
      isLogedIn: false,
      userName: '',
      merchantd: 0,
      logo: '',
      colorCode: ''

    };
  }

  toggle = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  }

  componentDidMount = async () => {

    var merchantId = getCookieData("MERID");
    await this.setState({ merchantd: merchantId })
    console.log(merchantId)

    await this.verifyUser();
    await this.getUserInfo();
    await this.getCategories()
    await this.getContactList2();
    await this.navlinkGenerate()
  }

  verifyUser = async () => {
    const isStateCheck = this.stateCheck();
    this.setState({ isLogedIn: isStateCheck })
    if (!isStateCheck) {
    } else {
      await this.setState({ isUser: false, })
    }
  }

  // getContactList = async () => {
  //   const res = await getContactList();
  //   const { data: { statusCode, data } } = res;
  //   if (!statusCode)
  //     return this.setState({ data: [], isTableLoading: false });
  //   await this.setState({ data, isTableLoading: false })
  // }

  stateCheck = () => {
    let isLogedIn = getCurrentUser();
    return isLogedIn;
  }

  getUserInfo = async () => {
    try {
      if (this.stateCheck()) {
        let res = await getJwt('__info');
        const { name } = res;
        await this.setState({ userName: name })
      }
    }
    catch (err) {
    }
  }

  getContactList2 = async () => {
    console.log();
    
    const res = await getContactList2(this.state.merchantd);
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (!res) return this.setState({ data: [] });
    await this.setState({ data });
    var logo = data[0].merchantLogo
    console.log(data)
    console.log(data[0].merchantLogo)
    await this.setState({ logo: data[0].merchantLogo });
    await this.setState({ colorCode: data[0].colorCode });
    var colorCode = data[0].colorCode
    console.log(colorCode)
    await storeCookieData('logo', logo)
    await storeCookieData('colorCode', colorCode)
    var navColor = document.getElementById("headNav");
    navColor.style["background-color"] = colorCode;

    var SearchBtnColor = document.getElementById("searchbtn");
    SearchBtnColor.style["background-color"] = colorCode;
    // await this.initTableData();
  };



  displaycategories = []
  async getCategories() {
    let res = await getCategoriesById(this.state.merchantd)

    console.log("Categories " + res)

    if (res.data.statusCode === 1) {
      await this.setState({ allCategories: res.data.data })

      this.displaycategories.push({ "categoryName": "Home" })

      for (let item of this.state.allCategories) {

        if (item.categoryStatus === 'A') {
          this.displaycategories.push(item)
        }
      }

      var datas = this.displaycategories
      await this.setState({ categoryData: datas });
    }

  }

  navlinkGenerate = async () => {
    const { onClick } = this.props;

    const { categoryData } = this.state;
    console.log(categoryData);
    let navlink = [];
    let morelink = [];
    await _.map(categoryData, function (pageName, i) {
      if (i < 13) {
        navlink.push(<Link key={i} to={`${subDirectory}/user/` + pageName['categoryName'].toLowerCase().replace(" ", "-")} onClick={() => onClick(pageName["categoryId"])} className={classNames('btn btn-link')} activeclassname="btn-primary" exact="true">{pageName['categoryName']} </Link>)
      } else {
        morelink.push(
          <DropdownItem key={i}>
            <Link key={i} to={`${subDirectory}/user/` + pageName['categoryName'].toLowerCase().replace(" ", "-")} onClick={() => onClick(pageName['categoryId'])} className={classNames('btn btn-link')} activeclassname="btn-primary" exact="true" style={{ color: '#000' }}>{pageName['categoryName']} </Link>
          </DropdownItem>
        )
      }
    });
    if (navlink.length > 0) {
      await this.setState({
        nav: true,
        navlink: navlink
      })

    }
    if (morelink.length > 0) {
      await this.setState({
        more: true,
        morelink: morelink
      })
    }

  }


  logout = async () => {
    const { props } = this.props;
    await logout();
    props.history.push(`${subDirectory}/auth/identifier`);

  }


  render() {

    let { keys: formTypeKey, order: formTypeOrders } = Static.dropdownitems();
    const { onChange } = this.props;
    const { nav, more, navlink, morelink, data, isLogedIn, userName, logo } = this.state

    return (
      <Fragment>

        <div className="container-fluid topheader">
          <div className="row">
            <div className="col-12">
              <div className="topnav">
                <ul>
                  {data && data.length > 0 &&
                    <li>
                      <Link> <IonIcons.IoIosCall />  {data[0].contactNumber}  | </Link>
                    </li>
                  }
                  {data && data.length > 0 &&
                    <li>
                      <Link> <IonIcons.IoIosMail /> {data[0].email} |</Link>
                    </li>
                  }
                  {!isLogedIn && <li>
                    <Link to={`${subDirectory}/auth/identifier`}>
                      <IonIcons.IoIosPerson />  Sign In |
                    </Link>
                  </li>}

                  {isLogedIn && <li>
                    <Dropdown className="topdropdown">
                      <Dropdown.Toggle id="dropdown-basic"> <IonIcons.IoIosPerson />  {userName} </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item componentClass='span'>
                          {formTypeOrders.map((type) => {
                            if (type === "logout") return <Link key={type} to={{ pathname: `${subDirectory}/user/${type}` }} onClick={() => this.logout()} className={classNames('btn btn-link')} activeclassname="btn-primary" exact="true" >{formTypeKey[type]['label']}</Link>;
                            return <Link key={type} to={{ pathname: `${subDirectory}/user/${type}` }} on className={classNames('btn btn-link')} activeclassname="btn-primary" exact="true" >{formTypeKey[type]['label']}
                            </Link>
                          }
                          )}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid topheader1">
          <div className="row"  >
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4 "  >
              <img src={logo} className="logoimg" alt="" />
            </div>
            <div className="col-sm-4 d-flex align-items-center">
              <div className="input-group">
                <Input className="form-control3 txt-box" onChange={({ currentTarget: Input }) => onChange(Input.value)} placeholder="search" name="q" autoComplete="off" />
                <div className="input-group-btn">
                  <button id="searchbtn" className="btn btn-default searchformbutton" type="submit"><IonIcons.IoIosSearch /></button>
                  {/* <button className="btn btn-default searchformbutton" type="submit"><IonIcons.IoIosSearch /></button> */}
                </div>
              </div>
            </div>
          </div>
        </div>


        <Navbar id="headNav" light expand="md" style={{ top: "4px !important" }} className="navbar navbar-inverse navbg sticky-top  animated slideInDown" style={{
          zIndex: '999',
          // background:{colorCode} 
        }}>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {nav &&
                <NavItem>
                  {navlink}
                </NavItem>
              }

              {more &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    More
                  </DropdownToggle>
                  <DropdownMenu>
                    {morelink}
                  </DropdownMenu>
                </UncontrolledDropdown>
              }

            </Nav>
          </Collapse>
        </Navbar>
      </Fragment>
    )
  }
}

export default Headers;