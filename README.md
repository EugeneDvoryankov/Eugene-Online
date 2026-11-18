# Eugene-Online project repository

## Directory Structure
```
./
├─ client/ # Vue 3 frontend
│ ├─ public/ # Static assets
│ ├─ src/
│ │ ├─ components/
│ │ ├─ router/
│ │ ├─ services/
│ │ ├─ types/
│ │ └─ views/
│ ├─ .env
│ └─ .env.production
├─ server/ # Express backend
│ ├─ src/
│ │ ├─ db/
│ │ ├─ middlewares/
│ │ ├─ model/
│ │ ├─ router/
│ │ └─ service/
│ │ └─ index.ts
│ │ └─ start.ts # Setup Express app
│ ├─ test/ # Unit & integration tests
│ └─ eslint.config.mjs # ESLint configuration file
├─ images/ # README images
├─ Dockerfile
├─ Dockerfile.production
├─ docker-compose.yaml # Development Docker Compose
└─ README.md
```


## Run project in development
### Run containers
`docker-compose up`

Access server with `localhost:8080`.

Without docker you can navigate into each project and run `npm run dev`.

## Run project in production
### Build production image
`docker build --tag eugene-online:latest --platform linux/amd64 -f Dockerfile.production .`

Add .env.production in /client with VITE_API_URL. Vite environment variables must be prefixed with "VITE_".

Add .env.production in top level folder with the fields in .env.example.

### Run production image locally
`docker run --rm --env-file .env --publish 3000:3000 eugene-online:latest`

## Run tests and linter
### Run tests
Running both unit tests and e2e tests.

/server: `npm run test`

/client: `npm run test:unit`

### Run linter
`npm run lint`

or install ESLint VSCode extension.

## API Overview
### Users
| Method | Path              | Description                     |
|------:|-------------------|---------------------------------|
| GET   | /users         | Get all users (admin)                  |
| GET   | /users/me       | Retrieve the logged in user           |
| GET   | /users/{id}       | Retrieve user by id (admin)           |
| PATCH  | /users/{id}            | Update user               |
| POST  | /users            | Create user               |
| POST  | /users/login            | Return user object if authenticated               |

### Products
| Method | Path              | Description                     |
|------:|-------------------|---------------------------------|
| GET   | /products         | Get all products                  |
| GET   | /products/{id}       | Retrieve product by id           |
| PATCH  | /products/{id}            | Update product (admin)               |
| POST  | /products            | Create product (admin)               |

### Orders
| Method | Path              | Description                     |
|------:|-------------------|---------------------------------|
| GET   | /orders         | Get all orders                  |
| GET   | /orders/me       | Retrieve orders that belong to the user           |
| GET   | /orders/{id}       | Retrieve order by id           |
| PATCH  | /orders/{id}            | Update order (admin)               |
| POST  | /orders            | Create order               |
| DELETE  | /orders/{id}            | Delete order               |

### Bookings
| Method | Path              | Description                     |
|------:|-------------------|---------------------------------|
| GET   | /bookings?from={date}&to={date}         | Get all bookings with optional query parameters<br>{date} = ISO8601 date                  |
| GET   | /bookings/{id}       | Retrieve booking by id           |
| POST  | /bookings            | Create booking               |
| DELETE| /bookings/{id}       | Delete booking by id                   |

### Blogs
| Method | Path              | Description                     |
|------:|-------------------|---------------------------------|
| GET   | /blogs         | Get all blogs                  |
| GET   | /blogs/{id}       | Retrieve blog by id           |
| POST  | /blogs            | Create blog (admin)               |
