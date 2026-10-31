import express from 'express';
import cors from 'cors'
import aiRoute from "./routes/ai.route.js";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://trip-planner-sage-eta.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

//import routes
app.use('/api/ai', aiRoute);

//check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' })
})

export default app;