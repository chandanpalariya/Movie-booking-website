🎬 Movie Booking Website

A full-stack MERN stack movie booking application where users can browse movies, view showtimes, select seats, and book tickets online. The project includes secure authentication, an admin dashboard for managing movies and bookings, and a responsive user interface.

🚀 Features
👤 User Features

User registration and login with authentication

Browse available movies

View movie details and show timings

Seat selection system

Book movie tickets

Online payment verification

View booking history

🛠 Admin Features

Admin login panel

Add new movies

Upload movie posters

Manage movie listings

View and manage bookings

Dashboard for movie and booking control

🧰 Tech Stack
Frontend

React.js

React Router


Tailwind CSS / Bootstrap

Axios

Backend

Node.js

Express.js

REST APIs

JWT Authentication

Database

MongoDB

MongoDB Atlas (Cloud Database)

Tools

Git & GitHub

Postman

Render / Deployment Platform

📂 Project Structure
Movie-Booking
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├
│   │   └── App.jsx
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
└── README.md
⚙️ Installation
1️⃣ Clone the repository
git clone https://github.com/yourusername/movie-booking.git
2️⃣ Install backend dependencies
cd backend
npm install
3️⃣ Install frontend dependencies
cd frontend
npm install
▶️ Run the Project
Start Backend
npm run dev
Start Frontend
npm start

The application will run on:

Frontend → http://localhost:3000
Backend → http://localhost:5000
🔐 Environment Variables

Create a .env file in the backend folder.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
📸 Screenshots

You can add screenshots here of:

Home Page

Movie Listing

Seat Selection

Booking Page

Admin Dashboard

Example:

![Home Page](screenshots/home.png)
🌐 Deployment

The project can be deployed using:

Frontend: Render / Netlify / Vercel

Backend: Render / Railway

Database: MongoDB Atlas

📌 Future Improvements

Real payment gateway integration

Email confirmation for bookings

Movie reviews and ratings

Seat availability in real-time

Mobile responsive improvements

👨‍💻 Author

Chandan Palariya

