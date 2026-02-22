# Metro Booking Service

A modern metro ticket booking application built with React, TypeScript, and Spring Boot.

## Project Structure

```
Metro-Booking-Service/
├── frontend/           # React + TypeScript frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Features

- 🚇 Metro station selection and route finding
- 🎫 Automatic ticket generation with QR codes
- 📍 Breadth-First Search (BFS) for shortest path
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Frontend Setup

### Prerequisites
- Node.js (v18+)
- npm or bun

### Installation

```bash
cd frontend
npm install
# or
bun install
```

### Development

```bash
npm run dev
# or
bun run dev
```

The frontend will run on `http://localhost:8080`

### Build

```bash
npm run build
# or
bun run build
```

## Backend Setup

The backend is a separate Spring Boot application running on port 8090.

### Start Backend

```bash
cd /backend
bash mvnw spring-boot:run
```

Backend API runs on `http://localhost:8090`

## API Endpoints

### POST /bookings
Books a metro ticket

**Request:**
```json
{
  "source": "S1",
  "destination": "S3"
}
```

**Response:**
```json
{
  "routeTaken": ["S1", "S2", "S3"],
  "totalTimeMins": 10,
  "transfers": 0,
  "qrString": "METRO-S1-S3-..."
}
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

### Backend
- Spring Boot 3.4.3
- Java 21
- Maven

## Usage

1. Open `http://localhost:8080` in your browser
2. Select a source station (FROM)
3. Select a destination station (TO)
4. Click "Find Route & Generate Ticket"
5. View your route details and QR code ticket
6. Scan the QR code at the metro gate

## Project Status

✅ Frontend - Production Ready
✅ Backend - Running on port 8090
✅ Integrated and Tested

---

**Author:** Aditya2274
**Repository:** https://github.com/Aditya2274/Metro-Booking-Service
