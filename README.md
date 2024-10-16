# MERN Application with Docker


![image](https://github.com/user-attachments/assets/2fb5cdcf-9fcd-4a0b-a20a-d6e178e2ce25)


This project is a containerized MERN (MongoDB, Express, React, Node.js) stack application using Docker. It features basic CRUD operations for user records, including registering, updating, deleting, and listing users. The project utilizes Docker Compose for container orchestration and includes persistent volumes for MongoDB data and live reloading for development purposes.

## Table of Contents

- [Installation](#installation)
  - [Requirements](#requirements)
  - [Running Locally](#running-locally)
- [Docker Containerization](#docker-containerization)
  - [Backend Service](#backend-service)
  - [Client Service](#client-service)
  - [MongoDB Service](#mongodb-service)
- [Volumes](#volumes)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Requirements
• Docker: Ensure Docker is installed on your system.
• Docker Compose: Comes bundled with Docker in most installations.

### Running Locally
To run this project locally:
1. Clone the repository:
```bash
git clone https://github.com/your-username/mern-docker-app.git
cd mern-docker-app
```
2. Create environment files:
- Backend: Inside the `backend` directory, create a `.env` file with your MongoDB connection string.
```env
MONGO_URI=mongodb://mongo:27017/mernapp
```
- Frontend: Inside the `client` directory, create a `.env` file with the API URL.
```env
REACT_APP_API_URL=http://localhost:5000/api
```
3. Run the application:
Run the following command to start the services using Docker Compose:
```bash
docker-compose up --build
```
4. Access the application:
- The React frontend will be available at [http://localhost:3000](http://localhost:3000).
- The backend API will be available at [http://localhost:5000/api](http://localhost:5000/api).
- MongoDB will run in the background, with data persisted via Docker volumes.


## Docker Containerization
This project uses Docker Compose to containerize and run the services (Backend, Frontend, and MongoDB) together.

### Backend Service
The backend is a Node.js + Express application. It is containerized using the Dockerfile inside the backend folder. The backend service connects to MongoDB through the `MONGO_URI` environment variable.
```yaml
backend:
  build: ./backend
  ports:
    - '5000:5000'
  volumes:
    - ./backend:/app
    - /app/node_modules
  environment:
    - MONGO_URI=mongodb://mongo:27017/mernapp
  depends_on:
    - mongo
```

### Client Service
The client is a React.js application, containerized using the Dockerfile inside the client folder. The frontend interacts with the backend API at `http://localhost:5000/api`.
```yaml
client:
  build: ./client
  ports:
    - '3000:3000'
  volumes:
    - ./client:/app
    - /app/node_modules
  environment:
    - REACT_APP_API_URL=http://localhost:5000/api
```

### MongoDB Service
The MongoDB service is pulled from the official `mongo:latest` Docker image. It uses a volume to persist data.
```yaml
mongo:
  image: mongo:latest
  volumes:
    - mongo-data:/data/db
  ports:
    - '27017:27017'
```
### Volumes
Volumes are used in the Docker setup to ensure data persistence and live code reloading.

**Key Volumes:**
- **MongoDB Volume (`mongo-data`)**:
  - Stores MongoDB data persistently across container restarts.
  - The data is saved to the local `mongo-data` volume and is mounted to `/data/db` in the MongoDB container.
```yaml
volumes:
  mongo-data:/data/db
```
- **Backend and Client Code Mounts**:
  - Code changes are instantly reflected in the running containers thanks to volume mounts for both the backend and client.
  - Mounts the local `./backend` and `./client` directories into the respective containers for live reloading during development.
```yaml
volumes:
  - ./backend:/app
  - ./client:/app
```
## API Endpoints

### POST /api/register
Registers a new user.

**Body**:
```json
{
  "username": "testuser",
  "email": "testuser@example.com"
}
```

### GET /api/users
Fetches all registered users.
PUT /api/users/:id
Updates user details.

**Body**:
```json
{
  "username": "updatedUser",
  "email": "updatedEmail@example.com"
}
```
### DELETE /api/users/:id
Deletes a user.

## Contributing
If you wish to contribute to this project, feel free to fork the repository, make changes, and create a pull request. Contributions are always welcome!
