import React, { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state || {};
  const {
    totalPrice,
    selectedProduct,
    address,
    handleSetCartProducts,
    setSelectedProduct,
  } = useAuth();

  useEffect(() => {
    const saveOrder = () => {
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const newOrder = {
        orderId:
          paymentDetails.razorpay_order_id ||
          `ORD-${Date.now()}`,
        paymentId: paymentDetails.razorpay_payment_id || "",
        signature: paymentDetails.razorpay_signature || "",
        amount: totalPrice || localStorage.getItem("totalPrice") || 0,
        products: selectedProduct || JSON.parse(localStorage.getItem("slectedData") || "[]"),
        address: address || JSON.parse(localStorage.getItem("address") || "{}"),
        date: new Date().toISOString(),
        status: "SUCCESS",
      };
      existingOrders.unshift(newOrder);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.setItem("lastOrder", JSON.stringify(newOrder));
    };
    saveOrder();
  }, []);

  const handleClearCart = () => {
    handleSetCartProducts([]);
    setSelectedProduct([]);
    localStorage.removeItem("cartProducts");
    localStorage.removeItem("slectedData");
    navigate("/");
  };

  const handleTrackOrder = () => {
    navigate("/order-comfirmation");
  };

  const lastOrder = JSON.parse(localStorage.getItem("lastOrder") || "{}");

  return (
    <Container
      className="d-flex justify-content-center"
      style={{ padding: "20px 16px 40px" }}
    >
      <Card
        className="text-center shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Card.Header
          className="border-0 py-4"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 16px auto",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <Card.Title as="h3" className="mb-0 text-white fw-bold">
            Payment Successful!
          </Card.Title>
          <div className="text-white-50 mt-2">
            Thank you for your order
          </div>
        </Card.Header>
        <Card.Body className="px-4 py-4 text-start">
          {lastOrder?.orderId && (
            <div
              className="mb-3 p-3 rounded"
              style={{ background: "#f8fafc" }}
            >
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Order ID</span>
                <span className="fw-bold small">{lastOrder.orderId}</span>
              </div>
              {lastOrder?.paymentId && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Payment ID</span>
                  <span className="fw-bold small text-break" style={{maxWidth: "60%"}}>
                    {lastOrder.paymentId}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Amount Paid</span>
                <span className="fw-bold text-success">
                  ₹{lastOrder.amount || totalPrice || 0}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Date</span>
                <span className="small">
                  {lastOrder.date
                    ? new Date(lastOrder.date).toLocaleString()
                    : ""}
                </span>
              </div>
            </div>
          )}

          {(selectedProduct?.length > 0 || lastOrder?.products?.length > 0) && (
            <div className="mb-3">
              <div className="fw-bold mb-2">
                Items Ordered (
                {(selectedProduct?.length || lastOrder?.products?.length)}):
              </div>
              {(selectedProduct?.length > 0 ? selectedProduct : (lastOrder.products || [])).map(
                (item, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center py-2 border-bottom"
                  >
                    <img
                      src={item?.images?.[0]?.src || item?.image}
                      alt=""
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 8,
                        marginRight: 12,
                      }}
                    />
                    <div className="flex-grow-1 text-start">
                      <div className="small fw-semibold line-clamp-2">
                        {item?.title || item?.description}
                      </div>
                      <div className="small text-muted">
                        Qty: {item?.quantity || 1} × ₹{item?.discount || item?.price || 0}
                      </div>
                    </div>
                    <div className="fw-bold small">
                      ₹{((item?.discount || item?.price || 0) * (item?.quantity || 1))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div
            className="d-flex gap-2 mt-4"
            style={{ flexWrap: "wrap" }}
          >
            <Button
              variant="dark"
              style={{
                background: "var(--them-color)",
                borderColor: "var(--them-color)",
                flex: 1,
                minWidth: 140,
              }}
              onClick={handleTrackOrder}
            >
              Track Order
            </Button>
            <Button
              variant="outline-secondary"
              style={{
                flex: 1,
                minWidth: 140,
              }}
              onClick={handleClearCart}
            >
              Continue Shopping
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Success;
