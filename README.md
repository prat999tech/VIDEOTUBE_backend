# backend_project

This is a full-featured backend for a video-sharing and social platform, built with Node.js, Express, and MongoDB. The project supports user authentication, tweets, comments, file uploads, and more, following a modular and scalable architecture.

---

## Features

- **User Authentication**: Register, login, logout, JWT-based authentication, refresh tokens.
- **User Profile**: Avatar and cover image upload (Multer + Cloudinary), profile updates.
- **Tweets**: Create, update, delete, and fetch tweets.
- **Comments**: Add, update, delete, and fetch comments on videos.
- **Video Management**: (Planned/extendable) video model and endpoints.
- **Subscriptions**: (Planned/extendable) subscribe/unsubscribe to channels.
- **RESTful API**: Organized routes for users, tweets, comments, etc.
- **Database**: MongoDB with Mongoose schemas and aggregation pipelines.
- **Error Handling**: Centralized error and response classes.
- **Security**: Password hashing, CORS, environment variable management.
- **File Uploads**: Local storage for temp files, Cloudinary for persistent storage.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB instance

### Installation

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd backend/project
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.sample` to `.env` and fill in your credentials (MongoDB URI, Cloudinary keys, JWT secrets, etc.).

4. **Run the server**
   ```sh
   npm run dev
   ```

   The server will start on the port specified in your `.env` file (default: 8001).

---

## Folder Structure

```
project/
├── .env
├── .env.sample
├── package.json
├── public/
│   └── temp/
├── src/
│   ├── app.js
│   ├── constants.js
│   ├── index.js
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
└── README.md
```

---

## API Overview

- **User Routes**: `/api/v1/users`
- **Tweet Routes**: `/api/v1/tweets`
- **Comment Routes**: `/api/v1/comments`
- (See `src/routes/` for all endpoints)

---

## Environment Variables

See `.env.sample` for all required environment variables.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

ISC

---

## Author

pratik singh
