const PRODUCTION_API_URL = "https://fashion-vouge-ecommerce.onrender.com";

const envApiUrl = process.env.REACT_APP_API_URL || "";
const isLocalOrMissing =
  !envApiUrl ||
  envApiUrl.includes("localhost") ||
  envApiUrl.includes("127.0.0.1");
const isWrongRenderHost = envApiUrl.includes("fashion-vouge-api.onrender.com");

export const API_URL = isLocalOrMissing || isWrongRenderHost
  ? PRODUCTION_API_URL
  : envApiUrl.replace(/\/$/, "");

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
