import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import githubRoutes from './routes/github.js';
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/github', rateLimiter, githubRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`RepoExplorer server running on ${PORT}`);
});
