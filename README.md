# Final Project - Task Management System

A task management system for managing tasks, users, comments, and notifications, facilitating activity tracking in an organizational environment, ensuring that users are informed about important changes, such as task assignments, status updates, or added comments.

**Author**: Renato Madeia Muiambo  
**Email**: renatomuiambo24@gmail.com

---

## 📌 Prerequisites

Before starting, ensure the following are installed:  

- [Node.js](https://nodejs.org/) (version 18 or higher)  
- [Vue 3](https://vuejs.org/)
- [MongoDB](https://www.mongodb.com/) (ensure MongoDB server is running locally or use a cloud instance, e.g., MongoDB Atlas)

---

## 🔧 How to Run the Application

### 🖥️ Backend (Node.js + Express)

1️⃣ **Install Node.js** (if not installed)  

- Windows: [Download and install](https://nodejs.org/)  
- Linux/macOS: Run in terminal:  
   ```sh
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```
   
2️⃣ Navigate to the backend directory (server) and install dependencies:

```sh
npm install
```
3️⃣ Create a .env file and set the following environment variables:
```sh
PORT=
MONGO_URI=
```
4️⃣ Run the backend:
```sh
npm run start 
```

- Local backend http://localhost:3000/
- Production backend: https://projetofinal-progaramacaowebavancada.onrender.com
- API documentation: https://projetofinal-progaramacaowebavancada.onrender.com/api-docs

### User Management

The system allows creation and management of "Employee" users. Only an administrator can create users of any type and assign tasks.
An administrator is created automatically on the first run if it does not exist.
Default Administrator Credentials:

**Credenciais do Administrador Padrão**:

- Username: renatomuiambo24@admin.com

- Password: admin@admin

### 🎨 Frontend (Vue)
1️⃣ **Install Vue ** (if not installed):
  - Windows/Linux/macOS: Execute:
     ```sh
     npm create vue@latest
     ```
2️⃣ Navigate to the frontend directory (client) and install dependencies:
```sh
npm install
```
3️⃣ Create a .env file and configure environment variable:
```sh
BASE_URL=/app/
```
4️⃣ Run the frontend:
```sh
npm run serve 
```
- Local frontend: http://localhost:8080/
- Production frontend: https://taskmanagement-rmm-devwn.netlify.app
