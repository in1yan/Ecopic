# EcoPick Routing Documentation

## Overview
The application now uses React Router for proper client-side routing with URL-based navigation.

## Routes Structure

### Public Routes
- `/` → Redirects to `/auth`
- `/auth` → Login/Register page
- `*` → Catch-all redirects to `/auth`

### Protected Routes (Require Authentication)
All app routes are under `/app` and protected by authentication:

- `/app` → Home page with feature scroll
- `/app/dashboard` → Dashboard overview page
- `/app/machines` → Machines monitoring page
- `/app/workers` → Workers management page
- `/app/weather` → Weather station page
- `/app/ecoconnect` → EcoConnect support page

## Key Components

### 1. **AppLayout** (`src/layouts/AppLayout.tsx`)
- Wraps all protected pages
- Includes the Header and AuroraBackground
- Handles logout and feature navigation
- Uses `<Outlet />` to render child routes

### 2. **ProtectedRoute** (`src/routes/ProtectedRoute.tsx`)
- Checks authentication status
- Redirects to `/auth` if not authenticated
- Shows loading state while checking auth

### 3. **Router Configuration** (`src/routes/index.tsx`)
- Defines all application routes
- Implements route protection
- Handles nested routing for app pages

## Navigation Methods

### From Any Component
```typescript
import { useNavigate } from 'react-router-dom';

const Component = () => {
  const navigate = useNavigate();
  
  // Navigate to different pages
  navigate('/app/dashboard');
  navigate('/app/machines');
  navigate('/app'); // Go to home
  navigate(-1); // Go back
};
```

### From Header Component
The Header now receives `onSelectFeature` which maps feature IDs to routes:
```typescript
const routeMap = {
  dashboard: '/app/dashboard',
  machines: '/app/machines',
  workers: '/app/workers',
  weather: '/app/weather',
  news_station: '/app/ecoconnect',
};
```

## Authentication Flow

1. **Initial Load:**
   - App checks for auth token
   - If authenticated → redirect to `/app`
   - If not → stays on `/auth`

2. **After Login/Register:**
   - Store auth token
   - Navigate to `/app`

3. **After Logout:**
   - Clear auth token
   - Navigate to `/auth`

4. **Accessing Protected Route:**
   - Check authentication
   - If valid → render page
   - If invalid → redirect to `/auth`

## Benefits

✅ **Browser History** - Back/forward buttons work properly
✅ **Bookmarkable URLs** - Users can bookmark specific pages
✅ **Shareable Links** - Can share direct links to pages
✅ **Better SEO** - Search engines can index different pages
✅ **Cleaner Code** - No more conditional rendering logic
✅ **Type Safety** - Full TypeScript support with proper types

## Migration Notes

### What Changed:
1. **Removed:** Modal-based page navigation
2. **Removed:** `onNavigate` props from page components
3. **Added:** React Router DOM v7
4. **Added:** Proper route protection with `ProtectedRoute`
5. **Added:** Nested routing with layout components

### Page Components Updated:
- `DashboardPage.tsx` - No changes needed (already standalone)
- `MachinesPage.tsx` - Removed `onNavigate` prop, added `useNavigate`
- `WorkersPage.tsx` - Removed `onNavigate` prop, added `useNavigate`
- `WeatherPage.tsx` - Removed `onNavigate` prop, added `useNavigate`
- `EcoConnectPage.tsx` - Removed `onNavigate` prop, added `useNavigate`

### Components Updated:
- `App.tsx` - Now uses `RouterProvider`
- `Auth.tsx` - Uses `useNavigate` for redirect after login
- `MainApp.tsx` - Simplified to just render feature scroll
- `AppLayout.tsx` - New layout wrapper for all app pages

## Usage Examples

### Navigate on Button Click
```typescript
<button onClick={() => navigate('/app/dashboard')}>
  Go to Dashboard
</button>
```

### Navigate After Action
```typescript
const handleSubmit = async () => {
  await saveData();
  navigate('/app/workers');
};
```

### Navigate with State
```typescript
navigate('/app/dashboard', { 
  state: { message: 'Worker added successfully' } 
});
```

### Access Route Params
```typescript
import { useParams } from 'react-router-dom';

const Component = () => {
  const { id } = useParams();
  // Use id parameter
};
```

## Future Enhancements

- Add route-based code splitting with `React.lazy()`
- Implement route-level error boundaries
- Add loading states for route transitions
- Add route-based animations
- Implement breadcrumb navigation
- Add query parameter handling for filters

## Testing Routes

To test the routing:
1. Start the app: `pnpm dev`
2. Login/Register at `/auth`
3. Navigate between pages using header
4. Try browser back/forward buttons
5. Bookmark a page and revisit
6. Manually enter URLs in browser

All routes should work correctly with proper authentication checks!
