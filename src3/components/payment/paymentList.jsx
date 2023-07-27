import "styles/table.css";

import BreadCrumb from "components/common/forms/BreadCrumb";
import _ from "lodash";
import React, { Fragment, PureComponent } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import * as InoIcons from "react-icons/io";

import { Link } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import {
  getPaymentDetailsById,
  updatePaymentDetails,
  getPaymentDetails,
  deltePaymentDetails,
} from "service/paymentService";
import { getJwt } from "service/authService";
import { subDirectory } from "../../config.json";

const { SearchBar } = Search;

export default class OrderList extends PureComponent {
  state = {
    data: [],
    isTableLoading: true,
    MerchantId: "",
    merchantId: "",
  };
  componentDidMount = async () => {
    await this.init();
  };
  init = async () => {
    let res = await getJwt("__info");
    console.log(res);
    const { merchantId } = res;
    const { userRole } = res;
    await this.setState({ userRole: userRole });
    await this.setState({ merchantId: merchantId });
    console.log(this.state.merchantId, "MId");
    if (userRole == "SA") {
      await this.init1();
    } else {
      await this.getBannersById(this.state.merchantId);
    }
  };
  init1 = async () => {
    let Merchant = window.localStorage.getItem("merchantId");
    await this.setState({ MerchantId: Merchant });
    if (!Merchant) {
      await this.getPaymentDetails();
    } else {
      await this.getPaymentDetailsById(this.state.merchantId);
    }
  };

  getPaymentDetails = async () => {
    const res = await getPaymentDetails();
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (statusCode == 0) {
      alert("No data found for ypur id");
      return this.setState({ data: [], isTableLoading: false });
    }
    await this.setState({ data, isTableLoading: false });
    await this.initTableData();
  };
  getPaymentDetailsById = async (data2) => {
    const res = await getPaymentDetailsById(data2);
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (!statusCode) return this.setState({ data: [], isTableLoading: false });
    await this.setState({ data, isTableLoading: false });
    await this.initTableData();
  };

  initTableData = async () => {
    const { hideColumns } = this.state;
    const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
    const columns = getColumns(columnHeaders, hideColumns);
    await this.setState({ columns, columnHeaders, hideColumns });
  };

  getColumnHeaders(prefixUrl = "") {
    let allKeys = [
      "Payment Id",
      "Merchant Id",
      "Payment Type",
      "Access Code",
      "Payment Status",
      "Upi Id",
      "Actions",
    ];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v));
    let def = {
      "Payment Id": { dataField: "paymentId", text: "Payment Id", sort: true },
      "Merchant Id": {
        dataField: "merchantId",
        text: "Merchan tId",
        sort: true,
      },
      "Payment Type": {
        dataField: "paymentType",
        text: "Payment Type",
        sort: true,
      },
      "Access Code": {
        dataField: "accessCode",
        text: "AccessCode",
        sort: true,
      },
      "Upi Id": { dataField: "upiId", text: "UpiId", sort: true },
      "Payment Status": {
        dataField: "status",
        isDummyField: true,
        text: "status",
        formatter: this.statusFormatter,
      },
      Actions: {
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
      return (
        <div
          className="actions"
          className="actions text-center delete"
          style={{ color: "#198606", fontWeight: "600", cursor: "pointer" }}
        >
          {links.concat(" ")}
        </div>
      );
    } else {
      links.push("In-Active");
      return (
        <div
          className="actions"
          style={{ color: "red", fontWeight: "600", cursor: "pointer" }}
        >
          {links.concat(" ")}
        </div>
      );
    }
  };

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    if (row.categoryStatus === "A") {
      links.push(
        <InoIcons.IoMdCreate
          title="Edit"
          onClick={() => this.editFun(`${subDirectory}/payment/editform`, row)}
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
          onClick={() => this.editFun(`${subDirectory}/payment/editform`, row)}
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

  changeStatus = async (row) => {
    await this.setState({ isTableLoading: true });
    let data = {
      paymentType: row.paymentType,
      accessCode: row.accessCode,
      workingKey: row.workingKey,
      redirectUrl: row.redirectUrl,
      cancelUrl: row.cancelUrl,
      secureUrl: row.secureUrl,
      upiId: row.upiId,
      status: "A",
      merchantId: row.merchantId,
      paymentId: row.paymentId,
    };

    let response = await updatePaymentDetails(data);
    console.log(response);
    if (response.data.statusCode === 1) {
      await this.getPaymentDetailsById(this.state.MerchantId);
      this.addNotification("Status " + response.data.message);
      await this.setState({ isTableLoading: false });
    }
  };

  editFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row },
    });
  };

  deleteFun = async (row) => {
    await this.setState({ isTableLoading: true });
    let response;
    let data = {
      merchantId: row.merchantId,
      paymentId: row.paymentId,
    };

    response = await deltePaymentDetails(data);
    if (response.data.statusCode !== 1)
      return this.addNotification(response.data.data, "danger");
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.message);
      await this.getPaymentDetailsById(this.state.MerchantId);
      await this.setState({ isTableLoading: false });
    }
  };

  render() {
    const breadCrumbItems = {
      title: "Payment List",
      items: [
        { name: "Home", active: false, link: `${subDirectory}/dashboard` },
        { name: "Payment List", active: true },
      ],
    };

    const { data, columns } = this.state;
    const { MerchantId } = this.state;
    console.log(this.props.props, "props");
    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <Row>
          <Col></Col>
        </Row>
        <div className="clearfix"></div>

        {data && columns && (
          <ToolkitProvider keyField="id" data={data} columns={columns} search>
            {(props) => (
              <div>
                <Row>
                  <Col sm={10}>
                    <div className="d-flex justify-content-end">
                      <Link to={`${subDirectory}/payment/addform`}>
                        <Button size={"sm"} color="primary">
                          + Add Payment
                        </Button>
                      </Link>
                    </div>
                  </Col>
                  <Col sm={2}>
                    <SearchBar {...props.searchProps} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="table-responsive table-div">
                      <BootstrapTable
                        keyField="id"
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
      </Fragment>
    );
  }
}

function getColumns(columnsHeaders, hideColumns) {
  let columns = [];
  const { keys, def } = columnsHeaders;

  _.forEach(keys, (key) => {
    columns.push({ ...def[key], hidden: _.includes(hideColumns, key) });
  });
  return columns;
}
