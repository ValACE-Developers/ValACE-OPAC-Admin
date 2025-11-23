# ValACE Frontend - React Application

Modern, responsive frontend for the ValACE Library Resource Management System built with React, Vite, and TailwindCSS.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- Backend API server running (see [backend/README.md](../backend/README.md))

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                    # API service layer
│   │   ├── ApiService.js       # Main API client
│   │   ├── ApiSyncService.js   # Sync operations
│   │   ├── ResourceService.js  # Resource CRUD
│   │   ├── AuthService.js      # Authentication
│   │   ├── LogService.js       # Log retrieval
│   │   └── config.js           # API configuration
│   │
│   ├── components/             # Reusable components
│   │   ├── layout/            # Layout components (AdminLayout, etc.)
│   │   ├── page_components/   # Page-specific components
│   │   └── ui/                # UI primitives (Button, Input, etc.)
│   │
│   ├── contexts/              # React contexts
│   │   └── AuthContext.jsx    # Authentication state
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── auth/             # Auth hooks (useLogin, useLogout)
│   │   ├── books/            # Book hooks (useSearchBooks, useFeaturedBooks)
│   │   ├── dashboard/        # Dashboard hooks (useDashboardStats)
│   │   ├── resources/        # Resource hooks (useResources, useSyncResource)
│   │   ├── useDebounce.js    # Debounce hook
│   │   ├── useKeyRedirect.js # Keyboard shortcuts
│   │   └── useNotification.jsx # Toast notifications
│   │
│   ├── pages/                 # Page components
│   │   ├── admin/            # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── ResourcePage.jsx
│   │   │   ├── FeaturedBooksPage.jsx
│   │   │   ├── LogsPage.jsx
│   │   │   ├── CreateApiResourcePage.jsx
│   │   │   ├── EditApiResourcePage.jsx
│   │   │   └── CreateRedirectResourcePage.jsx
│   │   ├── SearchPage.jsx    # Main search page
│   │   ├── SourcePage.jsx    # Resource detail page
│   │   └── NotFoundPage.jsx  # 404 page
│   │
│   ├── routes/               # Routing configuration
│   │   ├── AppRoute.jsx      # Main route definitions
│   │   └── ProtectedRoute.jsx # Auth route guard
│   │
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
│
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # TailwindCSS configuration
├── eslint.config.js          # ESLint configuration
└── package.json              # Dependencies and scripts
```

## 🎨 Key Features

### Public Pages
- **Search Page** (`/`) - Search books across all resources
- **Source Page** (`/source/:id`) - View resource details

### Admin Pages
- **Dashboard** (`/admin/dashboard`) - System overview and statistics
- **Resources** (`/admin/resources`) - Manage API resources and redirects
- **Featured Books** (`/admin/featured-books`) - Curate featured collections
- **Logs** (`/admin/logs`) - View system logs in real-time
- **Resource Creation/Editing** - Forms for managing resources

### Features
- 🔍 **Advanced Search** - Multi-field book search with filters
- 🔄 **Real-time Sync** - Live sync status updates with adaptive polling
- 📊 **Dashboard Analytics** - System statistics and metrics
- 📝 **Log Viewer** - Real-time log monitoring
- 🎨 **Responsive Design** - Mobile-friendly interface
- ⚡ **Fast Performance** - Optimized with React Query caching
- 🔐 **Protected Routes** - Secure admin access
- 🎯 **Keyboard Shortcuts** - Quick navigation (Ctrl + ` for admin login)

## 🛠️ Technology Stack

- **React 18.x** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 🧩 State Management

### Server State (React Query)
The application uses React Query for all server state management:
- Automatic caching and background updates
- Optimistic updates
- Request deduplication
- Automatic retries

Example hooks:
- `useResources()` - Fetch and cache resources
- `useSearchBooks()` - Search books with automatic caching
- `useSyncResourceMutation()` - Trigger resource sync

### Global State (Context API)
- **AuthContext** - Authentication state and user info
- Minimal global state, most state is server-managed

### Local State (useState/useReducer)
- Component-specific UI state (modals, forms, etc.)

## 🔌 API Integration

The frontend communicates with the Laravel backend via REST API:

### API Service Architecture
```javascript
// api/config.js - Base configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// api/ResourceService.js - Resource operations
export async function getActiveApiResources(params, auth) {
  // Fetch resources with filters
}

// api/ApiSyncService.js - Sync operations
export async function syncResource(resourceId, auth) {
  // Trigger resource sync
}
```

### Custom Hooks Pattern
```javascript
// hooks/resources/useResources.js
export const useResources = (params, options) => {
  return useQuery({
    queryKey: ["resources", params],
    queryFn: () => getActiveApiResources(params, getAuth()),
    ...options
  });
};
```

## 🎯 Development Guidelines

### Code Style
- Follow React best practices and hooks rules
- Use functional components with hooks
- Implement proper error boundaries
- Use proper TypeScript types (if migrating to TS)

### Component Structure
```javascript
// 1. Imports
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const { data, isLoading } = useQuery(...);
  const [state, setState] = useState();
  
  // 4. Event handlers
  const handleClick = () => { ... };
  
  // 5. Render
  return ( ... );
};

// 6. Export
export default MyComponent;
```

### Adding a New Page

1. Create page component in `src/pages/` or `src/pages/admin/`
2. Add route in `src/routes/AppRoute.jsx`
3. Create necessary API services in `src/api/`
4. Create custom hooks in `src/hooks/`
5. Add to navigation if needed

### Adding a New API Endpoint

1. Add service function in `src/api/[Service].js`
2. Create React Query hook in `src/hooks/[category]/`
3. Use hook in component

Example:
```javascript
// api/ResourceService.js
export async function getResource(id, auth) {
  const res = await fetch(`${API_BASE_URL}/resources/${id}`, {
    headers: createAuthHeaders(auth.username, auth.password)
  });
  return res.json();
}

// hooks/resources/useResource.js
export const useResource = (id) => {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: () => getResource(id, getAuth())
  });
};

// Component usage
const { data, isLoading, error } = useResource(resourceId);
```

## 🧪 Scripts

```bash
# Development
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run build        # Build optimized bundle
```

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Optional: Additional configuration
VITE_APP_NAME=ValACE
```

## 🔐 Authentication

Admin authentication uses Basic Auth:
- Login page: `/admin/login`
- Credentials stored in AuthContext
- Protected routes redirect to login if unauthenticated
- Keyboard shortcut: `Ctrl + `` for quick admin access

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Responsive navigation and layouts
- Touch-friendly UI elements

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deploy to Web Server

1. Build the application (`npm run build`)
2. Upload `dist/` folder contents to web server
3. Configure web server to serve `index.html` for all routes

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Environment Configuration

Set `VITE_API_BASE_URL` to production API URL before building:

```env
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
```

## 📚 Additional Resources

- [Main Documentation](../README.md) - Complete project documentation
- [Backend README](../backend/README.md) - Backend setup guide
- [API Documentation](../backend/API_DOCUMENTATION.md) - API reference
- [React Documentation](https://react.dev) - React official docs
- [Vite Documentation](https://vitejs.dev) - Vite official docs
- [TailwindCSS](https://tailwindcss.com) - TailwindCSS docs

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Write descriptive commit messages
3. Test thoroughly before submitting
4. Update documentation as needed

## 📄 License

This project is part of the ValACE New OPAC system. See main project LICENSE for details.
