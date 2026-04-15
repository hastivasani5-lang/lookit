# Theme System Implementation

## Overview
A complete theme management system has been integrated into the application that allows users to:
1. Switch between light and dark modes
2. Customize the primary color for buttons and UI components
3. Customize the background color (in dark mode)
4. Toggle between LTR and RTL text directions
5. Reset all settings to defaults

## Architecture

### Components

#### 1. **ThemeProvider** (`src/components/ThemeProvider.tsx`)
- Client-side context provider that manages theme state globally
- Automatically persists theme settings to localStorage
- Initializes theme on app load
- Exports `useTheme()` hook for accessing/modifying theme

**Usage:**
```tsx
const { settings, setThemeMode, setPrimaryColor, resetToDefaults } = useTheme();

// Change theme
setThemeMode('dark');
setPrimaryColor('#1ec28e');
```

#### 2. **FloatingSettingsButton** (`src/components/FloatingSettingsButton.tsx`)
- UI component for theme customization
- Provides toggles for light/dark mode and LTR/RTL
- Color picker for primary color customization
- Preset color options for quick selection
- Reset all button to restore defaults

### Storage & Persistence

#### Frontend (Local Storage)
- Key: `lookit-theme-settings`
- Stores: `{ themeMode, primaryColor, backgroundColor, direction }`
- Automatically synced on every change

#### Backend (Optional)
- **File Storage**: `data/themes.json`
- Persists user theme preferences server-side
- Enables sync across devices if user is authenticated

### API Routes

#### `GET /api/theme/get`
Retrieves theme settings for authenticated user
- Query param: `userId` (optional)
- Returns: Theme settings object

#### `POST /api/theme/save`
Saves theme settings for authenticated user
- Body: `{ themeMode, primaryColor, backgroundColor, direction, userId }`
- Returns: Saved settings object

#### `DELETE /api/theme/:userId`
Deletes theme settings for a user

### CSS Variables

All theme values are exposed as CSS custom properties:

```css
:root {
  --primary-color: #1ec28e;           /* Primary brand color */
  --primary-rgb: 30, 194, 142;         /* RGB version for transparency */
  --page-background: #f4f8f7;          /* Page background color */
  --page-foreground: #0f172a;          /* Text/foreground color */
}
```

These are automatically updated when theme settings change.

## Implementation Details

### How Light/Dark Mode Works
1. Sets `data-theme` attribute on `<html>` element
2. Toggles between CSS color schemes
3. Updates body background and text colors
4. All components can use `var(--page-background)` and `var(--page-foreground)`

### How Primary Color Customization Works
1. Updates `--primary-color` CSS variable globally
2. Automatically applies to buttons styled with the primary color
3. Elements should use `var(--primary-color)` in their Tailwind classes
4. Provides RGB version (`--primary-rgb`) for opacity/rgba values

### How Direction (LTR/RTL) Works
1. Sets `dir` attribute on `<html>` element
2. CSS and JS components can use this to adjust layout
3. Resets on app load or when user changes preference

## Integration with Existing Components

### Using the Theme in Components

**Example - Custom Button:**
```tsx
import { useTheme } from "@/components/ThemeProvider";

export function MyButton() {
  const { settings } = useTheme();
  
  return (
    <button
      style={{ backgroundColor: settings.primaryColor }}
      className="px-4 py-2 text-white rounded"
    >
      Click me
    </button>
  );
}
```

**Example - Using CSS Variables (Tailwind):**
```tsx
<button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded">
  Click me
</button>
```

## Default Settings

```typescript
{
  themeMode: "light",
  primaryColor: "#1ec28e",
  backgroundColor: "#0f172a",
  direction: "ltr"
}
```

## Storage Structure

### localStorage
```json
{
  "themeMode": "dark",
  "primaryColor": "#1ec28e",
  "backgroundColor": "#0f172a",
  "direction": "ltr"
}
```

### data/themes.json (Backend)
```json
[
  {
    "userId": "user-123",
    "settings": {
      "themeMode": "dark",
      "primaryColor": "#1ec28e",
      "backgroundColor": "#0f172a",
      "direction": "ltr"
    },
    "updatedAt": "2026-04-15T12:00:00.000Z"
  }
]
```

## Key Features

✅ **Persistence** - Theme settings persist across page reloads
✅ **Real-time Updates** - Changes apply immediately to the UI
✅ **Backend Sync** - Optional server-side persistence for authenticated users
✅ **No Breaking Changes** - Existing components work without modification
✅ **CSS Variables** - Easy to implement in any component using CSS
✅ **Context API** - Centralized state management
✅ **LocalStorage Support** - Works offline
✅ **Reset Functionality** - One-click reset to defaults

## Testing

1. Click the settings icon (floating button on right side)
2. Toggle between Light/Dark theme
3. Click different color presets
4. Adjust background color using the color picker
5. Reload the page - settings should persist
6. Click "Reset All" to restore defaults

## Files Modified/Created

### New Files
- `src/lib/theme-store.ts` - Theme utilities and storage logic
- `src/lib/theme-persistence.ts` - Backend theme persistence
- `src/components/ThemeProvider.tsx` - Theme context provider
- `src/app/api/theme/get/route.ts` - Theme API endpoint
- `src/app/api/theme/save/route.ts` - Theme save API endpoint

### Modified Files
- `src/components/FloatingSettingsButton.tsx` - Integrated with ThemeProvider
- `src/app/layout.tsx` - Wrapped with ThemeProvider
- `src/app/globals.css` - Added CSS variables

## Future Enhancements

- [ ] User profile integration to sync themes across devices
- [ ] More preset color schemes
- [ ] Font size customization
- [ ] Component-specific theme overrides
- [ ] Export/import theme settings
- [ ] Theme scheduling (auto-switch at specific times)
