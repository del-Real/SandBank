# SandBank - Presentation Diagram

This document describes the implemented presentation layer as it exists now, not an aspirational design system.

## UI Component Hierarchy

```mermaid
graph TD
    App[App.tsx]
    App --> Router[BrowserRouter]
    Router --> AuthProvider[AuthProvider]
    AuthProvider --> Header[Nav header]
    AuthProvider --> Main[main.main-content]

    Header --> Left[Logo link]
    Header --> Center[Primary links]
    Header --> Right[User name / logout]

    Main --> Routes[Routes]
    Routes --> Home[Home]
    Routes --> Login[Login]
    Routes --> Register[Register]
    Routes --> Activities[ActivitiesList]
    Routes --> ActivityForm[ActivityForm]
    Routes --> MyRequests[MyRequests]
    Routes --> IncomingRequests[IncomingRequests]
    Routes --> History[TransactionHistory]
    Routes --> BuyCredits[BuyCredits]
    Routes --> Admin[AdminPanel]
```

## Layout Skeleton

```mermaid
graph TD
    Viewport[Viewport]
    Viewport --> Header[Sticky header]
    Viewport --> MainArea[Scrollable page content]

    Header --> NavLeft[Left: logo]
    Header --> NavCenter[Center: route links]
    Header --> NavRight[Right: account actions]

    MainArea --> PageHeader[Optional page header row]
    MainArea --> PageBody[Page-specific content]
```

## Page Composition

```mermaid
flowchart TB
    subgraph HomePage[Home]
        HomeHero[Hero banner]
        HomeHeader[Recent Activities header]
        HomeGrid[Recent activities grid]
    end

    subgraph ActivitiesPage[ActivitiesList]
        ActivityHeader[Page header + New Activity button]
        Filters[Title + max price filters]
        ActivityGrid[Activity cards]
        ActivityActions[Edit, Delete, Request]
    end

    subgraph ActivityFormPage[ActivityForm]
        FormTitle[New Activity or Edit Activity]
        TitleField[Title]
        DescriptionField[Description]
        PriceField[Price in tokens]
        DateField[Start date]
        FormButtons[Save/Create + Cancel]
    end

    subgraph RequestPages[Requests]
        MyReqHeader[My Requests + Incoming button]
        MyReqCards[Request cards]
        RatingForm[Rating stars + review]
        IncomingHeader[Incoming Requests]
        IncomingCards[Accept / Reject / Mark Complete]
    end

    subgraph HistoryPage[TransactionHistory]
        HistoryHeader[History + Balance + Buy button]
        HistoryCards[Transaction cards]
    end

    subgraph CreditsPage[BuyCredits]
        CreditsHeader[Buy Time Credits]
        StatusBadge[Success or cancelled badge]
        PackGrid[Starter / Standard / Pro pack cards]
    end

    subgraph AdminPage[AdminPanel]
        AdminHeader[Admin Panel]
        TabBar[Stats / Users / Activities / Transactions / Ratings]
        AdminTables[Cards and data tables]
    end

    subgraph AuthPages[Login and Register]
        LoginForm[Email + password form]
        RegisterForm[Email + username + password form]
    end
```

## Presentation Responsibilities

| Layer           | What it currently owns                                             |
| --------------- | ------------------------------------------------------------------ |
| `App.tsx`       | Header, routes, and top-level composition                          |
| Page components | Most fetching, mutation handling, empty states, and action buttons |
| `AuthContext`   | Session persistence and auth state                                 |
| API wrappers    | HTTP request boundaries                                            |
| CSS files       | Tokens, layout, cards, forms, badges, and admin tables             |

## Data Flow in the Frontend

```mermaid
flowchart LR
    AuthCtx[AuthContext] --> Pages[Pages]
    Pages --> APIModules[API modules]
    AuthCtx --> Axios[axiosInstance adds bearer token]
    APIModules --> Axios
    Axios --> Backend[(FastAPI backend)]
```

## Visual Patterns

### Activity card

```text
+--------------------------------+
| Title                          |
| Description                    |
| Price: N                       |
| [Edit] [Delete] or [Request]   |
+--------------------------------+
```

### Request / transaction card

```text
+--------------------------------+
| Primary line                   |
| Supporting text                |
| Date / status badge            |
| Action button(s) if available  |
+--------------------------------+
```

### Form card

```text
+--------------------------------+
| Form title                     |
| Label                          |
| [Input / textarea]             |
| Label                          |
| [Input / textarea]             |
| [Primary] [Secondary]          |
+--------------------------------+
```

## Responsive Behavior

| Area                          | Current behavior                                                 |
| ----------------------------- | ---------------------------------------------------------------- |
| Root container                | Constrained to 1100px with fluid shrink on smaller screens       |
| Activities grid               | Uses auto-fill grid and collapses naturally as width shrinks     |
| Filters                       | Wrap onto multiple lines                                         |
| Header links                  | Remain in a horizontal nav; there is no hamburger menu component |
| Request and transaction lists | Stack vertically                                                 |

## Design Tokens

The application defines its visual language through CSS custom properties in `index.css`:

| Token            | Value               | Usage                       |
| ---------------- | ------------------- | --------------------------- |
| `--text`         | `#4b5563`           | Body text                   |
| `--text-h`       | `#111827`           | Headings and emphasis       |
| `--text-muted`   | `#9ca3af`           | Secondary text              |
| `--bg`           | `#fafafa`           | Page background             |
| `--bg-card`      | `#ffffff`           | Card surfaces               |
| `--border`       | `#d0d0d0`           | Borders and dividers        |
| `--accent`       | `#ffcc86`           | Primary buttons and links   |
| `--accent-hover` | `#ffeba8`           | Button hover state          |
| `--success`      | `#10b981`           | Positive actions and badges |
| `--danger`       | `#ef4444`           | Destructive actions         |
| `--warning`      | `#f59e0b`           | Pending states              |
| `--radius`       | `8px`               | Default border radius       |
| `--radius-lg`    | `12px`              | Card border radius          |
| `--sans`         | Inter, system-ui, … | Primary typeface            |

## CSS Architecture

| File        | Scope                                                          |
| ----------- | -------------------------------------------------------------- |
| `index.css` | CSS reset, tokens, global element styles, utility classes      |
| `App.css`   | Header, page layouts, cards, forms, admin tables, credits grid |

There is no CSS-in-JS, CSS modules, or utility-class framework. All styling is plain CSS using the custom properties above.

## Implementation Notes

- The frontend mixes direct page-level data fetching with a small set of custom hooks; hooks are not the only data access pattern.
- There is no dedicated profile page in the current route set.
- The credits screen is a pack selector that redirects to Stripe, not a form-heavy checkout page rendered inside the app.
- The root container is constrained to `1100px` max-width for readability on wide displays.
