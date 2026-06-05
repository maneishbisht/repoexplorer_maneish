
## REPOEXPLORER

This is a full-stack web application for exploring GitHub profiles and repositories. Users can search for GitHub users along with their repos, or  search for public repositories, view profile details (avatar, bio, stats), browse paginated repository lists with sorting, and visualize language usage via a bar chart. The backend acts as a proxy to the GitHub API with Redis caching and rate limiting.

## Live Demo

LIVE DEMO LINK : 

## Tech Stack

### Frontend
- **React 19** — UI library with hooks and memoization for state management
- **Chart.js 4 + react-chartjs-2** — Language distribution bar chart for data visualization, used due to earlier familiarity.

### Backend
- **Express 4** — Proxy server for GitHub API requests
- **ioredis 5** — Redis client for caching API responses and rate limiter counters

### Infrastructure
- **Redis** — Caches GitHub API responses (60s TTL) and tracks request counts for rate limiting (default: 5000 req/hour). Chosend due to high reliability, easy setup, earlier familiarity and Robustness( since persistent volumes can also configured)

## How to Run Locally

**Prerequisites:** Node.js on port 3001 and a Redis server running locally on `127.0.0.1:6379`.

```bash
# 1. Clone and install frontend dependencies
npm install

# 2. Install backend dependencies
cd Server
npm install
cd ..

# 3. Create environment files
# Frontend .env (root directory):
echo 'VITE_STORAGE_KEY="recentsearch"' > .env
echo 'VITE_BASE_URL=http://localhost:3001/api/github' >> .env

# Backend .env (Server/.env):
echo 'PORT=3001' > Server/.env
echo 'REDIS_HOST=127.0.0.1' >> Server/.env
echo 'REDIS_PORT=6379' >> Server/.env
echo "GITHUB_TOKEN='your_github_personal_access_token'" >> Server/.env
echo 'GITHUB_API=https://api.github.com' >> Server/.env
echo 'CACHE_TTL=60' >> Server/.env
echo 'WINDOW_SECONDS=3600' >> Server/.env
echo 'MAX_REQUESTS=5000' >> Server/.env

# 4. Start backend (terminal 1)
cd Server && npm run dev

# 5. Start frontend (terminal 2)
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Documentation

All endpoints are proxied through the Express backend at `http://localhost:3001/api/github` and protected by the Redis rate limiting middleware.

### GET `/api/github/users/:username`

Fetch a GitHub user's profile.

**Response (200):**
```json
{
  "login": "octocat",
  "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
  "html_url": "https://github.com/octocat",
  "name": "The Octocat",
  "bio": "Some bio text",
  "public_repos": 8,
  "followers": 10000,
  "following": 10,
  "location": "San Francisco"
}
```

### GET `/api/github/users/:username/repos`

Fetch repositories for a user.

**Query Params:** `page` (default: 1), `per_page` (default: 10)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "repo-name",
    "full_name": "octocat/repo-name",
    "html_url": "https://github.com/octocat/repo-name",
    "description": "A sample repo",
    "stargazers_count": 42,
    "forks_count": 10,
    "language": "JavaScript",
    "updated_at": "2024-01-01T00:00:00Z",
    "license": { "name": "MIT" },
    "default_branch": "main",
    "open_issues_count": 2,
    "watchers_count": 42,
    "created_at": "2023-01-01T00:00:00Z",
    "owner": { "login": "octocat" }
  }
]
```

### GET `/api/github/search/repos`

Search repositories globally.

**Query Params:** `q` (required, search query), `page` (default: 1), `per_page` (default: 10)

**Response (200):**
```json
{
  "total_count": 12345,
  "items": [
    {
      "id": 1,
      "name": "repo-name",
      "full_name": "owner/repo-name",
      "html_url": "https://github.com/owner/repo-name",
      "description": "A sample repo",
      "stargazers_count": 100,
      "forks_count": 25,
      "language": "TypeScript",
      "updated_at": "2024-06-01T00:00:00Z",
      "license": { "name": "MIT" },
      "default_branch": "main",
      "open_issues_count": 5,
      "watchers_count": 100,
      "created_at": "2022-06-01T00:00:00Z",
      "owner": { "login": "owner" }
    }
  ]
}
```

### Error Responses

| Status | Body |
|--------|------|
| 404 | `{ "error": "...", "code": "NOT_FOUND" }` |
| 429 | `{ "error": "Our Servers request limit has been reached.", "code": "RATE_LIMITED" }` |
| 403 | `{ "error": "...", "code": "RATE_LIMITED" }` |
| 500 | `{ "error": "...", "code": "INTERNAL_ERROR" }` |

NOTE : Github API return 404 if userprofile not found OR repositories for a userprofile are not found. This has been handled separately by returning a null response through the backend routes for all 404 status response received from Github API.
BUT FOR SEARCHING PUBLIC REPOS  : A 200 response is returned by Github API. This has been handled by Route Handler by explicitly returning 404 response through the Error Middleware.


## Project Structure

```
repoexplorer/
├── index.html                 # Vite HTML entry point
├── vite.config.js             # Vite configuration (React plugin)
├── package.json               # Frontend deps & scripts
├── .env                       # Frontend env vars
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/                       # React frontend
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component (state, layout)
│   ├── index.css              # Global styles
│   ├── styles.js              # Theme constants (colors, fonts, radii)
│   ├── api/
│   │   └── github.js          # API client (fetchUser, fetchRepos, fetchReposbyUser)
│   ├── hooks/
│   │   └── useGitHubUser.js   # Custom hook: search, fetching, pagination, sorting. Also acts like Central State manager.
│   ├── components/
│   │   ├── SearchBar.jsx      # Search input with User/Repo toggle
│   │   ├── UserProfile.jsx    # GitHub user avatar, name, bio, stats
│   │   ├── RepoList.jsx       # Sortable, paginated repo list
│   │   ├── RepoCard.jsx       # Individual repo card (expandable details)
│   │   ├── LanguageChart.jsx  # Horizontal bar chart (Chart.js)
│   │   ├── RecentSearches.jsx # Recent search chips from localStorage
│   │   ├── ErrorMessage.jsx   # Dismissable error banner
│   │   └── LoadingSpinner.jsx # Loading indicator
│   └── helpers/
│       └── recent.js          # localStorage helpers + sort functions
│
└── Server/                    # Express backend
    ├── package.json           # Backend deps & scripts
    ├── .env                   # Server env vars (port, token, Redis, rate limit)
    ├── server.js              # Express app entry point
    ├── config/
    │   └── redis.js           # ioredis client setup
    ├── middleware/
    │   ├── rateLimiter.js     # Redis-based rate limiter
    │   └── errorHandler.js    # Centralized error response handler
    ├── routes/
    │   └── github.js          # Proxy route definitions
    └── services/
        └── githubService.js   # GitHub API fetcher with Redis cache
```

## Next Steps

What I chose not to do, and what I would build next:

**API IMPROVEMENTS**

- **Authentication** — Add OAuth so that users can use their own PATs and can access private repos and make authenticated requests with higher rate limits.

- **TypeScript** — Convert the codebase to TypeScript for better type safety.

- **Testing** — Add unit tests (Vitest for frontend, Jest/Supertest for backend) and E2E tests (Playwright).

- **Optimizations** - Use RTK queries to cache results on Frontend.

- **CI/CD** — Set up GitHub Actions and Argo CD. Use 