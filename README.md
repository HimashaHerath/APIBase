
# APIBase Project

## Overview
APIBase is a Node.js and Express.js based RESTful API project with basic CRUD operations and user authentication using JSON Web Tokens (JWT). The project is designed to be modular and reusable, with all credentials stored in environment variables for security.

## Features
- User Registration
- User Login
- Get User by ID
- Get All Users
- Update User
- Delete User
- Protected Routes with JWT Authentication

## Project Structure
```
APIBase/
|-- controllers/
|   |-- userController.js
|-- models/
|   |-- User.js
|-- routes/
|   |-- userRoutes.js
|-- config/
|   |-- db.js
|-- middlewares/
|   |-- authMiddleware.js
|   |-- errorHandler.js
|-- .env
|-- .gitignore
|-- index.js
|-- package.json
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB database setup

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HimashaHerath/APIBase.git
   cd APIBase
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret
   ```

   Replace `<username>`, `<password>`, `<cluster-url>`, and `<dbname>` with your MongoDB credentials and database name.

4. Start the server:
   ```bash
   npm start
   ```

## Usage

### Register a New User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

### Login a User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

### Get User by ID
- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Headers**: 
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Headers**: 
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### Update User
- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Headers**: 
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Body**:
  ```json
  {
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "password": "newpassword123"
  }
  ```

### Delete User
- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Headers**: 
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

## Error Handling
Errors are returned in the following format:
```json
{
  "error": "Error message"
}
```

## Postman Collection
You can import the provided Postman collection to test all the endpoints.

1. Open Postman
2. Click on `Import` in the top-left corner
3. Select the `Upload Files` tab
4. Choose the `APIBase.postman_collection.json` file
5. Click `Import`

## License
