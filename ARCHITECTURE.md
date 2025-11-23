# ValACE-OPAC-Admin Architecture Documentation

## Project Overview

**ValACE-OPAC-Admin** is a React-based administrative dashboard for managing the ValACE OPAC system. It provides interfaces for managing external library resources (API and redirect types), curating featured books, monitoring system logs, and viewing dashboard analytics.

---

## Tech Stack

### Core Technologies
- **Framework**: React 18.2.0
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.7.0
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm

### Key Libraries & Dependencies

#### State Management & Data Fetching
- **@tanstack/react-query** (5.83.0) - Server state management and caching
- **react-hook-form** (7.66.0) - Form state management
- **@hookform/resolvers** (5.2.2) - Form validation resolvers
- **zod** (4.0.17) - Schema validation

#### UI & Styling
- **tailwindcss** (4.1.11) - Utility-first CSS framework
- **@tailwindcss/vite** (4.1.11) - Vite integration for Tailwind
- **lucide-react** (0.525.0) - Icon library
- **swiper** (11.2.10) - Touch slider/carousel
- **@react-spring/web** (10.0.3) - Animation library

#### Data Visualization
- **recharts** (3.3.0) - Charting library for dashboard analytics

---

## Project Structure

```
ValACE-OPAC-Admin/
├── public/                           # Static assets
├── src/
│   ├── api/                          # API service layer
│   │   ├── ApiService.js             # Main API service aggregator
│   │   ├── ApiSyncService.js         # External resource sync operations
│   │   ├── AuthService.js            # Authentication (login, logout, verify)
│   │   ├── config.js                 # API base URL & auth headers
│   │   ├── DashboardService.js       # Dashboard statistics
│   │   ├── ExternalBookDataService.js # External book data fetching
│   │   ├── LogService.js             # System log retrieval
│   │   └── ResourceService.js        # Resource CRUD operations
│   │
│   ├── assets/                       # Images, fonts, static files
│   │
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── AdminLayout.jsx       # Main admin layout with sidebar
│   │   │   ├── LayoutWrapper.jsx     # Root layout wrapper
│   │   │   └── Sidebar.jsx           # Navigation sidebar
│   │   │
│   │   ├── page_components/          # Page-specific components
│   │   │   ├── admin_page/
│   │   │   │   ├── create_api_resource_page/  # API resource creation form sections
│   │   │   │   │   ├── ApiConfigurationSection.jsx
│   │   │   │   │   ├── AuthConfiguration.jsx
│   │   │   │   │   ├── BasicInformationSection.jsx
│   │   │   │   │   ├── EndpointCard.jsx
│   │   │   │   │   ├── EndpointsSection.jsx
│   │   │   │   │   ├── FieldMappingTable.jsx
│   │   │   │   │   ├── HeadersTable.jsx
│   │   │   │   │   ├── MediaSection.jsx
│   │   │   │   │   └── PageConfiguration.jsx
│   │   │   │   │
│   │   │   │   ├── logs_page/        # Log viewer components
│   │   │   │   │   ├── LogContainer.jsx
│   │   │   │   │   ├── LogEntry.jsx
│   │   │   │   │   └── LogTab.jsx
│   │   │   │   │
│   │   │   │   └── resource_page/    # Resource management components
│   │   │   │       ├── DeleteConfirmationModal.jsx
│   │   │   │       ├── MetricCard.jsx
│   │   │   │       ├── SearchAndFilters.jsx
│   │   │   │       ├── StatusBadge.jsx
│   │   │   │       └── Th.jsx
│   │   │   │
│   │   │   └── search_page/          # Search page components (legacy)
│   │   │       ├── BookList.jsx
│   │   │       ├── Dropdown.jsx
│   │   │       ├── EntriesPerPage.jsx
│   │   │       ├── NoDataFound.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── SearchBar.jsx
│   │   │       └── ViewSwitcher.jsx
│   │   │
│   │   └── ui/                       # Reusable UI components
│   │       ├── BarChartComponent.jsx
│   │       ├── BookCard.jsx
│   │       ├── BookDetailsModal.jsx
│   │       ├── BookInfoModal.jsx
│   │       ├── Breadcrumb.jsx
│   │       ├── CollectionDisplay.jsx
│   │       ├── CoverCard.jsx
│   │       ├── EntriesDropdown.jsx
│   │       ├── ErrorState.jsx
│   │       ├── LineChartComponent.jsx
│   │       ├── ListDisplay.jsx
│   │       ├── LoadingSkeletonState.jsx
│   │       ├── LoadingState.jsx
│   │       ├── LogoLoading.jsx
│   │       ├── NoDataFoundState.jsx
│   │       ├── Pagination.jsx
│   │       ├── PieChartComponent.jsx
│   │       ├── ScrollToTopButton.jsx
│   │       ├── SearchBar.jsx
│   │       ├── ViewSwitcher.jsx
│   │       └── index.js
│   │
│   ├── constants/                    # Application constants
│   │
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.jsx           # Authentication state management
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── auth/                     # Authentication hooks
│   │   ├── books/                    # Book-related hooks
│   │   ├── dashboard/                # Dashboard hooks
│   │   ├── external-resources/       # External resource sync hooks
│   │   ├── resources/                # Resource CRUD hooks
│   │   ├── vcl-collection/           # VCL collection hooks
│   │   ├── useDebounce.js            # Debounce utility hook
│   │   ├── useKeyRedirect.js         # Keyboard shortcut navigation
│   │   └── useNotification.jsx       # Toast notification hook
│   │
│   ├── pages/                        # Page components (routes)
│   │   ├── AdminDashboard.jsx        # Main dashboard with analytics
│   │   ├── AdminLoginPage.jsx        # Login page
│   │   ├── ChooseResourceTypePage.jsx # Resource type selection
│   │   ├── CreateApiResourcePage.jsx # API resource creation
│   │   ├── CreateRedirectResourcePage.jsx # Redirect resource creation
│   │   ├── EditApiResourcePage.jsx   # API resource editing
│   │   ├── EditRedirectResourcePage.jsx # Redirect resource editing
│   │   ├── ExternalResourcePage.jsx  # External resource management
│   │   ├── FeaturedBooksPage.jsx     # Featured books curation
│   │   ├── LogsPage.jsx              # System logs viewer
│   │   ├── NotFoundPage.jsx          # 404 page
│   │   └── ResourcePage.jsx          # Resource list and management
│   │
│   ├── routes/                       # Routing configuration
│   │   ├── AppRoute.jsx              # Main route definitions
│   │   └── ProtectedRoute.jsx        # Authentication guard
│   │
│   ├── utils/                        # Utility functions
│   │
│   ├── App.jsx                       # Root app component
│   ├── App.css                       # App-level styles
│   ├── main.jsx                      # Application entry point
│   └── index.css                     # Global styles
│
├── .env                              # Environment variables (not in git)
├── .env.example                      # Environment template
├── .gitignore
├── eslint.config.js                  # ESLint configuration
├── index.html                        # HTML entry point
├── package.json
├── tailwind.config.js                # Tailwind CSS configuration
├── vite.config.js                    # Vite build configuration
└── README.md
```

---

## Architecture Overview

### 1. Application Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     App.jsx (Root)                          │
│  - QueryClientProvider (React Query)                        │
│  - AuthProvider (Authentication Context)                    │
│  - LayoutWrapper (Global Layout)                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  AppRoute (Router)                          │
│  - Public Routes: /admin/login                              │
│  - Protected Routes: /admin/*                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               AdminLayout (Admin Routes)                    │
│  - Sidebar Navigation                                       │
│  - Main Content Area (Outlet)                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Page Components                           │
│  Dashboard | Resources | Featured Books | Logs              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Data Flow Architecture

```
┌──────────────┐
│   UI Layer   │  (React Components)
└──────┬───────┘
       ↓
┌──────────────┐
│  Hook Layer  │  (Custom React Query Hooks)
└──────┬───────┘
       ↓
┌──────────────┐
│ Service Layer│  (API Services)
└──────┬───────┘
       ↓
┌──────────────┐
│ Backend API  │  (Laravel REST API)
└──────────────┘
```

### 3. Component Hierarchy

```
App
├── QueryClientProvider
│   └── AuthProvider
│       └── LayoutWrapper
│           └── AppRoute
│               ├── RedirectIfAuthenticated (Public)
│               │   └── AdminLoginPage
│               │
│               └── ProtectedRoute (Admin)
│                   └── AdminLayout
│                       ├── Sidebar
│                       └── Outlet (Pages)
│                           ├── AdminDashboard
│                           ├── ResourcePage
│                           ├── FeaturedBooksPage
│                           └── LogsPage
```

---

## Core Features & Modules

### 1. Authentication System

**Purpose**: Secure admin access control

**Components**:
- `AuthContext.jsx` - Global authentication state
- `AuthService.js` - Login, logout, token verification APIs
- `ProtectedRoute.jsx` - Route guard for admin pages
- `AdminLoginPage.jsx` - Login UI

**Flow**:
1. User enters credentials on `/admin/login`
2. `AuthService.loginAdmin()` sends credentials to backend
3. On success, JWT token stored in localStorage
4. `AuthContext` maintains authentication state via React Query
5. Protected routes check auth state before rendering
6. Token verification runs on app load and periodically

**Key Features**:
- JWT token-based authentication
- Automatic token verification
- Persistent sessions (localStorage)
- Test mode bypass for development
- Keyboard shortcut (Ctrl + `) for quick admin access

### 2. Resource Management

**Purpose**: Manage external library resources (APIs and redirects)

**Resource Types**:
1. **API Resources**: External library APIs with field mapping
2. **Redirect Resources**: Simple links to external catalogs

**Pages**:
- `ResourcePage.jsx` - List all resources with filters
- `ChooseResourceTypePage.jsx` - Select resource type to create
- `CreateApiResourcePage.jsx` - Complex form for API resources
- `CreateRedirectResourcePage.jsx` - Simple form for redirects
- `EditApiResourcePage.jsx` - Edit API resource configuration
- `EditRedirectResourcePage.jsx` - Edit redirect resource

**API Resource Configuration**:
```javascript
{
  name: "Library Name",
  type: "api",
  status: "active",
  category: "library|integrated_api",
  
  // API Configuration
  api_config: {
    base_url: "https://api.library.com",
    endpoints: {
      search: { path: "/search", method: "GET" },
      details: { path: "/book/{id}", method: "GET" }
    },
    auth: {
      type: "bearer|basic|none",
      credentials: {}
    },
    field_mapping: {
      title: "$.data.bookTitle",
      author: "$.data.author"
    }
  },
  
  // Display Configuration
  logo_url: "https://...",
  banner_url: "https://...",
  page_url: "https://library.com"
}
```

**CRUD Operations**:
- Create: Multi-step form with validation
- Read: Paginated list with search and filters
- Update: Edit forms pre-populated with data
- Delete: Confirmation modal before deletion

### 3. Dashboard & Analytics

**Purpose**: System overview and statistics

**Page**: `AdminDashboard.jsx`

**Metrics Displayed**:
- Total resources count
- Active vs inactive resources
- Total books indexed
- Recent sync activities
- Resource status breakdown (pie chart)
- Sync activity trends (line chart)
- Top performing resources (bar chart)

**Data Sources**:
- `DashboardService.js` - Fetches aggregated statistics
- Real-time updates via React Query polling

### 4. Featured Books Curation

**Purpose**: Manage featured book collections on public site

**Page**: `FeaturedBooksPage.jsx`

**Features**:
- Search and select books from all resources
- Add/remove books from featured collection
- Reorder featured books
- Preview featured books display

**Hook**: `useFeaturedBooks()` - Manages featured book state

### 5. System Logs Viewer

**Purpose**: Monitor system activities and debug issues

**Page**: `LogsPage.jsx`

**Components**:
- `LogContainer.jsx` - Main log display container
- `LogTab.jsx` - Log type tabs (info, warning, error)
- `LogEntry.jsx` - Individual log entry display

**Features**:
- Real-time log streaming
- Filter by log level (info, warning, error)
- Search logs by keyword
- Auto-scroll to latest logs
- Export logs functionality

**Log Types**:
- API sync operations
- Authentication events
- Resource CRUD operations
- Error tracking

### 6. External Resource Synchronization

**Purpose**: Fetch and sync book data from external APIs

**Service**: `ApiSyncService.js`

**Operations**:
```javascript
// Fetch all resources in chunks
ExternalResourceService.fetchAllChunked(debug, auth)

// Fetch specific resource
ExternalResourceService.fetchSpecific(api_resource_id, debug, auth)

// Sync specific resource
ExternalResourceService.fetchSync(api_resource_id, debug, auth)
```

**Sync Process**:
1. Admin triggers sync for a resource
2. Backend fetches data from external API
3. Data is mapped using field_mapping configuration
4. Books are stored/updated in database
5. Sync status updated in real-time
6. Logs generated for tracking

**Status Tracking**:
- `syncing` - Currently fetching data
- `completed` - Sync successful
- `failed` - Sync encountered errors
- `idle` - No active sync

---

## State Management

### 1. Server State (React Query)

**Purpose**: Manage server data with caching and synchronization

**Key Patterns**:

```javascript
// Query Pattern (Read)
export const useResources = (params) => {
  return useQuery({
    queryKey: ["resources", params],
    queryFn: () => ResourceService.getActiveApiResources(params, auth),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation Pattern (Write)
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => ResourceService.createResource(data, auth),
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
    },
  });
};
```

**Cache Strategy**:
- Dashboard stats: 5 minutes stale time
- Resources list: 5 minutes stale time
- Logs: 30 seconds stale time (near real-time)
- Featured books: 10 minutes stale time

**Optimistic Updates**:
- Used for quick UI feedback on mutations
- Rolled back on error

### 2. Global State (Context API)

**AuthContext**:
```javascript
{
  isAuthenticated: boolean,
  user: { id, email, role },
  loading: boolean,
  login: (credentials) => Promise,
  logout: () => Promise
}
```

**Why Context for Auth**:
- Authentication state needed across entire app
- Prevents prop drilling
- Persistent across route changes

### 3. Local Component State

**Used For**:
- UI state (modals, dropdowns, tabs)
- Form state (react-hook-form)
- Temporary data (search input, filters)

---

## API Integration

### Backend API Structure

**Base URL**: `http://localhost:8000/api/v1`

### Authentication

**Type**: JWT Token (stored in localStorage)

**Headers**:
```javascript
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Endpoints

#### Authentication
```
POST   /auth/login              - Login
POST   /auth/logout             - Logout
GET    /auth/verify             - Verify token
```

#### Resources
```
GET    /resources               - List resources
GET    /resources/:id           - Get resource details
POST   /resources               - Create resource
PUT    /resources/:id           - Update resource
DELETE /resources/:id           - Delete resource
```

#### Dashboard
```
GET    /dashboard/stats         - Dashboard statistics
GET    /dashboard/recent-syncs  - Recent sync activities
```

#### External Resources (Sync)
```
POST   /external-resources/fetch-all        - Sync all resources
POST   /external-resources/fetch-specific   - Sync specific resource
POST   /external-resources/fetch-sync       - Trigger sync
```

#### Featured Books
```
GET    /featured-books          - Get featured books
POST   /featured-books          - Add featured book
DELETE /featured-books/:id      - Remove featured book
PUT    /featured-books/reorder  - Reorder books
```

#### Logs
```
GET    /logs                    - Get system logs
GET    /logs/:type              - Get logs by type
```

### Error Handling

**Pattern**:
```javascript
try {
  const data = await ApiService.someMethod();
  return data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
    logout();
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle generic error
    showNotification("Error occurred", "error");
  }
  throw error;
}
```

---

## Routing Structure

### Route Configuration

```javascript
// Public Routes
/admin/login                        - Login page

// Protected Admin Routes (requires auth)
/admin/dashboard                    - Dashboard
/admin/resources                    - Resource list
/admin/resources/choose             - Choose resource type
/admin/resources/create/api         - Create API resource
/admin/resources/create/redirect    - Create redirect resource
/admin/resources/:id/edit/api       - Edit API resource
/admin/resources/:id/edit/redirect  - Edit redirect resource
/admin/featured-books               - Featured books management
/admin/logs                         - System logs

// Fallback
/*                                  - 404 Not Found
```

### Route Guards

**ProtectedRoute.jsx**:
- Checks authentication state
- Redirects to `/admin/login` if not authenticated
- Shows loading spinner during auth check

**RedirectIfAuthenticated**:
- Redirects authenticated users away from login
- Prevents accessing login when already logged in

---

## Form Management

### React Hook Form + Zod

**Pattern**:
```javascript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  url: z.string().url("Invalid URL"),
});

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
};
```

### Complex Forms (API Resource Creation)

**Multi-Section Form**:
1. Basic Information (name, status, category)
2. API Configuration (base URL, endpoints)
3. Authentication Configuration (auth type, credentials)
4. Field Mapping (map external fields to internal schema)
5. Media (logo, banner, page URL)

**Features**:
- Section-by-section validation
- Dynamic field addition (endpoints, headers)
- Real-time validation feedback
- Submit all sections as single request

---

## UI Components Architecture

### Component Categories

#### 1. Layout Components
- **AdminLayout**: Main admin layout with sidebar
- **Sidebar**: Navigation sidebar
- **LayoutWrapper**: Root layout wrapper

#### 2. Page Components
- Specific to individual pages
- Located in `components/page_components/`
- Example: `LogContainer`, `MetricCard`

#### 3. UI Primitives
- Reusable across application
- Located in `components/ui/`
- Examples: `LoadingState`, `ErrorState`, `Pagination`

### Component Design Patterns

#### Loading States
```javascript
<LoadingState />           // Full page loading
<LoadingSkeletonState />   // Skeleton placeholders
<LogoLoading />            // Logo with spinner
```

#### Error States
```javascript
<ErrorState 
  message="Failed to load data"
  onRetry={() => refetch()}
/>
```

#### Empty States
```javascript
<NoDataFoundState 
  message="No resources found"
  actionLabel="Create Resource"
  onAction={() => navigate("/create")}
/>
```

---

## Performance Optimizations

### 1. Code Splitting
- Route-based splitting via React Router
- Lazy loading of heavy components

### 2. React Query Caching
- Prevents redundant API calls
- Background refetching for fresh data
- Stale-while-revalidate pattern

### 3. Debouncing
- Search inputs debounced (500ms)
- Reduces API calls on user typing

### 4. Pagination
- Large lists paginated (10/25/50 per page)
- Reduces initial load time

### 5. Image Optimization
- Lazy loading images
- Default fallback images
- Optimized image formats

---

## Security Considerations

### 1. Authentication
- JWT tokens with expiration
- Token verification on app load
- Automatic logout on token expiry

### 2. Route Protection
- All admin routes protected
- Redirect to login if not authenticated

### 3. API Security
- All API calls include auth headers
- CORS properly configured
- Input validation on forms

### 4. XSS Prevention
- React auto-escapes content
- Sanitize user inputs
- CSP headers (if configured)

---

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env
npm run dev
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_TEST_MODE=false  # Enable test mode bypass
```

### Building
```bash
npm run build        # Production build
npm run preview      # Preview build locally
```

### Linting
```bash
npm run lint         # Run ESLint
```

---

## Testing Strategy (Recommended)

### 1. Unit Tests
- Test utility functions
- Test custom hooks in isolation
- Test component logic

### 2. Integration Tests
- Test form submissions
- Test authentication flow
- Test API integration

### 3. E2E Tests
- Test complete user workflows
- Test admin dashboard interactions
- Test resource CRUD operations

**Tools**: Vitest + React Testing Library + Playwright

---

## Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
Set production API URL in `.env`:
```env
VITE_API_BASE_URL=https://api.production.com/api/v1
```

### Web Server Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name admin.valace.com;
    root /var/www/admin/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Files to Clean Up

### Recommended Removals

#### 1. Old/Test Files
```
src/components/ui/CoverCard_old.jsx
src/pages/Dashboard_old.jsx
src/pages/TestPage.jsx
src/hooks/test/useTestPing.js
```

#### 2. Unused Search Page Components
If not used in admin:
```
src/components/page_components/search_page/*
```

#### 3. Legacy Routes
Remove TestPage route from `AppRoute.jsx`:
```javascript
<Route path="test" element={<TestPage />} />
```

---

## Future Enhancements

### 1. Features
- **Bulk Operations**: Bulk resource sync, delete
- **Advanced Analytics**: More detailed charts and metrics
- **User Management**: Multiple admin users with roles
- **Audit Trail**: Track all admin actions
- **Export Data**: Export resources, logs as CSV/JSON

### 2. Developer Experience
- **TypeScript Migration**: Type safety
- **Storybook**: Component documentation
- **Unit Tests**: Comprehensive test coverage
- **CI/CD**: Automated testing and deployment

### 3. Performance
- **Virtual Scrolling**: For large log/resource lists
- **Web Workers**: For heavy data processing
- **Service Worker**: Offline support

### 4. UX Improvements
- **Dark Mode**: Theme toggle
- **Keyboard Shortcuts**: More shortcuts for common actions
- **Drag & Drop**: Reorder resources, featured books
- **Notifications**: Real-time toast notifications

---

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
- Check backend is running
- Verify API_BASE_URL in `.env`
- Check token in localStorage
- Verify CORS settings on backend

#### 2. Build Failures
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18.x+)
- Review vite.config.js

#### 3. API Connection Issues
- Verify backend API is running
- Check network tab in browser DevTools
- Verify credentials and auth headers

---

## References

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Recharts](https://recharts.org/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-22  
**Maintained By**: Development Team
