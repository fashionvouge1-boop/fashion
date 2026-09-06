const PRODUCTION_API_URL = "https://fashion-vouge-ecommerce.onrender.com";

const envApiUrl = process.env.REACT_APP_API_URL || "";
const isLocalOrMissing =
  !envApiUrl ||
  envApiUrl.includes("localhost") ||
  envApiUrl.includes("127.0.0.1");
const isWrongRenderHost = envApiUrl.includes("fashion-vouge-api.onrender.com");

// Prefer explicit REACT_APP_API_URL when provided and not the known wrong host.
// Otherwise use same-origin at runtime (so frontend and backend on the same Render host work),
// fall back to the historical PRODUCTION_API_URL if neither is available.
export const API_URL = envApiUrl && !isWrongRenderHost
  ? envApiUrl.replace(/\/$/, "")
  : isLocalOrMissing && typeof window !== "undefined" && window.location &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : (typeof window !== "undefined" && window.location && window.location.origin)
    ? window.location.origin
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
