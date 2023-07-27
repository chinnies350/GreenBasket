import BreadCrumb from "components/common/forms/BreadCrumb";
import _ from "lodash";
import { withSnackbar } from "notistack";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import * as InoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import { getCurrentUser, getJwt } from "service/authService";
import { Button, Col, Row } from "reactstrap";
import {
  getContactList,
  deleteBuffetData,
  updateContactDetails,
  getContactList2,
} from "service/contactService";
import DeleteModal from "components/common/forms/DeleteModal";

import { subDirectory } from "../../config.json";
import { getCookieData, storeCookieData } from "../common/CookiesFunc";


const { SearchBar } = Search;

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  state = {
    data: [],
    isTableLoading: true,
    statusSelected: [],
    isOpen: false,
    MerchantId: "",
    merchantId: "",
    userRole: "",
  };

  componentDidMount = async () => {
    await this.init();
    document.documentElement.style.setProperty('--base',getCookieData("colorCode"));

    // await this.init();
  };
  init = async () => {
    let res = await getJwt("__info");
    console.log(res);
    const { merchantId } = res;
    const { userRole } = res;
    await this.setState({ userRole: userRole });
    await this.setState({ merchantId: merchantId });
    console.log(this.state.merchantId, "MId");
    if (userRole === "SA") {
      await this.init1();
    } else {
      await this.getContactList2(this.state.merchantId);
    }
  };
  init1 = async () => {
    let Merchant = window.localStorage.getItem("merchantId");
    await this.setState({ MerchantId: Merchant });
    if (!this.state.MerchantId) {
      await this.getContactList();
    } else {
      await this.getContactList2(this.state.MerchantId);
    }
  };

  getContactList = async () => {
    const res = await getContactList();
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (!statusCode) return this.setState({ data: [], isTableLoading: false });
    await this.setState({ data, isTableLoading: false });
    await this.initTableData();
  };
  getContactList2 = async (data2) => {
    console.log(data2);
    const res = await getContactList2(data2);
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (!res) return this.setState({ data: [], isTableLoading: false });
    await this.setState({ data, isTableLoading: false });
    await this.initTableData();
  };

  deleteFun = async (row) => {
    this.setState({ loading: true });
    const { statusSelected } = this.state;
    let inputData = {
      merchantId: row.merchantId,
    };
    console.log(inputData);
    const res = await deleteBuffetData(inputData);
    console.log(res);
    if (!res) return this.addNotification(res.data.data, "danger");
    if (res) {
      this.addNotification(res.data.message);
      await this.init();
      await this.setState({ isTableLoading: false });
    }
  };
  // deleteHandler = async (row) => {

  //   let inputdata = {
  //     merchantName: details[0].merchantName,
  //     merchantLogo: details[0].merchantLogo,
  //     colorCode: details[0].colorCode,
  //     terms: details[0].terms,
  //     aboutUs: details[0].aboutUs,
  //     facebook: details[0].facebook,
  //     instagram: details[0].instagram,
  //     twitter: details[0].twitter,
  //     contactNumber: details[0].contactNumber,
  //     addressLine1: details[0].addressLine1,
  //     addressLine2: details[0].addressLine2,
  //     policy: details[0].policy,
  //     email: details[0].email,
  //     minDeliveryChargeLimit: details[0].minDeliveryChargeLimit,
  //     deliveryCharges: details[0].deliveryCharges,
  //     gstPercentage: details[0].gstPercentage,
  //     gstNumber: details[0].gstNumber,
  //     status: this.state.statusSelected[1],
  //     merchantId: details[0].merchantId,
  //   };
  // };

  changeStatus = async (row) => {
    await this.setState({ isTableLoading: true });
    let data = {
      merchantName: row.merchantName,
      merchantLogo: row.merchantLogo,
      colorCode: row.colorCode,
      terms: row.terms,
      aboutUs: row.aboutUs,
      facebook: row.facebook,
      instagram: row.instagram,
      twitter: row.twitter,
      addressLine1: row.addressLine1,
      addressLine2: row.addressLine2,
      policy: row.policy,
      email: row.email,
      minDeliveryChargeLimit: row.minDeliveryChargeLimit,
      deliveryCharges: row.deliveryCharges,
      gstPercentage: row.gstPercentage,
      gstNumber: row.gstNumber,
      status: "A",
      merchantId: row.merchantId,
      contactNumber: row.contactNumber,
    };
    console.log(data);
    let response = await updateContactDetails(data);
    console.log(response);
    if (response) {
      await this.init();
      this.addNotification("Status " + response.data.message);
      await this.setState({ isTableLoading: false });
    }
  };
  initTableData = async () => {
    const { hideColumns } = this.state;
    const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
    const columns = getColumns(columnHeaders, hideColumns);
    await this.setState({ columns, columnHeaders, hideColumns });
  };

  getColumnHeaders(prefixUrl = "") {
    let allKeys = [
      "Email",
      "Phone No",
      "Merchant Name",
      "Primary Address",
      "Status",
      "actions",
    ];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v));
    let def = {
      Email: { dataField: "email", text: "Email ", sort: true },
      "Phone No": { dataField: "contactNumber", text: "Phone No", sort: true },
      "Merchant Name": {
        dataField: "merchantName",
        text: "Merchant name",
        sort: true,
      },
      "Primary Address": {
        dataField: "addressLine1",
        text: "Primary Address ",
        sort: true,
      },
      Status: {
        dataField: "status",
        isDummyField: true,
        text: "Status",
        formatter: this.statusFormatter,
      },
      actions: {
        dataField: "actions",
        isDummyField: true,
        text: "Actions",
        formatter: this.actionsFormatter,
      },
    };
    return { keys: keys, def: def };
  }

  statusFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    if (row.status === "A") {
      links.push("Active");
      return <div className="actions">{links.concat(" ")}</div>;
    } else {
      links.push("In-Active");
      return <div className="actions">{links.concat(" ")}</div>;
    }
  };

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    if (row.status === "A") {
      links.push(
        <InoIcons.IoMdCreate
          title="Edit"
          onClick={() => this.editFun(`${subDirectory}/merchant/editform`, row)}
        />
      );
      links.push(
        <InoIcons.IoMdTrash
          title="Delete"
          onClick={() => this.deleteFun(row)}
        />
      );
      return <div className="actions">{links.concat(" ")}</div>;
    } else {
      links.push(
        <InoIcons.IoMdCreate
          title="Edit"
          onClick={() => this.editFun(`${subDirectory}/merchant/editform`, row)}
        />
      );
      links.push(
        <InoIcons.IoIosRedo
          title="View"
          onClick={() => this.changeStatus(row)}
        />
      );
      return <div className="actions">{links.concat(" ")}</div>;
    }
  };

  // links.push(<InoIcons.IoMdTrash title="Delete" onClick={() => this.deleteFun(row)} />)

  editFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row },
    });
  };

  viewFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row },
    });
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
    const breadCrumbItems = {
      title: "Merchant Details",
      items: [
        { name: "Home", active: false, link: `${subDirectory}/dashboard` },
        { name: "Contact list", active: true },
      ],
    };
    const { data, columns, isTableLoading,userRole,MerchantId } = this.state;
   
    // console.log(MerchantId);
    console.log(this.props,this.state, "dgwygdhgsda");
    return (
      <React.Fragment>
        <BreadCrumb data={breadCrumbItems} />

        <div className="clearfix"> </div>
        {data && columns && !isTableLoading && (
          <ToolkitProvider keyField="id" data={data} columns={columns} search>
            {(props) => (
              <div>
                <DeleteModal
                  onClick={this.deleteHandler}
                  label="Tour"
                  row={this.state.statusSelected}
                  isOpen={this.state.isOpen}
                  CloseModal={() => this.setState({ isOpen: false })}
                />
                <Row>
                {userRole === "SA" && !MerchantId && (
                    <Col sm={10}>
                      <div className="d-flex justify-content-end">
                        <Link to={`${subDirectory}/merchant/addform`}>
                          <Button size={"sm"} color="primary">
                            + Add Merchant
                          </Button>
                        </Link>
                      </div>
                    </Col>
                  )}
                  <Col sm={2}>
                    <SearchBar {...props.searchProps} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="table-responsive table-div">
                      <BootstrapTable
                        keyField="categoryId"
                        data={data}
                        columns={columns}
                        {...props.baseProps}
                        bootstrap4
                        pagination={paginationFactory()}
                        striped
                        hover
                        condensed
                        classes="table table-bordered table-hover table-sm"
                        wrapperClasses="table-responsive"
                        noDataIndication={"No data to display here"}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </ToolkitProvider>
        )}
      </React.Fragment>
    );
  }
}

export default withSnackbar(ContactList);

function getColumns(columnsHeaders, hideColumns) {
  let columns = [];
  const { keys, def } = columnsHeaders;

  _.forEach(keys, (key) => {
    columns.push({ ...def[key], hidden: _.includes(hideColumns, key) });
  });
  return columns;
}
