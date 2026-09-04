import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import "./index.css";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const { whiteListProducts, handleSetWhiteListProducts, setSingleProduct } = useAuth();
  const [randomRatingCount, setRandomRatingCount] = useState(0);

  useEffect(() => {
    const min = 100;
    const max = 5000;
    setRandomRatingCount(Math.floor(Math.random() * (max - min + 1)) + min);
  }, []);

  // -------- SAFE PRICE HANDLING --------
  const variant = item?.variants?.[0] || {};
  const price = Number(variant.price) || null;
  const comparePrice = Number(variant.compare_at_price) || null;

  let discountPercent = null;
  if (price && comparePrice) {
    discountPercent = Math.round((1 - price / comparePrice) * 100);
  }

  return (
    <Card
      style={{ borderRadius: 2, maxHeight: "460px" }}
      onClick={() => {
        setSingleProduct(item);
        navigate(`/single-product/${item._id}`);
      }}
    >
      {/* PRODUCT IMAGE */}
      <div
        style={{
          height: "240px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
        }}
      >
        <Card.Img
          variant="top"
          src={item?.images?.[0]?.src || ""}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
      </div>

      <Card.Body className="p-2 pb-0">
        <div className="d-flex justify-content-between align-items-center">
          <Card.Subtitle
            style={{
              textAlign: "left",
              color: "#262626",
              fontWeight: "500",
              fontSize: "14px",
            }}
            className="mb-0 text-ellips"
          >
            {item.title}
          </Card.Subtitle>

          {/* WISHLIST ICON */}
          <div
            className="ms-2"
            onClick={(e) => {
              e.stopPropagation();
              handleSetWhiteListProducts(item);
            }}
          >
            {whiteListProducts?.find((o) => o._id === item._id) ? (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#ed143d"
                  d="M12 21.28l-.06-.01c-.34 0-.67-.14-.91-.38l-7.34-7.38A6.04 6.04 0 012.88 9.04c0-1.7.65-3.29 1.82-4.47A6.17 6.17 0 017.17 2.72c1.4 0 2.73.46 3.83 1.29a5.97 5.97 0 013.83-1.29c1.67 0 3.25.66 4.42 1.86A6.04 6.04 0 0121.12 9c0 1.7-.65 3.29-1.82 4.47l-7.33 7.38c-.24.25-.57.39-.91.39z"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#3E4152"
                  d="M12 21.28l-.06-.01c-.34 0-.67-.14-.91-.38l-7.34-7.38A6.04 6.04 0 012.88 9.04c0-1.7.65-3.29 1.82-4.47A6.17 6.17 0 017.17 2.72c1.4 0 2.73.46 3.83 1.29a5.97 5.97 0 013.83-1.29c1.67 0 3.25.66 4.42 1.86A6.04 6.04 0 0121.12 9c0 1.7-.65 3.29-1.82 4.47l-7.33 7.38c-.24.25-.57.39-.91.39z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* PRICE AREA */}
        <Card.Text className="mb-0" style={{ lineHeight: "18px" }}>

          {/* DISCOUNT + OLD PRICE */}
          {discountPercent !== null ? (
            <>
              <span
                style={{
                  color: "#37c434ff",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {discountPercent}% OFF
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#9A9A9A",
                  marginLeft: "5px",
                  textDecoration: "line-through",
                }}
              >
                ₹{comparePrice}
              </span>
            </>
          ) : null}

          {/* MAIN PRICE ALWAYS SHOW */}
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#000" }}>
            ₹{price || "0"}
          </div>
        </Card.Text>

        {/* RATING */}
        <Card.Text className="mb-0">
          <span className="rating_box_des">
            {item.rating}
            <i className="fa-solid fa-star"></i>
          </span>
          <span className="rating_num">{randomRatingCount} Ratings</span>
        </Card.Text>

        <Card.Text>
          <div className="delivery-txt">Limited time deal</div>
        </Card.Text>
      </Card.Body>

      {/* ADD TO CART */}
      <Card.Footer className="px-2 py-0 bg-white border-0 pt-0">
        <Button
          className="w-100"
          variant="dark"
          style={{
            backgroundColor: "#ec651dff",
            border: "none",
          }}
        >
          Add To Cart
        </Button>
      </Card.Footer>

      <Card.Text className="mt-0">
        <div className="free-delivery-txt">Free Delivery in Two Days</div>
      </Card.Text>
    </Card>
  );
};

export default ProductCard;
