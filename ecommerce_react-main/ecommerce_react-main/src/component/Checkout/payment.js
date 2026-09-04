import { useEffect, useRef, useState } from "react";
import "./index.css";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { PHONEPE_NODE_URL, THEAM_COLOR } from "../../config";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const {
    selectedProduct,
    totalPrice,
    totalDiscount,
    totalMRP,
    totalExtraDiscount,
    isPaymentPageLoading,
    setIsPaymentPageLoading,
    address,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.initialValues || address || {};

  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const initScript = async () => {
      const loaded = await loadRazorpayScript();
      setScriptLoaded(loaded);
    };
    initScript();
  }, []);

  const displayRazorpay = async (orderData) => {
    const { orderId, amount, currency, keyId, name, email, mobile } = orderData;

    const options = {
      key: keyId,
      amount: amount,
      currency: currency,
      name: "Sera Store",
      description: "Order Payment",
      order_id: orderId,
      handler: async (response) => {
        try {
          setLoading(true);
          const verifyRes = await axios.post(
            `${PHONEPE_NODE_URL}products/razorpay/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data?.success) {
            localStorage.setItem(
              "razorpayPaymentDetails",
              JSON.stringify(response)
            );
            navigate("/Success", { state: { ...response } });
          } else {
            alert("Payment verification failed. Please try again.");
            navigate("/Failure");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Payment verification error.");
          navigate("/Failure");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: name || userData.fullname || "Customer",
        email: email || userData.email || "customer@example.com",
        contact: mobile || userData.mobile || "",
      },
      notes: {
        address: userData.address1 || "",
        city: userData.city || "",
        pincode: userData.pincode || "",
      },
      theme: {
        color: THEAM_COLOR || "#FB641B",
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          console.log("Payment modal closed");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", (response) => {
      console.error("Payment failed:", response.error);
      setLoading(false);
      alert(`Payment failed: ${response.error.description || "Unknown error"}`);
      navigate("/Failure");
    });
    paymentObject.open();
  };

  const payNow = async () => {
    if (!scriptLoaded) {
      alert("Payment system is still loading. Please wait...");
      return;
    }

    const data = {
      name: userData.fullname,
      mobileNumber: userData.mobile,
      email: userData.email,
      amount: totalPrice,
      merchantkey: process.env.REACT_APP_PHONEPE_MKEYS,
      merchantid: process.env.REACT_APP_PHONEPE_MIDS,
      domainName: window.location.hostname,
    };

    try {
      setLoading(true);

      const orderRes = await axios.post(
        `${PHONEPE_NODE_URL}products/razorpay/order`,
        {
          amount: totalPrice,
          name: userData.fullname,
          email: userData.email,
          mobile: userData.mobile,
        }
      );

      if (orderRes.data?.success && orderRes.data?.data) {
        const orderInfo = orderRes.data.data;
        await displayRazorpay({
          orderId: orderInfo.orderId,
          amount: orderInfo.amount,
          currency: orderInfo.currency,
          keyId: orderInfo.keyId,
          name: userData.fullname,
          email: userData.email,
          mobile: userData.mobile,
        });
      } else {
        alert("Failed to create order. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.log("error in payment", error);
      alert("Payment error. Please try again.");
      setLoading(false);
    }
  };

  localStorage.setItem("totalPrice", totalPrice);

  return isPaymentPageLoading ? (
    <Container
      className="p-0 pt-3 pb-3 flex-column position-relative d-flex justify-content-center align-items-center"
      style={{ background: "#f2f2f3", height: "250px" }}
    >
      <div>Please Wait...</div>
      <Spinner />
    </Container>
  ) : (
    <>
      {loading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.9)",
            zIndex: 9999999999,
            top: 0,
            left: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Spinner />
            <div className="mt-2">Processing Payment...</div>
          </div>
        </div>
      )}
      <Container
        className="p-0 pt-3 pb-3 position-relative d-flex flex-column justify-content-between"
        style={{ background: "#f2f2f3", minHeight: "100vh" }}
      >
        <div>
          <div className="mt-3">
            {selectedProduct?.length && (
              <div className="bg-white px-4 py-4">
                <h6
                  id="product_details"
                  className="card-title text-start fw-bold border-bottom pb-2"
                >{`PRICE DETAILS (${
                  selectedProduct?.length === 1
                    ? "1 Item"
                    : `${selectedProduct?.length} Items`
                })`}</h6>
                <div className="mt-3">
                  <div className="d-flex flex-row justify-content-between align-items-center ">
                    <span>Total MRP</span>
                    <span className="ms-2">
                      <span>
                        <span className="">₹</span>
                        {totalMRP}
                      </span>
                    </span>
                  </div>
                  {totalDiscount ? (
                    <div className="d-flex flex-row justify-content-between align-items-center mt-2">
                      <span>Discount on MRP</span>
                      <span className="ms-2 text-success">
                        <span>
                          - <span className="">₹</span>
                          {totalDiscount}
                        </span>
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  {totalExtraDiscount &&
                  process.env.REACT_APP_COUPON_APPLY == "true" ? (
                    <>
                      <div className="d-flex flex-row justify-content-between align-items-center mt-2 border-top pt-2">
                        <span>Total Price</span>
                        <span className="ms-2">
                          <span>
                            <span className="">₹</span>
                            {totalMRP - totalDiscount}
                          </span>
                        </span>
                      </div>
                      <div className="d-flex flex-row justify-content-between align-items-center mt-2 ">
                        <span>Coupon Applied (Buy 2 Get 1 free)</span>
                        <span className="ms-2 text-success">
                          <span>
                            -<span className="">₹</span>
                            {totalExtraDiscount}
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <div className="d-flex flex-row justify-content-between align-items-center mt-2 fw-bold border-top pt-3">
                    <span>Total Amount</span>
                    <span className="ms-2">
                      <span>
                        <span className="">₹</span>
                        {totalPrice}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white px-4 py-4 mt-3">
              <h6 className="card-title text-start fw-bold border-bottom pb-2 mb-3">
                PAYMENT METHOD
              </h6>
              <div className="d-flex align-items-center">
                <img
                  src="https://razorpay.com/favicon.png"
                  alt="Razorpay"
                  style={{ width: 30, height: 30, marginRight: 12 }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Razorpay Secure Payment</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    UPI, Cards, Net Banking, Wallets
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    color: "#02b290",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  SECURED ✓
                </div>
              </div>
            </div>

            {(userData.fullname || userData.mobile) && (
              <div className="bg-white px-4 py-4 mt-3">
                <h6 className="card-title text-start fw-bold border-bottom pb-2 mb-3">
                  DELIVERY ADDRESS
                </h6>
                <div style={{ fontSize: 14 }}>
                  <div style={{ fontWeight: 600 }}>{userData.fullname}</div>
                  {userData.mobile && <div>Phone: {userData.mobile}</div>}
                  {userData.email && <div>Email: {userData.email}</div>}
                  {userData.address1 && <div>{userData.address1}</div>}
                  {userData.address2 && <div>{userData.address2}</div>}
                  <div>
                    {userData.city}
                    {userData.state ? `, ${userData.state}` : ""}
                    {userData.pincode ? ` - ${userData.pincode}` : ""}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="position-sticky bottom-0 pb-3 bg-white px-4 mt-3 py-4 d-flex align-content-center justify-content-between"
          id="payment_bottom_block"
          style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.08)" }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: "16px",
              fontWeight: 700,
              color: "#282c3f",
              textAlign: "start",
            }}
          >
            <h6
              className="mb-0"
              style={{ fontWeight: "bold", fontSize: "22px" }}
            >
              ₹{totalPrice}
            </h6>
            <a
              href="#product_details"
              style={{
                fontSize: "12px",
                textDecoration: "none",
                color: "#ff3f6c",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              VIEW DETAILS
            </a>
          </div>
          <Button
            className="d-flex justify-content-center align-items-center"
            variant="dark"
            disabled={loading || !scriptLoaded}
            style={{
              width: "60%",
              padding: "10px",
              background: "var(--them-color)",
              borderColor: "var(--them-color)",
              opacity: loading || !scriptLoaded ? 0.7 : 1,
            }}
            onClick={() => payNow()}
          >
            {loading ? (
              <>
                <Spinner size="sm" style={{ marginRight: 8 }} />
                PROCESSING...
              </>
            ) : !scriptLoaded ? (
              "LOADING..."
            ) : (
              "PAY NOW"
            )}
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Payment;
