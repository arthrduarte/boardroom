import 'dotenv/config';
import express, { Request, Response } from 'express';
import { supabaseAdmin } from './config/supabase';
import memberRoutes from './routes/memberRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

app.use('/api/members', memberRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
