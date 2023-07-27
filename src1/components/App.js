import Auth from "auth";
import { loadProgressBar } from "axios-progress-bar";
import ServerError from "components/common/forms/servererror";
import User from "components/user";
import Wrapper from "components/Wrapper";
import { withSnackbar } from "notistack";
import React, { Fragment, PureComponent } from "react";
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter,
  BrowserRouter as Router,
  withRouter,
} from "react-router-dom";
import Routes from "../components/common/Routes";
import { getCurrentUser, getJwt } from "service/authService";
import { upiPayment } from "../components/payment/upiPayment";
import { subDirectory } from "../config.json";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLogedIn: false,
      isWrapper: false,
      isUser: true,
      merchantId:""
    };
  }
  componentDidMount = async () => {
    await this.verifyUser();
    await this.getUserInfo();
    await loadProgressBar();
  };

  verifyUser = async () => {
    const isStateCheck = this.stateCheck();
    if (!isStateCheck) {
    } else {
      await this.setState({ isUser: false });
    }
  };

  stateCheck = async () => {
    try {
      let isLogedIn = getCurrentUser();
      return isLogedIn;
    } catch (err) {
      return false;
    }
  };

  getUserInfo = async () => {
    try {
      if (this.stateCheck()) {
        let res = await getJwt("__info");
        console.log(res, "data");
        const { userRole } = res;
        const {uid}= res;
        this.setState({merchantId:uid})
        switch (userRole) {
          case "A":
          case "SA":
          case "D":
            await this.setState({
              isUser: false,
              isWrapper: true,
              isLogedIn: true,
              userRole,
            });
            return;
          case "U":
            await this.setState({
              isUser: true,
              isWrapper: false,
              isLogedIn: true,
              userRole,
            });
            return;
          default:
            await this.setState({
              isUser: true,
              isWrapper: false,
              isLogedIn: false,
              userRole,
            });
            break;
        }
      }
    } catch (err) {}
  };

  render() {
    const { isWrapper, isUser, isLogedIn, userRole,merchantId } = this.state;
    console.log(this.props);
    return (
      <Fragment>
        <BrowserRouter basename="/easyfruitveg">
          <Router>
            {isWrapper && !isUser && isLogedIn && (
              <Wrapper userRole={userRole} merchantId={merchantId} {...this.props} />
            )}
            {!isWrapper && (
              <Switch>
                <Redirect
                  from={`${subDirectory}`}
                  to={`${subDirectory}/user/home`}
                  exact
                  component={User}
                  props={this.props}
                />
                <Route path={`${subDirectory}`} exact component={User} />
                <Route
                  path={`${subDirectory}/auth/:pageName`}
                  exact
                  component={Auth}
                  props={this.props}
                />
                <Route
                  path={`${subDirectory}/upi/upiPayment`}
                  exact
                  component={upiPayment}
                  props={this.props}
                />
                <Route
                  path={`${subDirectory}/user/:pageName`}
                  exact
                  component={User}
                  props={this.props}
                />
                <Route
                  path={`${subDirectory}/Error`}
                  exact
                  component={ServerError}
                  props={this.props}
                />
              </Switch>
            )}
          </Router>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default withRouter(App);
