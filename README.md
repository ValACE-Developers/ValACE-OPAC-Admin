# ⚡ OPAC Frontend Setup Guide (Admin App)

This guide shows how to set up and run the frontend application that talks to the API server. It follows the same structure as the backend guide for consistency.

---

## 📦 Requirements

Make sure you have the following installed:

### For Local Development:

| Tool        | Version (Recommended) | Purpose                      |
| ----------- | --------------------- | ---------------------------- |
| Node.js     | 18.x+                 | Runtime for build tools      |
| npm / pnpm / yarn | Latest stable    | Package manager              |
| Browsers    | Latest Chromium/Firefox/Safari | For testing UI          |

Recommended: use Node LTS and a lockfile-compatible package manager (pnpm or npm).

### For Docker Deployment:

| Tool        | Version (Recommended) | Purpose                      |
| ----------- | --------------------- | ---------------------------- |
| Docker      | 20.x+                 | Container runtime            |
| Docker Compose | 2.x+               | Multi-container orchestration |

---

## 🔧 Services & Endpoints

- Backend API – The frontend communicates with the API server (see backend README). Default API base: `http://127.0.0.1:8000/api/v1`

Ensure the API server (backend) is running before using the frontend.

---

## 📁 Environment Setup

1. Create your environment configuration from the example:

    ```bash
    cp .env.example .env
    ```

2. Edit `.env` and set these important variables (Vite-style `VITE_` prefix is required for variables exposed to client code):

    - VITE_API_BASE_URL — Base URL for backend API (e.g. `http://127.0.0.1:8000/api/v1`)
    - VITE_USERNAME — Basic auth username for API requests (must match backend credentials)
    - VITE_PASSWORD — Basic auth password for API requests (must match backend credentials)
    - VITE_SYSTEM_LOGS_URL — URL for system logs
    - VITE_TEST_MODE — Enable test mode
    - VITE_ENVIRONMENT — Set environment (development/production)


    Example `.env` (do NOT commit secrets to Git):

    ```bash
    VITE_USERNAME="username_of_basic_auth_api"
    VITE_PASSWORD="password_of_basic_auth_api"
    VITE_API_BASE_URL="base_url_of_backend_api"
    VITE_SYSTEM_LOGS_URL="http://127.0.0.1:8000/logs"
    VITE_TEST_MODE="true"
    VITE_ENVIRONMENT="development"
    ```

3. Notes and best practices:
    - After changing `.env` files, restart the dev server so Vite picks up the new values.
    - If you need to expose non-client secrets to build-time only, use server-side tooling or CI variables rather than `VITE_` prefixed vars.

---

## 🐳 Docker Setup (Recommended for Production)

The project includes Docker configuration for easy deployment with Nginx.

### Docker Project Structure

```
docker/
├── app/
│   └── Dockerfile          # Multi-stage build (Node.js + Nginx)
└── nginx/
    └── default.conf        # Nginx configuration
docker-compose.yml          # Service orchestration
```

### Running with Docker

1. Ensure your `.env` file is configured (see [Environment Setup](#📁-environment-setup) section above)

2. Build and start the container:

    ```bash
    # Build and run in detached mode
    docker compose up -d

    # Or with sudo if needed
    sudo docker compose up -d
    ```

3. Access the application:
    - Frontend: `http://localhost:3001`

### Modifying the Port

If you need to change the port because `3001` is already in use, you can edit the `docker-compose.yml` file.

1.  Open `docker-compose.yml`.
2.  Locate the `ports` section under the `frontend` service.
3.  Change the first value (the "host port") to an available port.

    For example, to change the port from `3001` to `3002`:

    ```yaml
    # docker-compose.yml
    services:
      frontend:
        # ...
        ports:
          - "3002:80" # Changed 3001 to 3002
        # ...
    ```
4.  Save the file and restart the container:
    ```bash
    docker compose up -d --build
    ```
    You can now access the application at `http://localhost:3002`.

4. View logs:

    ```bash
    docker compose logs -f frontend
    ```

5. Stop the container:

    ```bash
    docker compose down
    ```

### Docker Build Details

The `Dockerfile` uses a **multi-stage build**:

1. **Stage 1 (Build)**: 
   - Uses `node:18-alpine` 
   - Installs dependencies and builds the Vite production bundle
   - Environment variables are passed as build arguments

2. **Stage 2 (Serve)**:
   - Uses `nginx:alpine`
   - Copies the built assets from Stage 1
   - Serves static files on port 80

### Docker Environment Variables

Environment variables are passed from your `.env` file to the Docker build:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_USERNAME` - API authentication username
- `VITE_PASSWORD` - API authentication password
- `VITE_SYSTEM_LOGS_URL` - URL for system logs
- `VITE_TEST_MODE` - Enable test mode
- `VITE_ENVIRONMENT` - Set environment

**Important**: These variables are baked into the built assets during the Docker build process. If you change `.env`, you must rebuild the container:

```bash
docker compose up -d --build
```

### Customizing Nginx Configuration

Edit `docker/nginx/default.conf` to customize:
- Server name
- Port configuration
- Routing rules
- Security headers

After changes, rebuild and restart:

```bash
docker compose up -d --build
```

---

## 🛠️ Install & Run (Development)

For local development without Docker:

From the frontend project root:

```bash
# 1. Install dependencies
npm install
# or
# pnpm install
# or
# yarn install

# 2. Run the dev server (hot-reload)
npm run dev

# 3. Open the app in your browser (default Vite dev server URL)
# usually http://127.0.0.1:5173 or printed by the dev server
```

If you use a proxy to avoid CORS during development, configure it in Vite config or package.json as needed.

---

## 📦 Build & Preview (Production)

```bash
# Build production assets
npm run build

# Serve a local preview (optional)
npm run preview
```

After building, the dist/ (or build/) folder contains static assets to be served by your static host or webserver.

---

## ✅ Additional Notes

- CORS: Ensure the backend allows the frontend origin (dev and production) to access API endpoints. Update backend CORS settings if you see CORS errors.
- API base path: The frontend expects API endpoints under `/api/v1/*`. If your backend uses a different prefix, update VITE_API_BASE_URL accordingly.
- Authentication: Token-based auth (Bearer) or cookies depend on backend implementation. Match the frontend auth method to backend middleware.
- Environment caching: When changing `.env`, restart the dev server to pick up changes.

---

## 🚀 Production Deployment (Quick Reference)

### Option 1: Docker (Recommended)

See the [Docker Setup](#🐳-docker-setup-recommended-for-production) section above for detailed instructions.

Quick command:
```bash
docker compose up -d
```

### Option 2: Manual Build & Deployment

1. Build optimized static assets:

    ```bash
    npm run build
    ```

2. Serve the built assets with any static server or integrate into your web host (NGINX, Netlify, Vercel, S3 + CloudFront).

Example NGINX snippet:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/opac-frontend/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Ensure the backend API is accessible from the deployed frontend origin and CORS is configured appropriately.

---

## 🔍 Troubleshooting

### Local Development Issues

- Dev server not starting: check Node version and package manager, delete node_modules and reinstall.
- API errors / 401: confirm authentication tokens and backend middleware configuration.

### Docker Issues

- **Container not building**: Ensure `.env` file exists and contains all required variables
- **Port 3001 already in use**: Change the host port in `docker-compose.yml`:
  ```yaml
  ports:
    - "8080:80"  # Change 3001 to any available port
  ```
- **Changes not reflected**: Rebuild the container with `docker compose up -d --build`
- **Container crashes**: Check logs with `docker compose logs frontend`
- **Permission denied**: Run with `sudo` or add your user to the docker group