import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/checkout/payment");
  };

  const handleGoHome = () => {
    navigate("/");
  };

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
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
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
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <Card.Title as="h3" className="mb-0 text-white fw-bold">
            Payment Failed
          </Card.Title>
          <div className="text-white-50 mt-2">
            Something went wrong while processing your payment
          </div>
        </Card.Header>
        <Card.Body className="px-4 py-4 text-start">
          <div className="mb-3 p-3 rounded" style={{ background: "#fef2f2" }}>
            <div className="d-flex align-items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 8 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="fw-bold" style={{ color: "#991b1b" }}>
                Possible Reasons:
              </span>
            </div>
            <ul className="mb-0 ps-4 small" style={{ color: "#7f1d1d" }}>
              <li>Insufficient funds</li>
              <li>Payment declined by bank</li>
              <li>Network connection issue</li>
              <li>Session expired / timed out</li>
            </ul>
          </div>

          <div className="small text-muted mb-4 text-center">
            No money was deducted from your account. Please try again.
          </div>

          <div
            className="d-flex gap-2"
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
              onClick={handleRetry}
            >
              Retry Payment
            </Button>
            <Button
              variant="outline-secondary"
              style={{
                flex: 1,
                minWidth: 140,
              }}
              onClick={handleGoHome}
            >
              Back to Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Failure;
