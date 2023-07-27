import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "styles/style.css";
import "styles/userstyle.css";

import Card from "components/common/forms/Card";
import carouselimagemobile1 from "images/carousel1.png";
import carouselimagemobile10 from "images/carousel10.png";
import carouselimagemobile11 from "images/carousel11.png";
import carouselimagemobile2 from "images/carousel2.png";
import carouselimagemobile3 from "images/carousel3.png";
import carouselimagemobile4 from "images/carousel4.png";
import carouselimagemobile5 from "images/carousel5.png";
import carouselimagemobile6 from "images/carousel6.png";
import carouselimagemobile7 from "images/carousel7.png";
import carouselimagemobile8 from "images/carousel8.png";
import carouselimagemobile9 from "images/carousel9.png";
import cartimage from "../../../images/New folder/1.png";
import onetimecheckout from "../../../images/New folder/2.png";
import samedaydelivery from "../../../images/New folder/3.png";
import mobileimage from "images/iphone outline.png";
import _ from "lodash";
import { withSnackbar } from "notistack";
import React, { Fragment, PureComponent } from "react";
import PageProgress from "react-page-progress";
import { Image } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import ScrollMenu from "react-horizontal-scrolling-menu";
import * as FaIcons from "react-icons/fa";
import * as IosIcons from "react-icons/io";
import ReactNotification from "react-notifications-component";
import { Button, CarouselItem, Col, Container, Row } from "reactstrap";
import { getJwt } from "service/authService";
import { getcarousel } from "service/carousel";
import { getConfigName, getDeliverHour, getSignInImage } from "service/configService";
import { getHomeConfig } from "service/homeSettings";
import { addtoCart, addtoWishlist } from "service/profileService";
import { getseasonbasket } from "service/seasonbasket";
import { getspecialOffer } from "service/specialoffers";
import { getCookieData,storeCookieData } from "../../common/CookiesFunc";

import { getContactList2 } from "service/contactService";

import { subDirectory } from "../../../config.json";

const items = [
  { src: carouselimagemobile1, altText: "Slide 1" },
  { src: carouselimagemobile2, altText: "Slide 2" },
  { src: carouselimagemobile3, altText: "Slide 3" },
  { src: carouselimagemobile4, altText: "Slide 4" },
  { src: carouselimagemobile5, altText: "Slide 5" },
  { src: carouselimagemobile6, altText: "Slide 6" },
  { src: carouselimagemobile7, altText: "Slide 7" },
  { src: carouselimagemobile8, altText: "Slide 8" },
  { src: carouselimagemobile9, altText: "Slide 9" },
  { src: carouselimagemobile10, altText: "Slide 10" },
  { src: carouselimagemobile11, altText: "Slide 11" },
];

const ArrowLeft = (
  <div className="arrow-prev">
    <IosIcons.IoIosArrowBack />
  </div>
);
const ArrowRight = (
  <div className="arrow-next">
    <IosIcons.IoIosArrowForward />{" "}
  </div>
);

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
    this.state = {
      data: [],
      specialOfferList: [],
      seacenBasketList: [],
      carouselList: [],
      isLogedIn: false,
      isLoading: true,
      merchantd: 0,
    };
  }

  componentDidMount = async () => {
    var merchantId = getCookieData("MERID");

    await this.setState({ merchantd: merchantId })

    console.log(merchantId)
    await this.init(merchantId);
  };

  init = async (merchantId) => {
    // await this.getContactList2();
    await this.getHomeConfig();
    await this.getspecialOffer(merchantId);
    await this.getseasonbasket(merchantId);
    await this.getcarousel();
    await this.getConfigName();
    await this.getDeliverHour();
    await this.SignInImage();
  };
  SignInImage = async () => {
    let res = await getSignInImage(this.state.merchantd)
    console.log(res)
    if(res.data.data){
      // await this.setState({signinimage })
      let image = res.data.data
      let signImage
      image.map((i,j) =>{
        signImage = i.configValue
      })
      await storeCookieData('signImage',signImage)
    }
  }

  getConfigName = async () => {
    let res = await getConfigName(this.state.merchantd);
    console.log(res)

    if (res.data.message === "No data found") {
      await this.setState({ configDetails: [] });
    }
    else if (res.data.data) {
      await this.setState({ configDetails: res.data.data[0] });
    }
  };

  getDeliverHour = async () => {
    let res = await getDeliverHour(this.state.merchantd);
    if (res.data.data) {
      await this.setState({ DeliveryDetails: res.data.data[0] });
    }
  };

  cartloginCheck = async (data) => {
    let auth = await this.getUserInfo();
    if (auth) return await this.addtoCart(data);
    return this.props.props.history.push(`${subDirectory}/auth/identifier`);
  };

  wishlistloginCheck = async (data) => {
    let auth = await this.getUserInfo();
    if (auth) return await this.addtoWishlist(data);
    return this.props.props.history.push(`${subDirectory}/auth/identifier`);
  };

  getContactList2 = async () => {
    console.log();
    const res = await getContactList2(this.state.merchantd);
    console.log("resssssssss", res);
    const {
      data: { statusCode, data },
    } = res;
    if (!res) return this.setState({ data: [] });
    await this.setState({ data });

    console.log(data)
    console.log(data[0].merchantLogo)

    // await this.initTableData();
  };

  getUserInfo = async () => {
    try {
      let res = await getJwt("__info");
      console.log(res, "response");
      if (!res) return false;
      const { uid } = res;
      await this.setState({ uid: uid, userInfo: res });
      return true;
    } catch (err) {
      return false;
    }
  };

  addtoCart = async (data) => {
    const {
      productName,
      productID,
      productId,
      productUom,
      categoryID,
      categoryId,
      merchantId
    } = data;

    let postData = {
      userId: this.state.uid,
      productId: productID || productId,
      categoryId: categoryID || categoryId,
      productQuantity: 1,
      productUom: productUom,
      noOfOrders: "1",
      merchantId: merchantId

    };
    console.log(postData);
    let res = await addtoCart(postData);
    console.log(res);
    if (res.data.statusCode !== 1)
      return this.addNotification(res.data.message, "warning");
    if (res.data.statusCode === 1)
      return this.addNotification(
        `Success: You have added ${productName} to your shopping cart!`
      );
  };

  addtoWishlist = async (data) => {
    const { productID, productId, productUom, productName, merchantId } = data;
    let postData = {
      userId: this.state.uid,
      productId: productID || productId,
      quantity: 1,
      merchantId: merchantId,
      productUom: productUom,
      noOfOrders: "1",
    };
    console.log(postData, "p[isdpou");
    let res = await addtoWishlist(postData);
    console.log(res, "toWishList");
    if (res.data.statusCode !== 1)
      return this.addNotification(res.data.message, "warning");
    if (res.data.statusCode === 1)
      return this.addNotification(
        `Success: You have added ${productName} to your wishlist!`
      );
  };

  AddToCart(index) {
    this.setState({
      inCart: true,
      disabledButton: index,
    });
  }

  //for special offers
  getspecialOffer = async (merchantId) => {
    let res = await getspecialOffer(merchantId);
    console.log(res);
    if (res.data.statusCode === 1)
      await this.setState({ specialOfferList: res.data.data });
    else await this.setState({ specialOfferList: [] });
  };

  //for season basket
  getseasonbasket = async (merchantId) => {
    let res = await getseasonbasket(merchantId);
    console.log(res);
    if (res.data.statusCode === 1)
      await this.setState({ seacenBasketList: res.data.data });
    else await this.setState({ seacenBasketList: [] });
  };

  //for carousel
  getcarousel = async () => {
    let res = await getcarousel(this.state.merchantd);
    console.log(res);
    if (res.data.statusCode === 1) {
      await this.setState({ carouselList: res.data.data });
    }
  };

  frameLoad = () => {
    const { specialOfferList } = this.state;
    return _.map(specialOfferList, (c, i) => (
      <Fragment>
        {" "}
        <Col md={3} sm={12} style={{ marginBottom: "25px" }}>
          <Card
            prodname={c.productName}
            fixprice={c.productSellingPrice}
            offerprice={c.productMrp}
            // prodcount={c.productUom}
            prodcount={Math.round(c.productQuantity) + "KG"}
            imgsource={c.productImage}
          >
            <div class="">
              <div class="ribbon">
                <span>
                  {" "}
                  {Math.round(
                    ((c["productMrp"] - c["productSellingPrice"]) * 100) / c["productMrp"]
                  )}{" "}
                  % OFF
                </span>
              </div>
            </div>
            <div className="row text-center">
              <div className="col-md-12">
                <div className="d-flex flex-row   heart-cover-div">
                  <div className="heart-div">
                    <input
                      id={`toggle-heart${i}`}
                      className="toggle-heart"
                      type="checkbox"
                    />
                    <label
                      for={`toggle-heart${i}`}
                      onClick={() => this.wishlistloginCheck(c)}
                      className="hrt-lbl"
                      aria-label="like"
                      title="Add To Wishlist"
                    >
                      ❤{" "}
                    </label>
                  </div>
                  <div className="cart-div">
                    <input
                      id={`toggle-cart${i}`}
                      className="toggle-cart"
                      type="checkbox"
                    />
                    <label
                      for={`toggle-cart${i}`}
                      className="cart-lbl"
                      title="Add To Cart"
                      onClick={() => this.cartloginCheck(c)}
                    >
                      {" "}
                      <IosIcons.IoMdCart />{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Fragment>
    ));
  };

  frameLoad1 = () => {
    const { seacenBasketList } = this.state;
    return _.map(seacenBasketList, (c, i) => (
      <Card
        prodname={c.productName}
        fixprice={c.productSellingPrice}
        offerprice={c.productMrp}
        // prodcount={c.productUom }
        prodcount={Math.round(c.productQuantity) + "KG"}
        imgsource={c.productImage}
        key={`bestSellingprod${i}`}
        style={{ width: "235px !important" }}
      >
        <div class="">
          <div class="ribbon">
            <span>
              {" "}
              {Math.round(((c["productMrp"] - c["productSellingPrice"]) * 100) / c["productMrp"])} %
              OFF
            </span>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-12">
            <div className="d-flex flex-row   heart-cover-div">
              <div className="heart-div">
                <input
                  id={`toggle-heartws${i}`}
                  className="toggle-heart"
                  type="checkbox"
                />
                <label
                  for={`toggle-heartws${i}`}
                  onClick={() => this.wishlistloginCheck(c)}
                  className="hrt-lbl"
                  aria-label="like"
                  title="Add To Wishlist"
                >
                  ❤{" "}
                </label>
              </div>
              <div className="cart-div">
                <input
                  id={`toggle-cartcs${i}`}
                  className="toggle-cart"
                  type="checkbox"
                />
                <label
                  for={`toggle-cartcs${i}`}
                  className="cart-lbl"
                  title="Add To Cart"
                  onClick={() => this.cartloginCheck(c)}
                >
                  {" "}
                  <IosIcons.IoMdCart />{" "}
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    ));
  };


  frameLoad2 = () => {
    const { carouselList } = this.state;

    return _.map(carouselList, (s) => (
      <div class="item">
        <img
          src={s.imageUrl}
          alt={s.imageDescription}
          width={500}
          height={400}
          className="d-block w-100"
        />
      </div>
    ));
  };

  searchProdItems = (term) => {
    if (term.length > 0)
      this.props.history.push(`${subDirectory}/user/fruits?search=${term}`);
  };

  getHomeConfig = async () => {
    try {
      const res = await getHomeConfig(this.state.merchantd);
      const {
        data: { statusCode, data: homeData },
      } = res;
      console.log(res);
      if (!statusCode) return this.addNotification(homeData, "warning");
      await this.setState({ homeData, isLoading: false });
    } catch (err) { }
  };

  addNotification = (message, variant = "success") => {
    const { enqueueSnackbar } = this.props;
    const options = {
      variant,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
        autoHideDuration: 500,
      },
    };
    enqueueSnackbar(message, options);
  };


  render() {
    const { homeData, isLoading } = this.state;
    console.log(this.props, "fha", this.state);
    const { specialOfferList, seacenBasketList } = this.state;
    var background = {
      backgroundSize: "cover",
      position: "relative",
      zIndex: 2,
      width: "auto",
      maxWidth: "85%",
    };

    const slides = items.map((item) => {
      return (
        <CarouselItem key={item.src}>
          <img src={item.src} alt={item.altText} />
        </CarouselItem>
      );
    });

    return (
      <Fragment>
        <PageProgress
          height={4}
          zIndex={999}
          position={"sticky"}
          color={"linear-gradient(to bottom, #33ccff -10%, #ff99cc 50%)"}
          position={"fixed"}
        />
        <div
          className="container-fluid"
          style={{ padding: "0px", margin: "0px" }}
        >
          <Carousel>{this.frameLoad2()}</Carousel>
        </div>
        <ReactNotification ref={this.notificationDOMRef} />

        {!isLoading && (
          <Container
            className="mycard "
            style={{ zIndex: 1, marginTop: "-100px" }}
          >
            <Row>
              <Col sm={4} className="borderright">
                <img
                  src={homeData[0]["imageUrl"]}
                  alt="images"
                  className="img-fluid"
                />
                <h3>{homeData[0]["heading"]}</h3>
                <p className="p-3">{homeData[0]["description"]}</p>
              </Col>
              <Col sm={4} className="borderright">
                <img
                  src={homeData[1]["imageUrl"]}
                  alt="images"
                  className="img-fluid"
                />
                <h3>{homeData[1]["heading"]}</h3>
                <p className="p-3">{homeData[1]["description"]}</p>
              </Col>
              <Col sm={4}>
                <img
                  src={homeData[2]["imageUrl"]}
                  alt="images"
                  className="img-fluid"
                />
                <h3>{homeData[2]["heading"]}</h3>
                <p className="p-3">{homeData[2]["description"]}</p>
              </Col>
            </Row>
          </Container>
        )}

        {specialOfferList && specialOfferList.length > 0 && (
          <Container id="containerpadding">
            <Row>
              <Col md={12} sm={12}>
                <h3 class="playList1">OUR SPECIAL OFFERS</h3>
                <hr id="hrline" />
              </Col>
            </Row>
            <Row className="mr-4">{this.frameLoad()}</Row>
            <Row>
              <Col md={8} sm={12}></Col>
            </Row>
          </Container>
        )}
        {seacenBasketList && seacenBasketList.length > 0 && (
          <Container id="containerpadding">
            <Row id="rowpadding">
              <Col md={12} sm={12}>
                <h3 class="playList1">OUR BEST SELLING BASKETS</h3>
                <hr id="hrline" />
              </Col>
            </Row>
            <ScrollMenu
              key="seacen Basket"
              data={this.frameLoad1()}
              arrowLeft={ArrowLeft}
              arrowRight={ArrowRight}
              useButtonRole={false}
              alignOnResize
              alignCenter
            />
          </Container>
        )}
        <br />

        <Container fluid className="checkout d-flex h-100 flex-column">
          <br />
          <Row>
            <Col md={12} sm={12} xs={12}>
              <h3 className="playList1">HOW CHECKOUT WORKS</h3>
              <hr id="hrline" />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col class="flex-grow-1" md={1} sm={1}></Col>
            <Col
              md={3}
              sm={3}
              xs={12}
              style={{
                textAlign: "center",
                marginTop: "50px",
                marginBottom: "50px",
              }}
            >
              <img src={cartimage} width={100} height={100} alt="" />
              <h3 id="h3heading7">Create Your Own Basket</h3>
              <p id="paragraph4">
                User can easily order baskets with minimal delivery charges and
                also you can create your own basket to customize your baskets.
              </p>
            </Col>
            <Col
              md={3}
              sm={3}
              xs={12}
              style={{
                textAlign: "center",
                marginTop: "50px",
                marginBottom: "50px",
              }}
            >
              <img src={onetimecheckout} width={100} height={100} alt="" />
              <h3 id="h3heading7">Choose One Time Checkout</h3>
              <p id="paragraph4">
                Special prices are automatically applied for all type of baskets
                so you can order your basktes as per your prefrences.
              </p>
            </Col>
            <Col
              md={3}
              sm={3}
              xs={12}
              style={{
                textAlign: "center",
                marginTop: "50px",
                marginBottom: "50px",
              }}
            >
              <img src={samedaydelivery} width={100} height={100} alt="" />
              <h3 id="h3heading7">1 Hour Delivery</h3>
              <p id="paragraph4">
                We do delivery in 1 Hour as per your preferences. We generally
                operate on slots which helps to both customer as well as ours.
              </p>
            </Col>
            <Col class="flex-grow-1" md={1} sm={1}></Col>
          </Row>
        </Container>
        <Container fluid className="xplorebg">
          <br />
          <Row>
            <Col md={12} sm={12}>
              <h3 className="playList1">EXPLORE OUR APP</h3>
              <hr id="hrline" />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm={1} xs={12}></Col>
            <Col sm={5} xs={12} id="columncarousel">
              <Image
                style={background}
                responsive
                src={mobileimage}
                width={330}
                height={570}
                className="img-responsive"
              ></Image>
              <div className="mobile-carousel">
                <Carousel> {slides} </Carousel>
              </div>
            </Col>
            <Col sm={5} xs={12} id="downlopadcolumnpadding">
              <h3 className="playList1">Also Available On App </h3>
              <h4>Download Our Android App Today</h4>
              <br />
              <br />
              <a href="https://play.google.com/store?hl=en">
                <Button id="googleplaybtn">
                  <FaIcons.FaGooglePlay /> Google Play
                </Button>
              </a>
            </Col>
            <Col sm={1} xs={12}></Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default withSnackbar(Home);
