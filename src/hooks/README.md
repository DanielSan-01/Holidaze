# Hooks Organization

This directory contains all custom React hooks organized by functionality.

## Structure

```
src/hooks/
├── index.js              # Main export file - exports all hooks
├── auth/                 # Authentication-related hooks
│   ├── index.js         # Auth hooks exports
│   ├── AuthContext.jsx  # Auth context and useAuth hook
│   ├── useLogin.jsx     # Login functionality
│   └── useRegister.jsx  # Registration functionality
├── profile/             # User profile-related hooks
│   ├── index.js        # Profile hooks exports
│   └── useProfile.jsx  # Profile management
└── venues/             # Venue-related hooks
    ├── index.js        # Venue hooks exports
    ├── useVenues.jsx   # Venue fetching and management
    ├── useCreateVenue.js # Venue creation
    ├── useEditVenue.js # Venue editing and deletion
    └── useVenueRating.js # Venue rating (localStorage-based)
```

## Usage

### Import from main index (recommended)
```javascript
import { useAuth, useProfile, useVenues, useCreateVenue } from '../hooks';
```

### Import from specific categories
```javascript
import { useAuth } from '../hooks/auth';
import { useProfile } from '../hooks/profile';
import { useVenues, useCreateVenue } from '../hooks/venues';
```

### Import specific hooks directly
```javascript
import { useAuth } from '../hooks/auth/AuthContext.jsx';
import { useCreateVenue } from '../hooks/venues/useCreateVenue.js';
```

## Hook Categories

### Authentication (`auth/`)
- **useAuth**: Main authentication hook with login, logout, register
- **useLogin**: Specific login functionality
- **useRegister**: User registration functionality

### Profile (`profile/`)
- **useProfile**: User profile management, fetching, updating

### Venues (`venues/`)
- **useVenues**: General venue fetching and searching
- **useCreateVenue**: Venue creation with validation
- **useEditVenue**: Venue updating and deletion
- **useVenueRating**: Local venue rating system (localStorage-based due to API limitations)

## Migration Notes

All hooks have been moved from scattered locations to this centralized structure:
- `src/pages/create/hooks/` → `src/hooks/venues/`
- `src/hooks/useVenueRating.js` → `src/hooks/venues/useVenueRating.js`
- All import paths have been updated throughout the codebase

## Benefits

1. **Centralized**: All hooks in one location
2. **Organized**: Grouped by functionality
3. **Scalable**: Easy to add new hooks in appropriate categories
4. **Maintainable**: Clear structure and documentation
5. **Flexible imports**: Multiple import patterns supported 