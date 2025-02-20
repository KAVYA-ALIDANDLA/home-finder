# House Rental Web Application

A comprehensive MERN stack application designed for users to browse, list, and rent properties. The application includes user authentication, property listing, search functionality, and a responsive design optimized for both mobile and desktop views.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Demo
Access the live version of the application here: [https://your-demo-url.com](-------)

## Features
- **User Authentication**: Register and login functionality with JWT-based authentication.
- **Property Listings**: List, view, and delete property listings.
- **Search and Filter**: Search properties based on location, type, and price range.
- **Responsive Design**: Fully responsive UI with Material UI and Bootstrap, ensuring usability on mobile and desktop.
- **User Dashboard**: View and manage user profile, listed properties, and rented properties.

## Tech Stack
- **Frontend**: React, Axios, Ant Design, Material UI, Bootstrap, mdb-react-ui-kit, Moment.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

---

## Getting Started
To get a local copy of the project up and running, follow these steps.

### Prerequisites
- **Node.js**: Install from [Node.js downloads](https://nodejs.org/en/download/)
- **MongoDB**: Local MongoDB setup or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Environment Variables
Create a `.env` file in the root directory of the `backend` folder and add the following variables:



house-rental-web-app/
├── backend/
│   ├── config/          # Environment and database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Middleware functions
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── index.js         # Entry point
│   └── .env             # Environment variables
├── frontend/
│   ├── public/          # Public assets
│   ├── src/
│       ├── components/  # React components
│       ├── pages/       # Page components (Home, Login, Register, etc.)
│       ├── services/    # API calls and services
│       └── App.js       # Main application component
└── README.md            # Project documentation
