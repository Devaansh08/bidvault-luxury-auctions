# 🌿 BidVault — Premier Real-Time Luxury Auction & Escrow Platform

<div align="center">
  <p><strong>A state-of-the-art, full-stack MERN auction marketplace featuring real-time WebSocket bidding, executive analytics, automated escrow management, and luxury sage/pine aesthetics.</strong></p>

  ![MERN Stack](https://img.shields.io/badge/Stack-MERN-2B5748?style=for-the-badge)
  ![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)
  ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
</div>

---

## ✨ Overview

**BidVault** redefines luxury online auctions. Built for high-end collectors, fine art curators, horology enthusiasts, and luxury automotive bidders, the platform combines **microsecond real-time bidding synchronization** with an executive dashboard and automated shipping & escrow management.

Whether connected to a live cloud **MongoDB Atlas** database or running locally offline with automatic fallback demo data, BidVault delivers a zero-friction, error-free user experience.

---

## 🎨 Luxury Natural Color Palette & Aesthetics

Designed with a curated **Sage & Pine Luxury Palette** across ultra-crisp Light Mode and immersive Dark Slate Mode:

| Shade Name | HEX Code | RGB Code | Usage |
| :--- | :--- | :--- | :--- |
| **Soft Pistachio Sage** | `#9CB080` | `rgb(156, 176, 128)` | Hover highlights, glowing orbs, subtle borders |
| **Forest Moss Green** | `#618764` | `rgb(97, 135, 100)` | Secondary buttons, badges, gradients |
| **Deep Authoritative Pine** | `#2B5748` | `rgb(43, 87, 72)` | Primary action buttons, executive headers |
| **Dark Slate Charcoal** | `#273338` | `rgb(39, 51, 56)` | Dark mode canvas, typography contrast |

### 🌀 Hypnotic Framer Motion Background
The layout incorporates an ambient, eye-catching background featuring bouncing glassmorphism luxury badges (`🔨 Horology`, `💎 Flawless Gems`, `⏳ Live Escrow`, `👑 VIP Collector`), animated floating particles, and pulsating sage/pine orbs powered by **Framer Motion spring physics**.

---

## 🚀 Key Features

### 🔨 1. Real-Time Live Bidding Engine (`Socket.io`)
* Instantaneous bid broadcasts without page reloads.
* Automatic outbid notifications and countdown timers.
* Live bid history ticker with bidder anonymity protection.

### 🏆 2. Winning Orders, Shipping Directory & Escrow
* Automatic lot assignment upon timer expiration.
* **Shipping Directory**: Track collector delivery addresses (`Connaught Place New Delhi`, `MG Road Bangalore`, `Paris France`, etc.) with courier tracking numbers (`BLUE-98214-IN`, `DHL-44109-IN`).
* **Escrow Management**: Real-time verification status (`Paid & Dispatched`, `Secured in Escrow Vault`).

### 📊 3. Executive Admin Analytics Suite
* **KPI Metrics Dashboard**: Real-time count of Active Users, Catalog Value, Live Bids, and Escrow Volume.
* **Interactive User Directory**: Filter collectors by VIP tier, edit roles (`admin` / `user`), and monitor activity logs.
* **Live Activity & Order Monitor**: Dedicated view for logins, live bids, auction creations, and winning dispatch events.

### 🔐 4. Smart Guest & Auth Interceptors
* **Guest-Only Routing**: Users already logged into the system are automatically presented with their **Active Collector Profile Card** if attempting to access `/auth/login` or `/auth/signup`, preventing duplicate auth confusion.
* **Hybrid Data Resilience**: Seamlessly operates with live MongoDB or falls back to rich in-memory collector models if offline.

---

## 📁 Repository Structure

```text
online-bid/
├── client/                     # Frontend React + Vite Application
│   ├── src/
│   │   ├── components/         # Reusable UI & Framer Motion Backgrounds
│   │   ├── layout/             # MainLayout, AdminLayout, AuthLayout
│   │   ├── pages/
│   │   │   ├── admin/          # Executive Dashboard, User Directory, Activity Monitor
│   │   │   ├── auction/        # Browse, Live Room, Create Lot, Winner Checkout
│   │   │   ├── auth/           # Login, Signup, Forgot Password
│   │   │   └── dashboard/      # Collector Profile Settings, My Bids, Login History
│   │   ├── router/             # ProtectedRoute, AdminRoute, GuestRoute
│   │   ├── services/           # Axios API integrations
│   │   └── store/              # Redux Toolkit State Management
│   └── tailwind.config.js      # Custom luxury sage/pine design system
├── server/                     # Backend Express + MongoDB + Socket.io Server
│   ├── controllers/            # Auth, Auction, User Management & Analytics Controllers
│   ├── models/                 # Mongoose Schemas (User, Auction, Bid, LoginHistory)
│   ├── routes/                 # RESTful API endpoints
│   ├── socket/                 # Real-time WebSocket event handlers
│   └── server.js               # Main entrypoint with auto-seeding
└── README.md                   # Project Documentation
```

---

## 🛠️ Installation & Setup Guide

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (Local instance or free MongoDB Atlas cluster)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Devaansh08/bidvault-luxury-auctions.git
cd bidvault-luxury-auctions
```

### Step 2: Configure Environment Variables
Create a `.env` file inside the `server/` directory (you can copy `.env.example`):
```bash
cd server
cp .env.example .env
```
Ensure your `MONGO_URL` and `JWT_SECRET` are set:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/auction
JWT_SECRET=your_super_secret_jwt_key_here_32_characters
```

### Step 3: Install Dependencies
Open two terminal windows (one for Backend, one for Frontend):

#### Backend Terminal:
```bash
cd server
npm install
npm run dev
```
*Server runs on `http://localhost:5000`*

#### Frontend Terminal:
```bash
cd client
npm install
npm run dev
```
*Client runs on `http://localhost:5173`*

---

## 🔑 Default Accounts for Testing

Upon first launch, BidVault automatically seeds default collector and executive admin accounts into your MongoDB database:

| Account Type | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Executive Admin** | `admin@bidvault.com` | `Admin@123` | Full Admin Dashboard, Moderation, User Directory |
| **VIP Collector** | `devanshdevil0@gmail.com` | `Devansh@123` | Place Bids, Create Auctions, Profile Settings |
| **VIP Collector** | `aarav.mehta@collectors.in` | `user123` | Place Bids, Escrow Checkout |

---

## 🛡️ License & Contributing

Distributed under the **MIT License**. Crafted with precision and modern web aesthetics.
