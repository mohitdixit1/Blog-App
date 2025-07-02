# 📝 Blog App

A full-featured Blog Web Application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Users can register, sign in, create blogs with cover images, comment on blogs, and reset passwords securely via email. This project is designed for learning full-stack web development with authentication and file handling.

---

## 🚀 Features

- 👤 User signup & login
- 🔐 Cookie-based authentication using JWT
- 📝 Create, read, and view blogs with cover images
- 💬 Comment on blogs
- 📷 Profile image and blog cover upload using Multer
- 🔁 Password reset via email (using Nodemailer + secure token)
- 👮‍♂️ Route protection with middleware
- 🌐 MongoDB database integration with Mongoose
- 🖼️ EJS-based frontend with clean UI rendering
- 📁 Static file serving for uploaded images

---

## 🛠️ Tech Stack

| Layer         | Technology             |
|---------------|------------------------|
| Backend       | Node.js, Express.js    |
| Frontend View | EJS templating         |
| Database      | MongoDB + Mongoose     |
| Auth          | JWT (manual using crypto) |
| File Upload   | Multer                 |
| Email         | Nodemailer (Gmail)     |
| Styling       | CSS, static files      |

---

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/mohitdixit1/Blog-App.git
cd Blog-App

# Install dependencies
npm install

# Create a .env file in the root directory and add:
MONGODB_URI=your_mongo_connection_string
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
PORT=7000

# Run the app
node app.js
# or
nodemon app.js



##🌐 Available Routes

🧑 User Routes (/user)
GET /signup - Signup form

POST /signup - Register new user

GET /signin - Login form

POST /signin - Authenticate user

GET /logout - Logout user

GET /forgotpassword - Password reset form

POST /forgotpassword - Send reset link

GET /resetpassword/:token - Reset password form

POST /resetpassword - Update password

📝 Blog Routes (/blog)
GET /addblog - Add blog form

POST / - Submit new blog

GET /:id - View single blog with comments

POST /comment/:blogid - Add comment to blog

🖼️ Screenshots (Optional)
Add screenshots or GIFs here if you'd like to show off your UI

🔐 Authentication Flow
Passwords are hashed using SHA256 + salt before saving to DB

JWT tokens are signed manually (not using passport.js)
        
Token is stored in cookies and verified on every request

Password reset tokens are securely generated using crypto
🧑‍💻 Author
Mohit Dixit
📬 github - "https://github.com/mohitdixit1"
    Linked-in >"https://www.linkedin.com/in/mohit-dixit-"


🌍 Deployment
✅ Hosted on Render: https://blog-app-7sx0.onrender.com
