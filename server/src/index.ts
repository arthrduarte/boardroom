import 'dotenv/config';
import express, { Request, Response } from 'express';
<<<<<<< HEAD
import { supabaseAdmin } from './config/supabase';
import memberRoutes from './routes/memberRoutes';
=======
import memberRoutes from './routes/memberRoutes';
import historyRoutes from './routes/historyRoutes';
>>>>>>> b8f3710fe442343c857d84bada319adfab7fda85
import cors from 'cors';  

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

app.use('/api/members', memberRoutes);
<<<<<<< HEAD
=======
app.use('/api/history', historyRoutes);
>>>>>>> b8f3710fe442343c857d84bada319adfab7fda85

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
