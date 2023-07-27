import React, { PureComponent } from "react";
import {
  Route,
  Switch,
  BrowserRouter,
  BrowserRouter as Router,
} from "react-router-dom";

import Dashboard from "components/dashboard";
import ProductStatusDetails from "components/dashboard/products";
import Orders from "components/orders";
import Catalog from "components/catalog";
import CatalogForms from "components/catalog/forms";
import Customer from "components/customers";
import Banner from "components/banner";
import Contact from "components/contact";
// import Profile from 'components/profile';
import ProductDetails from "components/dashboard/products";
import CustomerForms from "components/customers/forms";
import Configuration from "components/configuration";

import HomeSettings from "components/homesettings";

import Payments from "components/payment";
import { subDirectory } from "../../config.json";

class Routes extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    console.log(this.props, "hwdiohiodh");
    return (
      <>
          <Switch>
            <Route path={`${subDirectory}/`} exact component={Dashboard} />
            <Route
              path={`${subDirectory}/dashboard`}
              exact
              component={Dashboard}
            />
            <Route
              path={`${subDirectory}/dashboard/:pageName`}
              exact
              component={ProductStatusDetails}
            />
            <Route
              path={`${subDirectory}/orders/:pageName`}
              exact
              component={Orders}
            />
            <Route
              path={`${subDirectory}/catalog/:pageName`}
              exact
              component={Catalog}
            />
            <Route
              path={`${subDirectory}/catalog/:pageName/:formType`}
              exact
              component={CatalogForms}
            />
            <Route
              path={`${subDirectory}/customer/home/config`}
              exact
              component={HomeSettings}
            />
            <Route
              path={`${subDirectory}/customer/:pageName`}
              exact
              component={Customer}
            />
            <Route
              path={`${subDirectory}/banner/:pageName`}
              exact
              component={Banner}
            />
            <Route
              path={`${subDirectory}/merchant/:pageName`}
              exact
              component={Contact}
            />
            <Route
              path={`${subDirectory}/payment/:pageName`}
              exact
              component={Payments}
            />
            <Route
              path={`${subDirectory}/payment/:pageName/:formtype`}
              exact
              component={Payments}
            />
            <Route
              path={`${subDirectory}/customer/:pageName/:formType`}
              exact
              component={CustomerForms}
            />
            <Route
              path={`${subDirectory}/payment/:formtype`}
              exact
              component={Payments}
            />

            <Route
              path={`${subDirectory}/project/config`}
              exact
              component={Configuration}
            />
          </Switch>
      </>
    );
  }
}

export default Routes;
