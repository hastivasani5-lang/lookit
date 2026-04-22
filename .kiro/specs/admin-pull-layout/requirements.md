# Requirements Document

## Introduction

Redesign the AdminWorkspace component to use a "pull layout" — a collapsible drawer-style sidebar that can be toggled open and closed. The current fixed sidebar will be replaced with a sidebar that slides in/out, freeing up horizontal space for the main content area. The redesign preserves the existing neumorphism (neumorph) design language and Tailwind CSS styling, and incorporates the currently unused dashboard trend chart and today-table data into a richer Dashboard section.

## Glossary

- **AdminWorkspace**: The top-level admin panel layout component rendered at `/admin`.
- **PullSidebar**: The collapsible drawer-style sidebar that slides in from the left and can be toggled open or closed.
- **SidebarToggle**: The button or affordance used to open and close the PullSidebar.
- **MainContent**: The scrollable content area to the right of the PullSidebar that renders the active panel.
- **Overlay**: A semi-transparent backdrop rendered behind the PullSidebar when it is open on mobile viewports.
- **ActiveSection**: The currently selected navigation item that determines which panel is rendered in MainContent.
- **DashboardPanel**: The panel rendered when ActiveSection is "Dashboard", including stats, trend chart, and today-table.
- **TrendChart**: The SVG-based line chart rendered using the adminTrend* props.
- **TodayTable**: The paginated tabbed table rendered using the paginatedDashboardTodayRows and related props.
- **Neumorph**: The neumorphism visual style using soft shadows on a light green-tinted background (`#eef5f3`).

## Requirements

### Requirement 1: Collapsible Pull Sidebar

**User Story:** As an admin, I want to collapse and expand the sidebar, so that I have more horizontal space when working in content-heavy panels.

#### Acceptance Criteria

1. THE AdminWorkspace SHALL render a PullSidebar that is open by default on desktop viewports (≥ 768px) and closed by default on mobile viewports (< 768px).
2. WHEN the SidebarToggle is activated, THE PullSidebar SHALL transition between open and closed states using a CSS slide animation of 300ms or less.
3. WHILE the PullSidebar is open on desktop, THE MainContent SHALL be offset to the right by the sidebar width so no content is obscured.
4. WHILE the PullSidebar is closed on desktop, THE MainContent SHALL expand to use the full available width.
5. THE PullSidebar SHALL maintain the existing neumorph visual style including the `rounded-r-3xl` shape and `shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]` shadow.

### Requirement 2: Sidebar Toggle Control

**User Story:** As an admin, I want a clearly visible toggle button, so that I can open and close the sidebar without hunting for a control.

#### Acceptance Criteria

1. THE AdminWorkspace SHALL render a SidebarToggle button that is always visible regardless of PullSidebar state.
2. THE SidebarToggle SHALL be positioned in the top bar (header area) of the AdminWorkspace.
3. WHEN the PullSidebar is open, THE SidebarToggle SHALL display a "close/collapse" icon (e.g. ChevronLeft or X from lucide-react).
4. WHEN the PullSidebar is closed, THE SidebarToggle SHALL display an "open/expand" icon (e.g. Menu or ChevronRight from lucide-react).
5. THE SidebarToggle SHALL apply neumorph styling consistent with the existing admin button styles.

### Requirement 3: Mobile Overlay Behavior

**User Story:** As an admin on a mobile device, I want the sidebar to overlay the content rather than push it, so that the content area remains usable at small screen sizes.

#### Acceptance Criteria

1. WHEN the PullSidebar is opened on a mobile viewport (< 768px), THE AdminWorkspace SHALL render an Overlay behind the PullSidebar.
2. WHEN the Overlay is tapped or clicked, THE PullSidebar SHALL close.
3. WHILE the PullSidebar is open on mobile, THE MainContent SHALL remain in its full-width position and SHALL NOT be offset.
4. THE Overlay SHALL have a semi-transparent dark background (e.g. `bg-black/40`) and SHALL cover the full viewport.

### Requirement 4: Sidebar State Persistence

**User Story:** As an admin, I want the sidebar open/closed state to be remembered across navigation, so that I don't have to re-open it every time I switch sections.

#### Acceptance Criteria

1. THE AdminWorkspace SHALL persist the PullSidebar open/closed state in component-level state (React useState) for the duration of the session.
2. WHEN the ActiveSection changes, THE PullSidebar SHALL retain its current open/closed state.
3. WHEN the page is reloaded, THE AdminWorkspace SHALL restore the default open/closed state based on the current viewport width.

### Requirement 5: Dashboard Panel with Trend Chart and Today Table

**User Story:** As an admin, I want the Dashboard section to display the trend chart and today's activity table, so that I can see meaningful data instead of placeholder text.

#### Acceptance Criteria

1. WHEN ActiveSection is "Dashboard", THE DashboardPanel SHALL render the TrendChart using the adminTrend* props (series, width, height, padding, chartHeight, labels, chartWidth, path, points).
2. WHEN ActiveSection is "Dashboard", THE DashboardPanel SHALL render the TodayTable with tabs controlled by `todayTableActiveTab` and `setTodayTableActiveTab`.
3. THE TodayTable SHALL display rows from `paginatedDashboardTodayRows` and support pagination using `dashboardTodayCurrentPage`, `dashboardTodayTotalPages`, and `setDashboardTodayCurrentPage`.
4. IF `adminTrendPath` is an empty string or undefined, THEN THE DashboardPanel SHALL render a placeholder message in place of the TrendChart.
5. THE DashboardPanel SHALL maintain the existing stat cards (Students, Teachers, Awards) above the TrendChart.

### Requirement 6: Responsive Top Bar

**User Story:** As an admin, I want the top bar to remain functional and accessible at all screen sizes, so that search, notifications, and profile access are always available.

#### Acceptance Criteria

1. THE AdminWorkspace SHALL render a top bar containing the SidebarToggle, global search input, notification bell, and admin profile button.
2. WHILE the PullSidebar is open on mobile, THE top bar SHALL remain fully interactive and SHALL NOT be obscured by the Overlay.
3. THE top bar SHALL apply neumorph card styling consistent with the existing `shadow-[8px_8px_24px_#d0dbd6,-8px_-8px_24px_#ffffff]` style.
4. WHEN the global search input receives an Enter key event, THE AdminWorkspace SHALL call `handleGlobalSearch`.
