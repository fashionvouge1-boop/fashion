import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Helmet } from "react-helmet";

const ThankYou = () => {
  const navigate = useNavigate();
  const { handleSetCartProducts, totalPrice } = useAuth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const txnId = queryParams.get("txnId");
  useEffect(() => {
    handleSetCartProducts([]);
  }, []);

  const totalAmount = localStorage.getItem("totalPrice");
  return (
       <div>
   
      {process.env.REACT_APP_FBPIXEL && txnId !==null && (
          <Helmet>
            <script>
              {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${process.env.REACT_APP_FBPIXEL}');
fbq('track', 'Purchase', {
    value: '${totalAmount}',
    currency: 'INR',
    contents: [
        {
            id: '${txnId}',
        }
    ],
    content_type: 'product'
});
fbq('track', 'PageView');
`}
            </script>
          </Helmet>
        )}

      {process.env.REACT_APP_AW && (
        <Helmet>
          <script>
            {`
            gtag('event', 'conversion', {
      'send_to': '${process.env.REACT_APP_AW}/${
              process.env.REACT_APP_PURCHASETAGGOOGLE || ""
            }',
      'value': ${totalPrice},
      'currency': 'INR',
      'transaction_id': '${txnId}'
  });
          `}
          </script>
        </Helmet>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px 20px",
        }}
      >
        <h4>YOUR ORDER HAS BEEN RECEIVED</h4>
        <h5>Confirmation of Order Receipt and Payment Processing</h5>
        <p style={{ color: "red" }}>
          Please note that if your payment is unsuccessful, your order will be
          automatically canceled. Kindly ensure that you do not close any UPI
          app until the payment process is completed.
        </p>
        <h6>
          Upon successful processing, you will receive an order confirmation
          email containing detailed information about your order and a link to
          track its progress.
        </h6>
        <h6>
          {`Thank you for choosing ${
            window.location.hostname || ""
          }. If you have any questions or concerns, feel free to reach out to us.`}
        </h6>
        <p>
          <strong>Your transaction id is:</strong>
          &nbsp;{txnId}
        </p>
        <strong>Your Amount is:</strong>
        &nbsp;{totalAmount}
      </div>
      <Button
        variant="dark"
        className="btn my-3 primary d-flex m-auto justify-content-center align-items-center ripple animated"
        style={{
          padding: "10px 20px",
          background: "var(--them-color)",
          borderColor: "var(--them-color)",
        }}
        onClick={(e) => {
          e?.target?.classList?.add("bounceIn");
          navigate(`/`);
          setTimeout(() => {
            if (e?.target?.classList?.contains("bounceIn"))
              e?.target?.classList?.remove("bounceIn");
          }, 1000);
        }}
      >
        Go to Home
      </Button>
    </div>
  );
};
export default ThankYou;
