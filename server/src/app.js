import express from 'express';
import cors from 'cors'
import aiRoute from "./routes/ai.route.js";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://trip-planner-sage-eta.vercel.app/"
  ],
  credentials: true
}));

//import routes
app.use('/api/ai', aiRoute);

//check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' })
})

export default app;