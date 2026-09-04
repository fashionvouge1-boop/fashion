import { useEffect, useState } from "react";
import "./index.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { PHONEPE_NODE_URL, THEAM_COLOR } from "../../config";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const existingScript =
            document.getElementById("razorpay-script");

        if (existingScript) {
            existingScript.addEventListener("load", () => {
                resolve(true);
            });

            existingScript.addEventListener("error", () => {
                resolve(false);
            });

            return;
        }

        const script = document.createElement("script");

        script.id = "razorpay-script";
        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            resolve(true);
        };

        script.onerror = () => {
            resolve(false);
        };

        document.body.appendChild(script);
    });
};

const MultiPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const API_URL = PHONEPE_NODE_URL;

    useEffect(() => {
        const initializePayment = async () => {
            try {
                const razorpayLoaded =
                    await loadRazorpayScript();

                if (!razorpayLoaded) {
                    console.error(
                        "Razorpay SDK failed to load"
                    );

                    alert(
                        "Unable to load Razorpay. Please try again."
                    );

                    setLoading(false);
                    navigate("/Failure");

                    return;
                }

                await payNow();
            } catch (error) {
                console.error(
                    "Payment initialization error:",
                    error
                );

                setLoading(false);
                navigate("/Failure");
            }
        };

        initializePayment();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const displayRazorpay = async (orderData) => {
        try {
            const {
                orderId,
                amount,
                currency,
                keyId,
                name,
                email,
                mobile,
            } = orderData;

            if (!window.Razorpay) {
                throw new Error(
                    "Razorpay SDK is not loaded"
                );
            }

            if (!orderId) {
                throw new Error(
                    "Razorpay Order ID is missing"
                );
            }

            if (!keyId) {
                throw new Error(
                    "Razorpay Key ID is missing"
                );
            }

            const options = {
                key: keyId,

                amount: Number(amount),

                currency: currency || "INR",

                name: "Sera Store",

                description: "Order Payment",

                order_id: orderId,

                prefill: {
                    name: name || "Customer",

                    email:
                        email ||
                        "customer@example.com",

                    contact: mobile || "",
                },

                theme: {
                    color:
                        THEAM_COLOR ||
                        "#FB641B",
                },

                handler: async (response) => {
                    try {
                        setLoading(true);

                        console.log(
                            "Razorpay Response:",
                            response
                        );

                        const verifyRes =
                            await axios.post(
                                `${API_URL}products/razorpay/verify`,
                                {
                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_signature:
                                        response.razorpay_signature,
                                }
                            );

                        console.log(
                            "Verification Response:",
                            verifyRes.data
                        );

                        if (
                            verifyRes.data &&
                            verifyRes.data.success
                        ) {
                            localStorage.setItem(
                                "razorpayPaymentDetails",
                                JSON.stringify(response)
                            );

                            navigate("/Success", {
                                state: {
                                    ...response,
                                },
                            });
                        } else {
                            console.error(
                                "Payment verification failed:",
                                verifyRes.data
                            );

                            alert(
                                "Payment verification failed."
                            );

                            navigate("/Failure");
                        }
                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error?.response?.data ||
                                error?.message ||
                                error
                        );

                        navigate("/Failure");
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        console.log(
                            "Razorpay checkout closed"
                        );

                        setLoading(false);
                    },
                },
            };

            const paymentObject =
                new window.Razorpay(options);

            paymentObject.on(
                "payment.failed",
                (response) => {
                    console.error(
                        "Payment failed:",
                        response?.error || response
                    );

                    setLoading(false);

                    navigate("/Failure");
                }
            );

            paymentObject.open();
        } catch (error) {
            console.error(
                "Error opening Razorpay:",
                error
            );

            setLoading(false);

            navigate("/Failure");
        }
    };

    const payNow = async () => {
        const amount = searchParams.get("amount");

        const mobile =
            searchParams.get("mobileno") || "";

        const name =
            searchParams.get("name") || "";

        const email =
            searchParams.get("email") || "";

        if (!amount || Number(amount) <= 0) {
            console.error(
                "Invalid payment amount:",
                amount
            );

            alert("Invalid payment amount.");

            setLoading(false);

            navigate("/Failure");

            return;
        }

        if (!API_URL) {
            console.error(
                "REACT_APP_PHONEPE_NODE_URL is missing"
            );

            alert(
                "Payment server configuration is missing."
            );

            setLoading(false);

            navigate("/Failure");

            return;
        }

        try {
            setLoading(true);

            const orderRes = await axios.post(
                `${API_URL}products/razorpay/order`,
                {
                    amount: Number(amount),

                    name: name,

                    email: email,

                    mobile: mobile,
                }
            );

            console.log(
                "Order Response:",
                orderRes.data
            );

            if (
                orderRes.data &&
                orderRes.data.success &&
                orderRes.data.data
            ) {
                const orderInfo =
                    orderRes.data.data;

                await displayRazorpay({
                    orderId:
                        orderInfo.orderId,

                    amount:
                        orderInfo.amount,

                    currency:
                        orderInfo.currency ||
                        "INR",

                    keyId:
                        orderInfo.keyId,

                    name: name,

                    email: email,

                    mobile: mobile,
                });
            } else {
                console.error(
                    "Order creation failed:",
                    orderRes.data
                );

                alert(
                    "Failed to create payment order."
                );

                setLoading(false);

                navigate("/Failure");
            }
        } catch (error) {
            console.error(
                "Razorpay order error:",
                error?.response?.data ||
                    error?.message ||
                    error
            );

            alert(
                "Unable to create payment order. Please try again."
            );

            setLoading(false);

            navigate("/Failure");
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <Spinner animation="border" />

            <div className="mt-2">
                {loading
                    ? "Processing Payment..."
                    : "Initiating Payment..."}
            </div>
        </div>
    );
};

export default MultiPayment;