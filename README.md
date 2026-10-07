# NX YATRA — MERN Stack Application

A clean, modern **MERN (MongoDB, Express, React, Node.js)** web application for **NX Yatra**—a digital growth platform for travel agencies, tour operators, and yatra/pilgrimage providers across India.

---

## 📁 Project Structure

```
nx-yatra/
├── frontend/             # Pure React.js (Vite + Tailwind CSS + Lucide Icons + Radix UI)
│   ├── public/           # Static assets (images, favicon, robots.txt)
│   ├── src/
│   │   ├── components/   # UI components & Error boundary
│   │   ├── pages/        # Router pages (NotFound, etc.)
│   │   ├── App.tsx       # Main React landing page & enquiry form
│   │   └── index.css     # Design system & Tailwind styles
│   ├── vite.config.ts    # Vite configuration with backend API proxy
│   └── package.json
│
├── backend/              # Node.js + Express + MongoDB (Mongoose) API
│   ├── src/
│   │   ├── config/       # MongoDB connection setup
│   │   ├── controllers/  # Inquiry controller (Zod validation + Mongoose queries)
│   │   ├── models/       # Inquiry Mongoose Schema
│   │   ├── routes/       # Express API routes (/api/nx-yatra/inquiries)
│   │   └── index.ts      # Express App server entry point
│   └── package.json
│
├── package.json          # Root workspace scripts to run frontend & backend concurrently
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
Run the install command from the root folder to install root, frontend, and backend packages:
```bash
npm run install:all
```
*Or install individually:*
```bash
# In frontend directory
cd frontend && npm install

# In backend directory
cd backend && npm install
```

### 2. Environment Setup
- **Backend Environment (`backend/.env`)**:
  ```env
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/nx_yatra
  ```
- **Frontend Environment (`frontend/.env`)**:
  ```env
  VITE_API_URL=http://localhost:5000
  ```

### 3. Run Development Servers
To start both the frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/health`

---

## 🛠️ API Endpoints

- `POST /api/nx-yatra/inquiries`: Submit business enquiry form
- `GET /api/nx-yatra/inquiries`: Fetch list of submitted enquiries
- `GET /api/health`: Health check endpoint
