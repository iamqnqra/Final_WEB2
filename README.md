# To-Do List Application

## Project Overview
This is a simple To-Do List application built using **Node.js**, **Express.js**, and **MongoDB**. It allows users to register, log in, and manage their tasks efficiently with features like task creation, updating, deletion, and sorting by date and priority.

## Features
- User authentication (JWT-based login/logout)
- Task management (CRUD operations)
- Sorting tasks by date and importance
- Secure password hashing using bcrypt
- API endpoints for frontend integration

---

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Use MongoDB Atlas or local installation)

### Installation Steps
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/todo-list-app.git
   cd todo-list-app
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```sh
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   PORT=8000
   ```

4. **Start the server**
   ```sh
   npm start  # or npm run dev (if using nodemon)
   ```

5. **Access the application**
   The server runs on `http://localhost:8000` by default.

---

## API Documentation
### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints
#### **1. Register User**
**Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### **2. Login User**
**Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt-token-here"
  }
  ```

### Task Management Endpoints
#### **3. Create a Task**
**Endpoint:** `POST /tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, Eggs, Bread",
    "dueDate": "2025-02-28",
    "importance": "high"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task created successfully",
    "task": {
      "_id": "task_id_here",
      "title": "Buy groceries",
      "description": "Milk, Eggs, Bread",
      "importance": "high",
      "dueDate": "2025-02-28"
    }
  }
  ```

#### **4. Get All Tasks**
**Endpoint:** `GET /tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "_id": "task_id_here",
      "title": "Buy groceries",
      "description": "Milk, Eggs, Bread",
      "importance": "high",
      "dueDate": "2025-02-28"
    }
  ]
  ```

#### **5. Update a Task**
**Endpoint:** `PUT /tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "Buy groceries and fruits",
    "importance": "medium"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task updated successfully"
  }
  ```

#### **6. Delete a Task**
**Endpoint:** `DELETE /tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

---

## Deployment
To deploy, you can use services like:
- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [Replit](https://replit.com/)

1. Set up your environment variables in the hosting platform.
2. Push your code to a GitHub repository.
3. Connect the repository to your hosting platform.
4. Deploy the app and access it via the provided URL.

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

