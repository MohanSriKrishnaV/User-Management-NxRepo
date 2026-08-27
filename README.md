# User Management

An Angular and NgRx user management application built in an Nx monorepo. The application provides mocked authentication, a responsive user dashboard, and CRUD operations backed by `json-server`.

## Features

- Mock login with required username and password fields.
- Protected user-management routes using an NgRx-backed auth guard.
- User directory loaded from a local REST API.
- Create users with required `username`, `email`, and `jobRole` fields.
- Edit existing users through the same reusable form.
- Delete users through the NgRx store with an in-app confirmation dialog.
- Toast notifications for successful and failed API operations.
- Responsive dashboard layout with a sidebar, user identity panel, navigation, and logout.
- Deloitte-inspired green, charcoal, white, and neutral gray visual theme.

## Technology Stack

- Angular 20
- TypeScript
- NgRx Store and Effects
- Nx 23
- RxJS
- `json-server` for the mocked backend
- SCSS for component and responsive styling
- Karma/Jasmine for Angular application tests
- Jest for Nx library tests

## Requirements

Install the following before starting:

- Node.js 18 or newer
- npm

Confirm the installed versions:

```bash
node --version
npm --version
```

## Installation

Install dependencies from the repository root:

```bash
npm install
```

## Running the Application

The application has two processes:

1. Angular development server on port `4200`.
2. JSON Server mock API on port `3000`.

The easiest option is to start both together:

```bash
npm run start:all
```

Open the application at:

```text
http://localhost:4200
```

To run each process separately:

```bash
npm run api
```

In another terminal:

```bash
npm start
```

The Angular server uses the development configuration and automatically rebuilds when source files change.

## Mock API

The mock database is stored in `db/db.json`. JSON Server exposes the following resource:

```text
GET    http://localhost:3000/users
POST   http://localhost:3000/users
PUT    http://localhost:3000/users/:id
DELETE http://localhost:3000/users/:id
```

The application uses `UsersService` for HTTP access. Components do not call `HttpClient` directly. User effects listen for store actions, call the service, and dispatch success or failure actions.

The application API base URL is configured in:

```text
apps/user-management/src/app/environments/environments.ts
```

For the local JSON Server setup it is:

```ts
apiUrl: 'http://localhost:3000'
```

## Authentication

Authentication is intentionally mocked because the assessment does not require a real authentication backend.

Use these credentials:

```text
Username: admin
Password: admin
```

The login flow is implemented in `libs/auth/data-access`:

1. The login form validates that both fields are present.
2. The form dispatches the `[Auth] Login` action.
3. `AuthEffects` validates the mock credentials.
4. A successful login stores `isLoggedIn=true` in `localStorage`.
5. The auth reducer exposes `selectIsAuthenticated`.
6. The route guard redirects unauthenticated users to `/login`.
7. Logout clears the store state and local storage, then redirects to `/login`.

This is not production authentication. A real application should validate credentials on a server and use secure session or token handling.

## Application Routes

| Route | Purpose | Protected |
| --- | --- | --- |
| `/login` | Mock login page | No |
| `/users` | User directory dashboard | Yes |
| `/post-users` | Create user form | Yes |
| `/edit-users/:id` | Edit user form | Yes |

Unknown routes redirect to `/login`.

## NgRx Architecture

### Auth data-access library

Located in `libs/auth/data-access`.

- `auth.actions.ts`: login, login success, login failure, and logout actions.
- `auth.reducer.ts`: authenticated state and authentication errors.
- `auth.effects.ts`: mock credential validation and local storage persistence.
- `src/index.ts`: public library exports used by the application.

### Users data-access library

Located in `libs/users/data-access`.

- `models/user.model.ts`: shared user contract.
- `services/users.service.ts`: HTTP client for JSON Server.
- `store/users.actions.ts`: load, add, update, and delete actions.
- `store/users.reducer.ts`: user collection, loading state, and errors.
- `store/users.effects.ts`: API calls and success/error toast notifications.
- `src/index.ts`: public library exports.

The shared user shape is:

```ts
interface User {
	id?: number;
	username: string;
	email: string;
	jobRole: 'tech' | 'id' | 'gd' | 'qa';
}
```

### Feature libraries

- `libs/users/feature-user-list`: dashboard, user directory, edit/delete actions, sidebar, and delete confirmation dialog.
- `libs/users/feature-user-form`: create/edit form with shared validation and navigation.
- `libs/auth/feature-login`: reserved auth feature library structure.
- `libs/shared/ui`: reusable toast component and toast service.

The root application registers the feature states and effects in `app.config.ts`:

```ts
provideStore();
provideState(usersFeature);
provideState(authFeature);
provideEffects(UsersEffects, AuthEffects);
```

## User Workflows

### Create

1. Sign in with the mock credentials.
2. Open **Add user** from the sidebar or dashboard header.
3. Enter a username, valid email, and job role.
4. Submit the form.
5. The form dispatches `addUser`.
6. The effect sends `POST /users`.
7. The reducer adds the returned user and a success toast is shown.
8. The application returns to `/users`.

### Edit

1. Select **Edit** on a user row.
2. The route includes the selected user ID.
3. The form loads the user collection and patches the matching user into the form.
4. Submit the updated fields.
5. The effect sends `PUT /users/:id`.
6. The reducer replaces the matching user and displays a success toast.

### Delete

1. Select **Delete** on a user row.
2. Confirm in the custom in-app dialog.
3. The effect sends `DELETE /users/:id`.
4. The reducer removes the user after a successful response.
5. A success or error toast communicates the result.

## Validation and Accessibility

- Reactive Forms use `Validators.required` for all mandatory fields.
- Email fields also use `Validators.email`.
- Native `required` and `aria-required` attributes are present on form controls.
- Validation messages use `role="alert"`.
- Navigation uses semantic links and `nav` landmarks.
- The delete confirmation uses `role="alertdialog"` and `aria-modal="true"`.
- Mobile controls use touch-friendly sizing and avoid horizontal page overflow.

## Styling

The visual system is defined in `apps/user-management/src/styles.scss` and reused by feature styles:

- `--brand-green`: primary action and active-state color.
- `--ink`: sidebar and high-contrast text color.
- `--surface`: panels and form surfaces.
- `--page`: neutral page background.
- `--danger`: validation, deletion, and error states.

The layout adapts at mobile breakpoints. On desktop, the sidebar remains anchored while the main content can scroll naturally. On small screens, the sidebar becomes a stacked navigation area and user-row actions become a full-width action strip.

## Build

Build the application in development mode:

```bash
npx nx build user-management --configuration development
```

Build the default production configuration:

```bash
npm run build
```

Build output is written to `dist/user-management`.

## Testing

Run all configured Nx tests:

```bash
npm test
```

Run the application tests directly:

```bash
npx nx test user-management --watch=false
```

Run an individual library test target:

```bash
npx nx test feature-user-list
npx nx test feature-user-form
npx nx test data-access
```

The Angular application test target uses Karma and expects a Chrome or Chromium binary. In a container without Chrome, the test build can complete but the browser-launch step will fail until `CHROME_BIN` is configured or Chrome is installed.

Run linting across the workspace:

```bash
npm run lint
```

## Useful Nx Commands

```bash
npx nx graph
npx nx show project user-management
npx nx show projects
```

`nx graph` is useful for reviewing the dependency relationships between the application and libraries.

## Project Structure

```text
apps/
	user-management/
		src/app/
			auth/                 # Route guard
			environments/         # API environment values
			login/                # Login page
			app.config.ts         # Providers and NgRx registration
			app.routes.ts         # Application routes

libs/
	auth/
		data-access/            # Auth actions, reducer, effects
		feature-login/          # Auth feature library
	shared/
		ui/                     # Shared toast component/service
	users/
		data-access/            # User model, service, store, effects
		feature-user-form/      # Create/edit form
		feature-user-list/      # Dashboard and user directory

db/
	db.json                   # JSON Server database
```

## Design Decisions

- Authentication and user state are managed through NgRx to keep state transitions explicit and testable.
- HTTP responsibilities remain in data-access services, while effects coordinate asynchronous API operations.
- The create and edit flows reuse one form component to avoid duplicated validation and UI behavior.
- The mock API is intentionally local and replaceable through the environment API URL.
- Toast notifications are provided by the shared UI library so API feedback is consistent across features.
- The UI uses a responsive dashboard layout rather than nested list scrolling, allowing the page to grow naturally as users are added.
