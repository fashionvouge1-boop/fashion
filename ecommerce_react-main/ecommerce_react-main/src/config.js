const PRODUCTION_API_URL = "https://fashion-vouge-ecommerce.onrender.com";

const envApiUrl = process.env.REACT_APP_API_URL || "";
const isLocalOrMissing =
  !envApiUrl ||
  envApiUrl.includes("localhost") ||
  envApiUrl.includes("127.0.0.1");
const isWrongRenderHost = envApiUrl.includes("fashion-vouge-api.onrender.com");
const isLocalHost = typeof window !== "undefined" && window.location &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// Use the local API during development and the separate backend in production.
export const API_URL = envApiUrl && !isWrongRenderHost
  ? envApiUrl.replace(/\/$/, "")
  : isLocalHost
    ? "http://localhost:5000"
    : PRODUCTION_API_URL;

export const PHONEPE_NODE_URL =
  process.env.REACT_APP_PHONEPE_NODE_URL &&
  !process.env.REACT_APP_PHONEPE_NODE_URL.includes("localhost") &&
  !process.env.REACT_APP_PHONEPE_NODE_URL.includes("fashion-vouge-api.onrender.com")
    ? process.env.REACT_APP_PHONEPE_NODE_URL
    : `${API_URL}/api/`;

export const THEAM_COLOR =
  process.env.REACT_APP_THEAM_COLOR ||
  process.env.REACT_APP_THEME_COLOR ||
  "#FB641B";
