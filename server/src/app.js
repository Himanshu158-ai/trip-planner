import express from 'express';
import cors from 'cors'
import aiRoute from "./routes/ai.route.js";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//import routes
app.use('/api/ai', aiRoute);

//check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' })
})

export default app;