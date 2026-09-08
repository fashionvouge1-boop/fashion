import { useEffect, useState, useRef } from "react";
import "./index.css";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import SkeletonLoader from "../SkeletonLoader";
import ProductCard from "../ProductCard";
import animaionImageHOme from "../../assets/2f53o.gif";
import Countdown from "react-countdown";
import OfferCountdown from "../Header/OfferCountdown";
import { API_URL } from "../../config";

const Home = () => {
  const { sliderImages } = useAuth();
  const navigate = useNavigate();
  const [categoryArray, setCategoryArray] = useState([]);
  const [productsArray, setProductsArray] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const ref = useRef(null);
  let location = useLocation();

  useEffect(() => {
    if (ref?.current) {
      if (["STOPPED", "COMPLETED"].includes(ref?.current?.state?.status)) {
        ref?.current?.start();
      }
    }
  }, [location, ref]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((response) => {
        const responseData = response?.data;
        const products = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        setProductsArray(products);
        setIsLoader(false);
      })
      .catch(() => {
        setProductsArray([]);
        setIsLoader(false);
      });
  }, []);

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free",
      slides: { perView: 1, spacing: 15 },
    },
    [
      (slider) => {
        let timeout;
        let clearNextTimeout = () => clearTimeout(timeout);
        let nextTimeout = () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => slider.next(), 2000);
        };
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", clearNextTimeout);
          slider.container.addEventListener("mouseout", nextTimeout);
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  return (
    <div className="category_block">
      <Container>

        <Row className="d-flex flex-row flex-nowrap overflow-x-auto overflow-y-hidden category-box">
          {categoryArray.map((item) => (
            <Col xs={3} md={3} key={item._id}>
              <Image
                onClick={() => navigate(`/category/${item._id}`)}
                src={item?.images?.[0]?.src || ""}
                rounded
                style={{ width: "63px", maxHeight: "63px" }}
              />
            </Col>
          ))}
        </Row>

        {/* ---------- Home Animation Image ---------- */}

        <Row>
          <div>
            <img src={animaionImageHOme} className="w-100 mb-2" />
          </div>
        </Row>

        {/* ---------- Slider ---------- */}
        <Row>
          {sliderImages?.length > 0 && (
            <Col md={12} xs={12} className="position-relative">
              <div ref={sliderRef} className="keen-slider mt-1">
                {sliderImages.map((item, index) => (
                  <div key={index} className="keen-slider__slide number-slide1">
                    <Image src={item} rounded style={{ width: "100%" }} />
                  </div>
                ))}
              </div>
            </Col>
          )}
        </Row>

        {/* ---------- Offer Marquee ---------- */}

        <div className="menu mt-2" style={{ backgroundColor: process.env.REACT_APP_THEAM_COLOR }}>
          <marquee width="100%" direction="left" height="30px" style={{ color: "white" }}>
            Buy 2 Get 1 Free (Add 3 items to cart)
          </marquee>
        </div>

        {/* ---------- Offer Countdown ---------- */}

        <div className="main-time">
          <div className="inner-time">
            <div className="dod-div">
              <div className="dod-label">
                Hurry Up !! <span className="big-sale-text">Big Sale</span>
              </div>
              <div className="container p-3" style={{ textAlign: "center" }}>
                <Countdown
                  date={Date.now() + parseInt(process.env.REACT_APP_OFFER_TIME)}
                  ref={ref}
                  renderer={() => <OfferCountdown />}
                  intervalDelay={1000}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- PRODUCT GRID FIXED ---------- */}

        {isLoader ? (
          <Row xs={2} md={2} className="g-0 mt-2">
            <Col><SkeletonLoader /></Col>
            <Col><SkeletonLoader /></Col>
            <Col><SkeletonLoader /></Col>
            <Col><SkeletonLoader /></Col>
          </Row>
        ) : (
          <Row xs={2} md={2} className="g-0">
            {productsArray.map((item, index) => (
              <Col key={item._id} xs={6} md={6} className="g-0">
                <ProductCard item={item} index={index} />
              </Col>
            ))}

          </Row>

        )}
        <Button className="btn my-3 d-flex justify-content-center align-items-center ripple animated" 
        style={{ fontWeight: 600, fontSize: "18px", margin: "auto", borderWidth: "2px", padding: "10px 20px", borderColor: "var(--them-color)", color: "var(--them-color)", background: "#ffff", marginTop: "50%" }} 
        onClick={(e) => { e?.target?.classList?.add("bounceIn"); setTimeout(() => { if (e?.target?.classList?.contains("bounceIn")) e?.target?.classList?.remove("bounceIn"); }, 1000); }} > View More </Button>
      </Container>
    </div>
  );
};

export default Home;
