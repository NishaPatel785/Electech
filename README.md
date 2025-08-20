#  Electech E-Commerce Website  

An **E-commerce web application** built with **React (frontend)**, **Node.js/Express (backend)**, and **MySQL (database)** with a powerful **Admin Dashboard** to manage products, users, and orders.  

---

##  Features  

### User Side (Frontend)  
-  User authentication (Register/Login with JWT)  
-  Product listing with search, filters, and sorting  
-  Add to cart and wishlist  
-  Checkout with Razorpay payment integration  
-  Order history and order tracking  
-  Product reviews and ratings  

### 🛠 Admin Dashboard  
-  Add, update, and delete products  
-  Manage categories and subcategories  
-  Manage users and roles (Admin/User)  
-  View and manage orders  
-  Track delivery status  

### ⚡ Backend  
-  RESTful API using Node.js & Express  
-  Authentication & Authorization with JWT  
-  Role-based access control  
-  Database integration with MySQL 
-  Razorpay Payment Gateway integration  

---

##  Tech Stack  
- **Frontend:** React.js, Redux Toolkit, Bootstrap/ CSS / MUI  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL 
- **Payment:** Razorpay API  
- **Authentication:** JWT + bcrypt  

---

## Installation
git clone https://github.com/your-username/ecommerce-project.git
cd ecommerce-project

## Backend setup
- cd backend
- npm install
- npm run server
  
## Frontend setup
- cd frontend
- npm install
- npm run dev

## Admin Dashboard setup
- cd dashboard
- npm install
- npm run dev

## Add a .env file in backend
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=electech
PRO_PORT=6001

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret



