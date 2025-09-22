<h1 align="center">🚀 Trackly</h1>
<p align="center">
  <em>A modern, full-stack application to vigilantly monitor your projects' uptime.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.24+-00ADD8?style=for-the-badge&logo=go" alt="Go Version">
  <img src="https://img.shields.io/badge/React-18+-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

<p align="center">
  Stay ahead of downtime with a beautiful dashboard, real-time status checks, and email alerts.
  <br>
  Built with <strong>Go</strong>, <strong>React</strong>, and <strong>PostgreSQL</strong>.
</p>

---

<div align="center">
  <h2>🌐 Live Demo</h2>
  <a href="https://sidharth-chauhan.github.io/Trackly/" target="_blank">
    <img src="https://img.shields.io/badge/Click_to_Launch_Trackly-28a745?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo Link"/>
  </a>
  <p>
    <small>The backend is hosted on a free-tier service, so it may take a moment to spin up on the first visit.</small>
  </p>
</div>

---

## ⚡ Quick Start

The entire application is containerized, so you can get it running locally with a single command.

### 🐳 Run with Docker Compose

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/sidharth-chauhan/Trackly.git](https://github.com/sidharth-chauhan/Trackly.git)
    cd Trackly
    ```

2.  **Build and Run the Application**
    ```bash
    docker-compose up --build -d
    ```

Your Trackly instance is now live and running!
- **Frontend:** 👉 [http://localhost:5173](http://localhost:5173)
- **Backend API:** 👉 [http://localhost:8080](http://localhost:8080)

---

## ✨ Features

-   🔑 **Secure User Authentication** using JWT for protected access.
-   📋 **Full CRUD** for effortlessly creating, reading, updating, and deleting your projects.
-   ⚡ **Real-time Uptime Monitoring** that periodically checks your project links.
-   📊 **Insightful Dashboard** providing a clean, at-a-glance overview of your projects' status.
-   📧 **Proactive Email Alerts** to notify you the moment a project becomes unresponsive.
-   🐳 **Fully Containerized with Docker** for easy, consistent, and reliable deployment.
-   🧱 **Clean, Modular Project Structure** that is beginner-friendly and easy to extend.

---

## 🛠️ Tech Stack

| Category      | Technologies                                                                                                                                                                                                                                                                                                 |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"> <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white" alt="Bootstrap"> |
| **Backend** | <img src="https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go"> <img src="https://img.shields.io/badge/Gorilla_Mux-000000?style=flat-square" alt="Gorilla Mux"> <img src="https://img.shields.io/badge/GORM-BF5B00?style=flat-square" alt="GORM">                               |
| **Database & DevOps** | <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">                                                                                                                                                                                                 |

---

## 🌐 API Endpoints

All `/project` routes require a `Bearer <TOKEN>` in the `Authorization` header.

| Method | Endpoint                 | Description                                    |
| :----- | :----------------------- | :--------------------------------------------- |
| `POST` | `/user/register`         | Register a new user account.                   |
| `POST` | `/user/login`            | Login to receive a JWT for authentication.     |
| `GET`  | `/healthcheck`           | A simple health check for the backend service. |
| `GET`  | `/project`               | List all projects for the authenticated user.  |
| `POST` | `/project`               | Create a new project.                          |
| `GET`  | `/project/{id}`          | Get a single project by its ID.                |
| `PUT`  | `/project/{id}`          | Update an existing project.                    |
| `DELETE`| `/project/{id}`         | Delete a project.                              |
| `GET`  | `/project/dashboard`     | Get dashboard analytics (total projects, etc.).|
| `GET`  | `/project/status`        | Get the real-time status of all user projects. |

---

### 🛠️ Example Usage (`curl`)

1.  **Login to Get a Token**
    *(Replace with your registered credentials)*
    ```bash
    curl -X POST http://localhost:8080/user/login \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"password123"}'
    
    # RESPONSE: {"token":"YOUR_JWT_TOKEN"}
    ```

2.  **Create a Project**
    *(Use the token received from the login step)*
    ```bash
    TOKEN="YOUR_JWT_TOKEN" # Replace with your actual token
    curl -X POST http://localhost:8080/project \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"name":"My Website","description":"Personal portfolio","link":"[https://my-website.com](https://my-website.com)"}'
    ```

3.  **List Your Projects**
    ```bash
    TOKEN="YOUR_JWT_TOKEN" # Replace with your actual token
    curl http://localhost:8080/project \
      -H "Authorization: Bearer $TOKEN"
    ```

---

## 🔧 Environment Variables

The application is configured using the `docker-compose.yaml` file, which sets the necessary environment variables for each service. You can modify this file to change the configuration.

| Service   | Variable         | Description                        | Default Value                     |
| :-------- | :--------------- | :--------------------------------- | :-------------------------------- |
| `backend` | `DB_USER`        | PostgreSQL username.               | `postgres`                        |
| `backend` | `DB_PASSWORD`    | PostgreSQL password.               | `yourpassword`                    |
| `backend` | `DB_NAME`        | Database name.                     | `openanalytics`                   |
| `backend` | `JWT_SECRET`     | Secret key for signing JWTs.       | `supersecretkey`                  |
| `frontend`| `VITE_BACKEND_URL`| URL for the backend API.           | `http://backend:8080`             |

---

## 👨‍💻 Development Tips

-   💾 **Database Persistence**: A Docker volume (`postgres-data`) is used to persist PostgreSQL data across container restarts. To start fresh, you can remove this volume with `docker volume rm trackly_postgres-data`.
-   🔄 **Live Reload**: The frontend service uses Vite's development server, so changes to the React code will auto-reload in the browser. For backend changes, you will need to rebuild the container with `docker-compose up -d --build`.
-   🧪 **Testing API**: Use a REST client like [Postman](https://www.postman.com/) or the provided `curl` examples to interact with the backend API quickly.

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork the repo, suggest improvements, or open issues. If you find this project useful, please give it a star ⭐.

---

<p align="center">
  Made with 💙 by <a href="https://github.com/sidharth-chauhan">Sidharth Chauhan</a>
</p>
