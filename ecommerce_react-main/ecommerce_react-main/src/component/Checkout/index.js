import { useEffect, useRef, useState } from "react";
import "./index.css";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const defaultLensSettingValue = {
  fullname: "",
  mobile: "",
  email: "",
  pincode: "",
  address1: "",
  address2: "",
  town: "",
  city: "",
  state: "Andhra Pradesh",
  saveAs: "",
};

const Checkout = () => {
  const [routeChange, setRouteChange] = useState(false);

  const {
    selectedProduct,
    setStep,
    address,
    setAddress,
    hideAddress,
    setHideAddress,
  } = useAuth();

  const navigate = useNavigate();
  const formikRef = useRef(null);

  const handleAddress = (values) => {
    setAddress(values);
    setHideAddress(true);
    setStep(3);
    setRouteChange(true);

    navigate("/cart", {
      state: {
        routeChange: true,
        address: values,
      },
    });

    console.log("full name>>>>>>>>>>>>", values.fullname);
  };

  const [initialValues, setInitialValues] = useState({
    ...defaultLensSettingValue,
    ...address,
  });

  useEffect(() => {
    setInitialValues({
      ...defaultLensSettingValue,
      ...address,
    });
  }, [address]);

  useEffect(() => {
    if (hideAddress) {
      window.scrollTo(0, 0);
    }
  }, [hideAddress]);

  const phoneRegExp =
    /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .matches(
        /^(?![0-9]*$)[A-Za-z\s]+$/,
        "Full Name must only contain letters and cannot be numbers"
      )
      .required("Full Name is required"),

    mobile: Yup.string()
      .matches(phoneRegExp, "Mobile No is not valid")
      .required("Mobile No is required")
      .min(10, "Mobile No must be at least 10 digits"),

    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        "Invalid email format"
      )
      .required("Email is required"),

    pincode: Yup.string()
      .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
      .required("Pincode is required"),

    address1: Yup.string().required("Address is required"),

    city: Yup.string().required("City is required"),
  });

  const state = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
  ];

  return (
    <Container
      className="p-0 pt-3 pb-3 position-relative d-flex flex-column justify-content-between"
      style={{ background: "#f2f2f3" }}
    >
      {!hideAddress ? (
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleAddress}
          innerRef={formikRef}
        >
          {({ getFieldProps }) => {
            return (
              <Form>
                <Row className="g-2 ms-0 me-0">
                  <h6
                    className="card-title px-4 text-start fw-bold mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    CONTACT DETAILS
                  </h6>

                  <div className="bg-white px-4 py-3">
                    <Col md className="mb-2">
                      <TextField
                        id="fullname"
                        fullWidth
                        type="text"
                        label="Full Name"
                        name="fullname"
                        placeholder="Please Enter FullName"
                        variant="outlined"
                        {...getFieldProps("fullname")}
                      />

                      <ErrorMessage
                        component="span"
                        name="fullname"
                        className="text-danger"
                      />
                    </Col>

                    <Col md className="mb-2">
                      <TextField
                        id="mobile"
                        fullWidth
                        type="number"
                        label="Mobile"
                        name="mobile"
                        placeholder="Please Enter Mobile Number!"
                        variant="outlined"
                        inputProps={{
                          onInput: (e) => {
                            e.target.value = e.target.value.slice(0, 10);
                          },
                        }}
                        {...getFieldProps("mobile")}
                      />

                      <ErrorMessage
                        component="span"
                        name="mobile"
                        className="text-danger"
                      />
                    </Col>

                    <Col md className="mb-2">
                      <TextField
                        id="email"
                        fullWidth
                        type="email"
                        label="Email"
                        name="email"
                        placeholder="Please Enter Email"
                        variant="outlined"
                        {...getFieldProps("email")}
                      />

                      <ErrorMessage
                        component="span"
                        name="email"
                        className="text-danger"
                      />
                    </Col>
                  </div>

                  <h6
                    className="card-title px-4 text-start fw-bold mb-2 mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    ADDRESS
                  </h6>

                  <div className="bg-white px-4 py-3">
                    <Col md className="mb-2">
                      <TextField
                        id="pincode"
                        fullWidth
                        type="number"
                        label="Pincode"
                        name="pincode"
                        placeholder="Please Enter Pincode"
                        variant="outlined"
                        inputProps={{
                          onInput: (e) => {
                            e.target.value = e.target.value.slice(0, 6);
                          },
                        }}
                        {...getFieldProps("pincode")}
                      />

                      <ErrorMessage
                        component="span"
                        name="pincode"
                        className="text-danger"
                      />
                    </Col>

                    <Col md className="mb-2">
                      <TextField
                        id="address1"
                        fullWidth
                        type="text"
                        label="Address (House No, Building, Street, Area)"
                        name="address1"
                        placeholder="Please Enter Address"
                        variant="outlined"
                        {...getFieldProps("address1")}
                      />

                      <ErrorMessage
                        component="span"
                        name="address1"
                        className="text-danger"
                      />
                    </Col>

                    <Col md className="mb-2">
                      <TextField
                        id="address2"
                        fullWidth
                        type="text"
                        label="Address (Locality, Town, City)"
                        name="address2"
                        placeholder="Please Enter Address"
                        variant="outlined"
                        {...getFieldProps("address2")}
                      />

                      <ErrorMessage
                        component="span"
                        name="address2"
                        className="text-danger"
                      />
                    </Col>

                    <Col md className="mb-2">
                      <TextField
                        id="town"
                        fullWidth
                        type="text"
                        label="Town/City"
                        name="town"
                        placeholder="Please Enter Town/City"
                        variant="outlined"
                        {...getFieldProps("town")}
                      />

                      <ErrorMessage
                        component="span"
                        name="town"
                        className="text-danger"
                      />
                    </Col>

                    <div className="d-flex gap-2 mt-3">
                      <Col md={6} xs={6}>
                        <TextField
                          id="city"
                          fullWidth
                          type="text"
                          label="District/City"
                          name="city"
                          placeholder="Please Enter City"
                          variant="outlined"
                          {...getFieldProps("city")}
                        />

                        <ErrorMessage
                          component="span"
                          name="city"
                          className="text-danger"
                        />
                      </Col>

                      <Col md={6} xs={6}>
                        <TextField
                          id="outlined-select"
                          select
                          label="State"
                          name="state"
                          fullWidth
                          {...getFieldProps("state")}
                        >
                          {state.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>

                        <ErrorMessage
                          component="span"
                          name="state"
                          className="text-danger"
                        />
                      </Col>
                    </div>
                  </div>
                </Row>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <div>
          <div className="addressBlocks-base-finalAddress">
            <div>
              <div className="addressDetails-base-addressTitle">
                <div className="addressDetails-base-name">
                  {address?.fullname}
                </div>
              </div>

              <div className="addressDetails-base-address">
                <div>
                  <div className="addressDetails-base-addressLine1">
                    {address?.fullname}
                  </div>

                  <div className="addressDetails-base-addressLine2">
                    {address?.address1} {address?.address2}
                    {address?.town ? `, ${address.town}` : ""}
                    {address?.city ? `, ${address.city}` : ""}
                    {address?.state ? `, ${address.state}` : ""}
                    {address?.pincode ? ` - ${address.pincode}` : ""}
                  </div>

                  <div className="addressDetails-base-addressLine3">
                    {address?.state} | Mobile: {address?.mobile} | Email:{" "}
                    {address?.email}
                  </div>
                </div>
              </div>

              <div className="addressActions-base-addressActions">
                <div className="addressActions-base-actionsWrapper">
                  <span className="addressActions-base-homeIcon"></span>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--them-color)",
                      fontWeight: "600",
                    }}
                  >
                    HOME
                  </span>
                </div>

                <Button
                  variant="dark"
                  style={{
                    background: "transparent",
                    color: "var(--them-color)",
                    border: "none",
                    fontSize: "13px",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                  onClick={() => {
                    setStep(2);
                    setHideAddress(false);
                  }}
                >
                  Change Address
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 px-4">
            <h6
              className="card-title text-start fw-bold mb-2"
              style={{ fontSize: "12px" }}
            >
              PAYMENT MODE
            </h6>

            <div className="bg-white p-3">
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "var(--them-color)" }}>
                  PAYMENT GATEWAY
                </span>

                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "#02b290",
                  }}
                >
                  Razorpay Secure✓
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                <span>Cash on Delivery</span>

                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "#888",
                  }}
                >
                  {process.env.REACT_APP_COD === "yes"
                    ? "Available"
                    : "Coming Soon"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 px-4">
            <h6
              className="card-title text-start fw-bold mb-2"
              style={{ fontSize: "12px" }}
            >
              ORDER SUMMARY
            </h6>

            <div className="bg-white p-3">
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "13px",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>Items({selectedProduct?.length || 0})</span>

                <span
                  style={{
                    marginLeft: "auto",
                    fontWeight: 700,
                  }}
                >
                  Qty
                </span>

                <span
                  style={{
                    fontWeight: 700,
                    minWidth: 70,
                    textAlign: "right",
                  }}
                >
                  Total
                </span>
              </div>

              {(selectedProduct || []).map((item, index) => {
                const image =
                  item?.images?.[0]?.src ||
                  item?.images?.[0] ||
                  item?.image ||
                  "";

                const title =
                  item?.title ||
                  item?.description ||
                  "Product";

                const quantity = item?.quantity || 1;

                const price =
                  item?.discount ||
                  item?.price ||
                  0;

                return (
                  <div
                    key={item?.id || index}
                    style={{
                      display: "flex",
                      gap: "8px",
                      fontSize: "13px",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #f2f2f3",
                    }}
                  >
                    <img
                      src={image}
                      alt=""
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />

                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 12,
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {title}
                    </div>

                    <span
                      style={{
                        color: "#666",
                        minWidth: 30,
                        textAlign: "center",
                      }}
                    >
                      ×{quantity}
                    </span>

                    <span
                      style={{
                        fontWeight: 700,
                        minWidth: 70,
                        textAlign: "right",
                      }}
                    >
                      ₹{(price * quantity).toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div
        className="position-sticky bottom-0 mt-3 bg-white px-4 py-3 d-flex align-content-center justify-content-between"
        style={{
          boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "14px",
            fontWeight: 700,
            color: "#282c3f",
            textAlign: "start",
          }}
        >
          <h6
            className="mb-0"
            style={{
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Proceed to Pay
          </h6>

          <span
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: 500,
            }}
          >
            {!hideAddress
              ? "Delivery Address Required"
              : "Pay Now via Razorpay"}
          </span>
        </div>

        {!hideAddress ? (
          <Button
            variant="dark"
            style={{
              width: "60%",
              padding: "10px",
              background: "var(--them-color)",
              borderColor: "var(--them-color)",
            }}
            onClick={() => formikRef?.current?.handleSubmit()}
          >
            DELIVER HERE
          </Button>
        ) : (
          <Button
            variant="dark"
            style={{
              width: "60%",
              padding: "10px",
              background: "var(--them-color)",
              borderColor: "var(--them-color)",
            }}
            onClick={() =>
              navigate("/checkout/payment", {
                state: {
                  initialValues: address,
                },
              })
            }
          >
            PAY NOW
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Checkout;