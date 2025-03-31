import 'dotenv/config';
import express, { Request, Response } from 'express';
import memberRoutes from './routes/memberRoutes';
import historyRoutes from './routes/historyRoutes';
import cors from 'cors';  
import picturesRoutes from './routes/picturesRoutes';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Log environment for debugging
console.log(`Node environment: ${process.env.NODE_ENV}`);

app.use(express.json());

// CORS configuration based on environment
const isDevelopment = process.env.NODE_ENV !== 'production';
app.use(cors({
  origin: isDevelopment ? 'http://localhost:5173' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// API Routes
app.use('/api/members', memberRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/pictures', picturesRoutes);

// In production, serve the static files from the client build
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the client's build directory
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  console.log(`Serving static files from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));
  
  // For any other requests, send the index.html file
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Only used in development
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: "hello world" });
  });
}

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
