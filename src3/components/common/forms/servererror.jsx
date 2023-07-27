import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import servererror from './../../../images/servererror.svg';

import {subDirectory} from '../../../config.json'

class ServerError extends PureComponent {
 
 
  render() {
    return (
      <Fragment>
        <Container>
        <Row style={{ marginTop: '50px' }}>
            <Col md={3}></Col> 
            <Col md={6}>
              <img src={servererror} alt="NodataFound" />
            </Col>
            <Col md={3}></Col>

          </Row>

          <Row>
          <Col md={3}></Col> 
            <Col md={6} style={{textAlign:'center'}}>
              <Link to={`${subDirectory}/user/home`}>Go to Home Page </Link>
            </Col>
            <Col md={3}></Col> 

          </Row>

        </Container>
      
 
      </Fragment>
    )
  }
}

export default ServerError;

