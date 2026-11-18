# Eugene-Online

Eugene-Online is a bilingual website for web development and IT consulting. Visitors can browse services, view the blog, and book consultations. Customers can sign in to manage their bookings and orders. The site opens in English and also supports Swedish.

[Visit Eugene-Online](https://eugene-online.com/)

## Project layout

| Path | Purpose |
| --- | --- |
| `client/` | Vue 3, TypeScript, and Vite frontend |
| `server/` | Express API with Sequelize and PostgreSQL |
| `docker-compose.yaml` | Local development services |
| `Dockerfile.production` | Production build with Express serving the Vue app |
| `render.yaml` | Render Blueprint for the web service and database |

## Run locally

Install Docker with Docker Compose. From the repository root, copy the server environment template.

```sh
cp .env.example .env
```

Edit the root `.env` and set the following values. Replace the password placeholder with a local development password.

```dotenv
API_PORT=8080
POSTGRES_USERNAME=eugene_online
POSTGRES_PASSWORD=replace-with-a-local-password
POSTGRES_HOST=database
POSTGRES_DB=eugene_online
```

Create `client/.env` with the local API address.

```dotenv
VITE_API_URL=http://localhost:8080/api
```

Start the development containers.

```sh
docker compose up --build
```

Open [the frontend](http://localhost:5173/). The API is at [localhost:8080/api](http://localhost:8080/api).

## Test and build

Install Node.js 24 and run these commands from the repository root.

```sh
npm --prefix client ci
npm --prefix server ci
npm --prefix client run test:unit -- --run
npm --prefix server run test -- --run
npm --prefix client run build
npm --prefix server run build
```

## Production deployment

The Render Blueprint in `render.yaml` configures a Docker web service and a managed PostgreSQL database. Render supplies the private database connection as `DATABASE_URL`. The frontend uses the same-origin `/api` path in the production image.

Keep actual credentials in local environment files or in the hosting provider's environment settings. Use placeholders in any committed `.env.example` file.

## API overview

API routes use the `/api` prefix.

| Resource | Base path | Operations |
| --- | --- | --- |
| Users | `/api/users` | Register, sign in, and manage accounts |
| Products | `/api/products` | Browse services and manage the service catalog |
| Orders | `/api/orders` | Create, view, update, and delete orders with the appropriate permissions |
| Bookings | `/api/bookings` | View availability, create bookings, and manage existing bookings |
| Blog | `/api/blogs` | Read and manage posts |
