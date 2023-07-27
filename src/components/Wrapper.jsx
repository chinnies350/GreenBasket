import Header from "components/common/forms/Header";
import SideNav from "components/common/forms/SideNav";
import UsersideNav from "components/common/forms/UsersideNav";
import Routes from "components/common/Routes";
import React, { Fragment, PureComponent } from "react";
import { Col, Container, Row } from "reactstrap";

class Wrapper extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { userRole } = this.props;
    console.log(this.props);
    return (
      <Fragment>
        <Header />
        <Container fluid>
          <Row>
            <Col md={2} sm={12} className="p-0">
              {/* <SideNav userRole={userRole} {...this.props} /> */}
              {userRole === "SA" ?
                <>
                  {console.log('Coming SA')}
                  <SideNav userRole={userRole} {...this.props} />
                </>
                : <UsersideNav userRole={userRole} {...this.props} />}
              
              {/* {userRole === "A" ?
                <>
                  {console.log('Coming A')}
                  <UsersideNav userRole={userRole} {...this.props} />
                </>
                : null} */}
            </Col>
            <Col className="content" md={10} sm={12}>
              <Routes />
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default Wrapper;
