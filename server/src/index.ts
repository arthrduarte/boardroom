import 'dotenv/config';
import express, { Request, Response } from 'express';
import { supabaseAdmin } from './config/supabase';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
