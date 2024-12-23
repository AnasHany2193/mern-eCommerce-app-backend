# 🛍️ MERN eCommerce App Backend

Welcome to the backend of the MERN eCommerce application! This project serves as the server-side component of a full-stack eCommerce platform, built with MongoDB, Express.js, Node.js, and integrates with various services to provide a comprehensive shopping experience.

## 🚀 Features

- **User Authentication & Authorization**: Secure login and registration using JWT.
- **Product Management**: CRUD operations for products.
- **Order Processing**: Manage customer orders efficiently.
- **Payment Integration**: Supports payment processing with Stripe.
- **Image Uploads**: Handles product images using Cloudinary.

## 🛠️ Installation Guide

Follow these steps to set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/AnasHany2193/mern-eCommerce-app-backend.git
   cd mern-eCommerce-app-backend
   ```

2. **Install Dependencies**:

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```bash
   npm install
   ```

3. **Environment Variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   MONGODB_CONNECTION_STRING=your_mongodb_connection_string
   appName=YourAppName
   PORT=5000
   JWT_SECRET=your_jwt_secret
   BCRYPT_SALT_ROUNDS=10
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_URL=your_cloudinary_url
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

   Replace the placeholder values with your actual configuration details.

4. **Start the Server**:

   ```bash
   npm start
   ```

   The server should now be running on `http://localhost:5000`.

## 📄 Environment Variables Description

- `MONGODB_CONNECTION_STRING`: Connection string for your MongoDB database.
- `appName`: Name of your application.
- `PORT`: Port number on which the server runs.
- `JWT_SECRET`: Secret key for signing JSON Web Tokens.
- `BCRYPT_SALT_ROUNDS`: Number of salt rounds for bcrypt password hashing.
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name for image storage.
- `CLOUDINARY_API_KEY`: API key for Cloudinary.
- `CLOUDINARY_API_SECRET`: API secret for Cloudinary.
- `CLOUDINARY_URL`: Cloudinary URL for configuration.
- `NODE_ENV`: Environment mode (`development` or `production`).
- `FRONTEND_URL`: URL of the frontend application.
- `STRIPE_SECRET_KEY`: Secret key for Stripe payment processing.
- `STRIPE_WEBHOOK_SECRET`: Webhook secret for Stripe to validate events.

## 👤 About the Author

Developed by [Anas Hany](https://www.linkedin.com/in/anashany219/). Feel free to connect!

---

Happy coding! 🎉
