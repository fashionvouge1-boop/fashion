# Fashion Vogue E-commerce

Full-stack e-commerce app with React frontend and Node.js/Express backend.

## Project structure

| Folder | Description |
|--------|-------------|
| `ecommerce_react-main/ecommerce_react-main/` | React frontend (port 3000) |
| `node_ecommerce-main/node_ecommerce-main/` | Node.js backend API (port 5000) |

## Local setup

### Backend
```powershell
cd node_ecommerce-main/node_ecommerce-main
copy .env.example .env
# Edit .env with your MongoDB and Razorpay credentials
npm install
npm start
```

### Frontend
```powershell
cd ecommerce_react-main/ecommerce_react-main
copy .env.example .env
# Set REACT_APP_API_URL to your backend URL
npm install
npm start
```

Open http://localhost:3000

## Deploy on Render

Create **two** Web Services on [Render](https://render.com):

### 1. Backend
- **Root Directory:** `node_ecommerce-main/node_ecommerce-main`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment variables:** copy from `.env.example` and set real values in Render dashboard

### 2. Frontend
- **Root Directory:** `ecommerce_react-main/ecommerce_react-main`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npx serve -s build`
- **Environment variables:** set `REACT_APP_API_URL` to your Render backend URL (e.g. `https://your-api.onrender.com`)

> Do not commit `.env` files. Add secrets only in Render environment settings.
