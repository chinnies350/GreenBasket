import "styles/table.css";

import BreadCrumb from "components/common/forms/BreadCrumb";
import _ from "lodash";
import { withSnackbar } from "notistack";
import React, { Fragment, PureComponent } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import * as InoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import { getCurrentUser, getJwt } from "service/authService";
import {
  deleteProduct,
  getAllProducts,
  updateProduct,
  getAllProductsById,
} from "service/catalogService";

import { subDirectory } from "../../config.json";

const { SearchBar } = Search;

class ProductList extends PureComponent {
  state = {
    data: [],
    isTableLoading: true,
    MerchantId: "",
    merchantId: "",
    userRole: "",
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
      await this.getAllProductsById(this.state.merchantId);
    }
  };
  init1 = async () => {
    let Merchant = window.localStorage.getItem("merchantId");
    await this.setState({ MerchantId: Merchant });
    if (!Merchant) {
      await this.getAllProducts();
    } else {
      await this.getAllProductsById(this.state.MerchantId);
    }
  };

  getAllProducts = async () => {
    const res = await getAllProducts();
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (!statusCode) return this.setState({ data: [], isTableLoading: false });
    await this.setState({ data, isTableLoading: false });
    await this.initTableData();
  };
  getAllProductsById = async (data2) => {
    const res = await getAllProductsById(data2);
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (statusCode == 0) {
      this.addNotification("Soory No data Found For Your Id","error")
      return this.setState({ data: [], isTableLoading: false });
    }
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
      "Category Id",
      "Product Id",
      "Product Name",
      "Product Image",

      "MRP(Rs)",
      "Selling Price(Rs)",
      "Status",
      "actions",
    ];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v));
    let def = {
      "Category Id": {
        dataField: "categoryId",
        text: "Category Id ",
        sort: true,
      },
      "Product Id": { dataField: "productId", text: "Product Id ", sort: true },

      "Product Name": {
        dataField: "productName",
        text: "Product Name ",
        sort: true,
      },
      "Product Image": {
        dataField: "productImage",
        text: "Product Image",
        formatter: imageFormater,
        sort: true,
      },
      "MRP(Rs)": { dataField: "productMrp", text: "MRP(Rs) ", sort: true },
      "Selling Price(Rs)": {
        dataField: "productSellingPrice",
        text: "Selling Price(Rs) ",
        sort: true,
      },
      Status: {
        dataField: "pstatus",
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
    if (row.productStatus === "A") {
      links.push("Active");
      return <div className="actions">{links.concat(" ")}</div>;
    } else {
      links.push("In-Active");
      return <div className="actions">{links.concat(" ")}</div>;
    }
  };

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    if (row.productStatus === "A") {
      links.push(
        <InoIcons.IoMdCreate
          title="Edit"
          onClick={() =>
            this.editFun(`${subDirectory}/catalog/product/edit`, row)
          }
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
          onClick={() =>
            this.editFun(`${subDirectory}/catalog/product/edit`, row)
          }
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
      merchantId: row.merchantId,
      categoryId: row.categoryId,
      subCategoryId: row.subCategoryId,
      productName: row.productName,
      description: row.description,
      productQuantity: row.productQuantity,
      productUom: row.productUom,
      productMrp: row.productMrp,
      productSellingPrice: row.productSellingPrice,
      productImage: row.productImage,
      bestSelling: row.bestSelling,
      productStatus: "A",
      productId: row.productId,
      categoryName: row.categoryName,
    };

    let response = await updateProduct(data);
    console.log(response);
    if (response.data.statusCode === 1) {
      await this.init();
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
    let params = `productId=${row.productId}`;
    response = await deleteProduct(params);
    if (response.data.statusCode !== 1)
      return this.addNotification(response.data.message, "danger");
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.message);
      await this.init();
      await this.setState({ isTableLoading: false });
    }
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
      title: "Products",
      items: [
        { name: "Home", active: false, link: `${subDirectory}/dashboard` },
        { name: "Products", active: true },
      ],
    };
    const { data, columns, isTableLoading, userRole } = this.state;
    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <div className="clearfix"> </div>
        {data && columns && !isTableLoading && (
          <ToolkitProvider keyField="id" data={data} columns={columns} search>
            {(props) => (
              <div>
                <Row>
                  <Col sm={10}>
                    <div className="d-flex justify-content-end">

                        <Link to={`${subDirectory}/catalog/product/add`}>
                          <Button size={"sm"} color="primary">
                            + Add Product
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
                        keyField="productId"
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

export default withSnackbar(ProductList);

function getColumns(columnsHeaders, hideColumns) {
  let columns = [];
  const { keys, def } = columnsHeaders;

  _.forEach(keys, (key) => {
    columns.push({ ...def[key], hidden: _.includes(hideColumns, key) });
  });
  return columns;
}

function imageFormater(cell, row, rowIndex, formatExtraData) {
  return (
    <img
      className="img-thumbnail"
      src={cell}
      alt="Hello"
      style={{ height: "50px", width: "50px" }}
    />
  );
}
