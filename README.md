# E-Learning Platform
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
A full-stack e-learning web application with AI-powered quiz generation and a text-to-speech academic voice assistant.

## Features

- **User Authentication** — Register, login, and session-based auth
- **Course Management** — Browse, enroll in, and view course materials
- **AI Quiz Generator** — Generate quizzes on topics like Network Security, Java, MERN Stack, and more via OpenAI
- **Academic Voice Assistant** — Text-to-speech powered by a Python Flask microservice
- **File Uploads** — Upload course images and materials
- **Course Likes** — Save/favourite courses

## Tech Stack

**Frontend**
- React 19 + React Router v7
- Embla Carousel / React Slick / Swiper

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- express-session + bcryptjs
- Multer (file uploads)
- OpenAI API

**AI Service**
- Python + Flask (text-to-speech microservice)

## Project Structure

```
E-Learning/
├── frontend/         # React application
├── backend/          # Node.js/Express API
│   ├── server.js     # Main server entry point
│   ├── app.py        # Python Flask TTS microservice
│   ├── models/       # Mongoose models
│   └── uploads/      # Uploaded course files
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.x
- MongoDB (local or Atlas)
- OpenAI API key

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/Vandan0412/E-Learning-MERN.git
cd E-Learning-MERN
```

2. **Backend setup**

```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm start
```

3. **Frontend setup**

```bash
cd frontend
npm install
npm start
```

4. **Python Flask service**

```bash
cd backend
pip install flask openai
python app.py
```

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | A strong random string for session signing |
| `PORT` | Backend port (default: 5000) |

## Running Ports

| Service | Port |
|---|---|
| Frontend (React) | 3000 |
| Backend (Express) | 5000 |
| AI Service (Flask) | 5003 |

--------------------------------------------------------------------------------------------

## Running with Docker

### Start the application

From the project root:

docker compose -f docker-compose.yaml up

This starts:

- Node.js/Express backend
- MongoDB
- Mongo Express

### Services

Backend:
http://localhost:5000

Mongo Express:
http://localhost:8081

MongoDB:
localhost:27017

### Stop the application

docker compose -f docker-compose.yaml down

---------------------------------------------------------------------------------------------

## License

[MIT](LICENSE)
