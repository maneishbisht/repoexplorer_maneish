import { Router } from 'express';
import { fetchFromGitHub } from '../services/githubService.js';

const router = Router();



router.get('/users/:username', async (req, res, next) => {
  try {
    const data = await fetchFromGitHub(`users/${encodeURIComponent(req.params.username)}`);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:username/repos', async (req, res, next) => {
  try {
    const { page = 1, per_page = 10 } = req.query;
    const endpoint = `users/${encodeURIComponent(req.params.username)}/repos?page=${page}&per_page=${per_page}`;
    const data = await fetchFromGitHub(endpoint);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/search/repos', async (req, res, next) => {
  try {
    const { q, page = 1, per_page = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Missing search query (q)' });
    }

    const endpoint = `search/repositories?q=${encodeURIComponent(q)}&page=${page}&per_page=${per_page}`;
    
    const data = await fetchFromGitHub(endpoint);
    if(!data)
    {
    const error = new Error(`GitHub API responded with status 404`);
    error.status = 404;
    error.code = 'PAGE_NOT_FOUND';
    throw error
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
