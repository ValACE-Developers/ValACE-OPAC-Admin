# ValACE-OPAC-Admin - Quick Reference

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Quick start, installation, basic usage |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Complete architecture guide, patterns, best practices |
| [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) | Cleanup details, changes made, rationale |

## 🗂️ Project Structure

```
ValACE-OPAC-Admin/
├── src/
│   ├── api/                    # Backend API services
│   │   ├── ApiService.js       # Main service aggregator
│   │   ├── AuthService.js      # Authentication
│   │   ├── ResourceService.js  # Resource CRUD
│   │   ├── DashboardService.js # Dashboard stats
│   │   ├── LogService.js       # System logs
│   │   └── config.js           # API configuration
│   │
│   ├── components/
│   │   ├── layout/             # Layout components
│   │   ├── page_components/    # Page-specific components
│   │   └── ui/                 # Reusable UI components
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication state
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── auth/               # Authentication hooks
│   │   ├── books/              # Book management
│   │   ├── dashboard/          # Dashboard stats
│   │   ├── logs/               # Log management ✨
│   │   ├── resources/          # Resource CRUD
│   │   └── external-resources/ # External sync
│   │
│   ├── pages/                  # Route pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLoginPage.jsx
│   │   ├── ResourcePage.jsx
│   │   ├── FeaturedBooksPage.jsx
│   │   └── LogsPage.jsx
│   │
│   └── routes/
│       ├── AppRoute.jsx        # Route definitions
│       └── ProtectedRoute.jsx  # Auth guard
│
├── ARCHITECTURE.md             # 📖 Architecture documentation
├── CLEANUP_SUMMARY.md          # 📋 Cleanup details
└── README.md                   # 🚀 Quick start guide
```

## 🔑 Key Features

### Admin Pages
- **Dashboard** (`/admin/dashboard`) - System statistics and analytics
- **Resources** (`/admin/resources`) - Manage API and redirect resources
- **Featured Books** (`/admin/featured-books`) - Curate featured collections
- **Logs** (`/admin/logs`) - Real-time system log viewer

### Core Functionality
- 🔐 JWT-based authentication
- 📊 Dashboard with charts (Recharts)
- 🔄 External API synchronization
- 📝 System log monitoring
- 📚 Featured book curation
- 🎨 Responsive design (Tailwind CSS)

## 🛠️ Tech Stack

- **React 18.2.0** - UI framework
- **Vite 7.0.4** - Build tool
- **React Query 5.83.0** - Server state management
- **React Router 7.7.0** - Routing
- **Tailwind CSS 4.1.11** - Styling
- **React Hook Form 7.66.0** - Form management
- **Zod 4.0.17** - Schema validation
- **Recharts 3.3.0** - Data visualization

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Common Tasks

### Adding a New Page
1. Create page in `src/pages/`
2. Add route in `src/routes/AppRoute.jsx`
3. Create API service if needed
4. Create custom hooks for data fetching

### Adding a New API Endpoint
1. Add service function in `src/api/[Service].js`
2. Create React Query hook in `src/hooks/[category]/`
3. Use hook in component

### Creating a Form
1. Define Zod schema for validation
2. Use React Hook Form with zodResolver
3. Handle submit with mutation hook
4. Show loading/error states

## 🔍 State Management

- **Server State**: React Query (all API data)
- **Global State**: Context API (auth only)
- **Local State**: useState (UI state)

## 🔐 Authentication

- JWT token in localStorage
- Token verification on app load
- Protected routes for admin pages
- Automatic redirect to login

## 📊 API Integration

**Base URL**: `http://localhost:8000/api/v1`

### Key Endpoints
- `POST /auth/login` - Login
- `GET /auth/verify` - Verify token
- `GET /resources` - List resources
- `GET /dashboard/stats` - Dashboard data
- `GET /logs/[type]` - System logs
- `POST /external-resources/fetch-sync` - Trigger sync

## 🎨 Component Patterns

### Loading State
```javascript
if (isLoading) return <LoadingState />;
```

### Error State
```javascript
if (error) return <ErrorState message={error.message} />;
```

### Empty State
```javascript
if (!data?.length) return <NoDataFoundState />;
```

## 🧪 Development

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Keyboard Shortcuts
- `Ctrl + \`` - Navigate to admin login

## 📖 Documentation Deep Dive

### For Architecture Details
See [ARCHITECTURE.md](./ARCHITECTURE.md) for:
- Complete architecture diagrams
- Data flow patterns
- Component hierarchy
- Security considerations
- Performance optimizations
- Testing strategies
- Deployment guide

### For Cleanup History
See [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) for:
- Files removed and why
- Code reorganization details
- Migration history
- Build verification

## 🤝 Contributing

1. Review ARCHITECTURE.md for patterns
2. Follow existing code structure
3. Use TypeScript types (if migrated)
4. Test before committing
5. Update documentation if needed

## 📞 Support

For questions about:
- **Setup**: See README.md
- **Architecture**: See ARCHITECTURE.md
- **Changes**: See CLEANUP_SUMMARY.md

---

**Last Updated**: 2025-11-22  
**Status**: Production Ready ✅
