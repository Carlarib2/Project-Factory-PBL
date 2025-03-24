# FTP Application

A web based controlling dashboard for ESP32 remote controlled car.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Carlarib2/Project-Factory-PBL.git
cd ftp-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Development

To start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

## Server Setup

1. Navigate to the server directory:
```bash
cd ftp-backend
```

2. Install server dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the server directory:
```
PORT=5000
```

4. Start the server:
```bash
# Development mode
nodemon server

# Production mode
node server
```

The server will be running at `http://localhost:5000`
