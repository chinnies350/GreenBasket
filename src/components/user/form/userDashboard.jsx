import 'styles/userstyle.css';

import BreadCrumb from 'components/common/forms/BreadCrumb';
import { withSnackbar } from 'notistack';
import React, { Fragment, PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import * as IosIcons from 'react-icons/io';
import { Col, Row } from 'reactstrap';
import { getJwt } from 'service/authService';
import { addtoCart, addtoWishlist } from 'service/profileService';

import myImages from '../../../images/nodatafound.svg';
import Card from '../../common/forms/Card';

import { subDirectory } from '../../../config.json'

class UserDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageName: '',
      productDetails: []
    }

  }

  componentDidMount = async () => {
    await this.init();
  }


  componentWillReceiveProps = async () => {
    await this.init();
  }


  componentDidUpdate = async () => {
    await this.init();
  }

  init = async () => {
    const { props: { match: { params: { pageName } } }, data: productDetails } = this.props;
    await this.setState({ pageName, productDetails })
  }


  cartloginCheck = async (event, data) => {
    const { target: { checked } } = event;
    if (!checked) return
    if (await this.getUserInfo())
      return await this.addtoCart(data);
    return this.props.props.history.push(`${subDirectory}/auth/identifier`);
  }


  wishlistloginCheck = async (event, data) => {
    const { target: { checked } } = event;
    if (!checked) return
    if (await this.getUserInfo())
      return await this.addtoWishlist(data);
    return this.props.props.history.push(`${subDirectory}/auth/identifier`);
  }


  getUserInfo = async () => {
    try {
      let res = await getJwt('__info');
      if (!res) return false
      const { uid } = res;
      await this.setState({ uid: uid, userInfo: res });
      return true;
    } catch (err) {
      return false;
    }

  }

  addtoCart = async (data) => {
    const { productName, productId, quantity, productUom, productQuantity, merchantId, categoryId } = data;

    let postData = {
      "userId": this.state.uid,
      "productId": productId,
      "categoryId": categoryId,
      "quantity": quantity || productQuantity,
      "productUom": productUom,
      "merchantId": merchantId,
      "noOfOrders": "1"
    }
    console.log(postData);
    let res = await addtoCart(postData)
    if (res.data.statusCode !== 1) return this.addNotification(res.data.message, "warning");
    if (res.data.statusCode === 1) return this.addNotification(`Success: You have added ${productName} to your shopping cart!`);

  }

  addtoWishlist = async (data) => {
    const { productName, productId, quantity, productQuantity, productUom, merchantId } = data;
    let postData = {
      "userId": this.state.uid,
      "productId": productId,
      "quantity": quantity || productQuantity,
      "productUom": productUom,
      "merchantId": merchantId
    }


    let res = await addtoWishlist(postData)
    if (res.data.statusCode !== 1) return this.addNotification(res.data.message, "warning");
    if (res.data.statusCode === 1) return this.addNotification(`Success: You have added ${productName} to your wishlist!`);

  }

  AddToCart(index, param, e) {
    this.setState({ inCart: true, disabledButton: index })
  }

  addNotification = (message, variant = "success") => {
    const { enqueueSnackbar } = this.props
    const options = { variant, anchorOrigin: { vertical: "bottom", horizontal: "center", autoHideDuration: 1000 } };
    enqueueSnackbar(message, options)
  }


  render() {
    const { productDetails } = this.state
    const { pageName } = this.state
    let breadCrumbItems = {
      title: pageName,
      items: [
        { name: "Home", active: false, link: "/user/home" },
        { name: pageName, active: true },
      ]
    };

    return (
      <Fragment>
        <Container>
          <Row>
            <Col>
              <div style={{ marginTop: '50px' }}>
                {pageName && <BreadCrumb data={breadCrumbItems} />}

              </div>
            </Col>
          </Row>

        </Container>
        <Container>
          <Row>

            {productDetails && productDetails.map((c, i) =>
              <Col md={3} sm={12} key={i} style={{ marginBottom: '25px' }}>
                <Card prodname={c.productName} fixprice={c.sellingPrice} offerprice={c.mrp} prodcount={c.productQuantity +" "+c.productUom} imgsource={c.imageUrl} >
                  <div className="row text-center" >
                    <div className="col-md-12">

                      <div className="d-flex flex-row heart-cover-div">
                        <div className="cart-div">
                          <input id={`toggle-cart${i}`} onClick={(e) => this.cartloginCheck(e, c)} className="toggle-cart" type="checkbox" />
                          <label for={`toggle-cart${i}`} className="cart-lbl" title="Add To Cart" >   <IosIcons.IoMdCart /> </label>
                        </div>
                        <div className="heart-div">
                          <input id={`toggle-heart${i}`} onClick={(e) => this.wishlistloginCheck(e, c)} className="toggle-heart" type="checkbox" />
                          <label for={`toggle-heart${i}`} className="hrt-lbl" aria-label="like" title="Add To Wishlist">❤ </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </Container>

        {
          productDetails.length === 0 &&
          <Container>
            <Row style={{ marginTop: '50px' }}>
              <Col sm={3} md={3}></Col>
              <Col sm={6} xs={12} md={6}>
                <img src={myImages} alt="NodataFound" style={{ width: '100%' }} />
              </Col>
              <Col sm={3} md={3}></Col>

            </Row>
          </Container>
        }
      </Fragment>
    )
  }

}
export default withSnackbar(UserDashboard);