import 'dotenv/config';
import express, { Request, Response } from 'express';
import memberRoutes from './routes/memberRoutes';
import historyRoutes from './routes/historyRoutes';
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
app.use('/api/history', historyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
