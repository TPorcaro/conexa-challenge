# 🚀 Conexa Challenge

Conexa Challenge is a **NestJS** application that provides **user authentication, role-based access control, and a movie synchronization service** using **PostgreSQL** and **Prisma** ORM.

## 📌 Features

✅ **User Authentication** (Register, Login)  
✅ **Role-based Access Control (RBAC)** (`ADMIN`, `USER`)  
✅ **CRUD operations for users** (Only `ADMIN` can manage users)  
✅ **Scheduled Movie Synchronization from SWAPI**  
✅ **Database Management with Prisma & PostgreSQL**  
✅ **Swagger API Documentation**  
✅ **Docker Support** for easy setup  
✅ **Deployed on Railway**  

---

## 🛠️ **Technologies Used**

- **NestJS** (Backend framework)
- **Prisma** (ORM for PostgreSQL)
- **PostgreSQL** (Database)
- **JWT** (Authentication & Authorization)
- **Docker & Docker Compose** (Containerization)
- **Swagger** (API Documentation)
- **Railway** (Deployment)

---

## 📦 **Installation & Setup**

### 🔹 **Run Locally with Docker**
1. **Clone the repository**
   ```sh
   git clone https://github.com/TPorcaro/conexa-challenge.git
   cd conexa-challenge
   ```

2. **Create an `.env` file**
   Copy the example file and set your environment variables:
   ```sh
   cp .env.example .env
   ```
   Example `.env` file:
   ```ini
   DATABASE_URL=postgresql://postgres:postgres@db:5432/conexa_db?schema=public
   JWT_SECRET=mysecretkey
   ```

3. **Start the containers**
   ```sh
   docker-compose up --build
   ```
   This will start:
   - The **NestJS application** on `http://localhost:3000`
   - The **PostgreSQL database** on `localhost:5432`

4. **Run database migrations**
   ```sh
   docker exec -it conexa_challenge yarn prisma migrate dev
   ```

---

### 🔹 **Run Locally Without Docker**
1. **Install dependencies**
   ```sh
   yarn install
   ```

2. **Set up PostgreSQL**  
   - Create a database named `conexa_db`
   - Update `DATABASE_URL` in `.env` file:
     ```ini
     DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/conexa_db?schema=public
     ```

3. **Run migrations**
   ```sh
   yarn prisma migrate dev
   ```

4. **Start the application**
   ```sh
   yarn start:dev
   ```
   - Server runs at: `http://localhost:3000`

---

## 🌐 **API Documentation (Swagger)**
Once the server is running, you can access the **Swagger API documentation** at:

🔗 **[Swagger UI](http://localhost:3000/api/docs)**

---

## 🔑 **Authentication (JWT)**
### 🔹 **Register a new user**
**POST** `/auth/register`
```json
{
  "email": "admin@example.com",
  "password": "securePass123",
  "role": "ADMIN"
}
```

### 🔹 **Login**
**POST** `/auth/login`
```json
{
  "email": "admin@example.com",
  "password": "securePass123"
}
```
Response:
```json
{
  "access_token": "your_jwt_token"
}
```

### 🔹 **Use the Token**
Include the token in your requests:
```http
Authorization: Bearer your_jwt_token
```

---

## 🔒 **Role-Based Access Control (RBAC)**

| Endpoint              | Method | Access Control |
|----------------------|--------|----------------|
| `/users`            | GET    | Only `ADMIN`   |
| `/users/:id`        | GET    | Only `ADMIN`   |
| `/users/:id`        | DELETE | Only `ADMIN`   |
| `/users/:id/password` | PATCH  | `ADMIN` or the user themselves |

---

## 🛠️ **Docker Configuration**
### 🔹 **Dockerfile**
```dockerfile
FROM node:20

WORKDIR /app

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

# Ensure the NestJS CLI is in PATH
ENV PATH=$PATH:/root/.yarn/bin

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --ignore-engines

# Copy the application source
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

# Expose API port
EXPOSE 3000

# Start the application
CMD ["yarn", "start:watch"]
```

### 🔹 **Docker Compose**
```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: conexa_challenge
    restart: always
    depends_on:
      - db
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/conexa_db?schema=public
      - JWT_SECRET=mysecretkey
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: ["yarn", "start:dev"]

  db:
    image: postgres:15
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: conexa_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🎡 **Contributors**
- **[@TPorcaro](https://github.com/TPorcaro)**


