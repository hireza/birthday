# Birthday Project

[![License](https://img.shields.io/github/license/hireza/birthday)](https://github.com/hireza/birthday/blob/master/LICENSE)
[![Language](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)](https://github.com/hireza/birthday)
[![Lines](https://img.shields.io/endpoint?url=https%3A%2F%2Fghloc.vercel.app%2Fapi%2Fhireza%2Fbirthday%2Fbadge&color=blue)](https://github.com/hireza/leetcode)

The **Birthday Project** is a TypeScript Node.js-based application designed to manage birthday messages. It leverages the following technology stack:

- **PostgreSQL** for data persistence
- **Temporal** for task scheduling and workflow orchestration
- **TypeScript** for robust and scalable application development
- **Node.js** as the runtime environment

## 🏃 How to Run

**1.** Start the application:

```bash
$ make start
```

**2.** Apply database migrations:

```bash
$ make migrate
```

## 🧪 How to Test

You can run the tests provided in the repository to ensure the application is functioning as expected. Use the following command:

```bash
$ make test
```

## 🗒️ Service Explanation

- **Birthday Message Service**: Accessible at `http://localhost:3000`
- **Temporal Dashboard**: Accessible at `http://localhost:8080` to monitor the scheduler and view logs

## ▶️ How to Use

You can test the application using attached [**Postman**](https://github.com/hireza/birthday/blob/master/birthday.postman_collection.json) or [**Swagger**](https://github.com/hireza/birthday/blob/master/birthday.swagger.yaml). The services provide the following functionality:

### API Endpoints

| **Method** | **Endpoint** | **Parameters** | **Body**                                                                                                   | **Description**                               |
| ---------- | ------------ | -------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `POST`     | `/users`     | None           | `{ "email": "say@hireza.top", "full_name": "Reza", "birthday": "YYYY-MM-DD", "timezone": "Asia/Jakarta" }` | Create a user and schedule a birthday message |
| `PUT`      | `/users/:id` | `id`           | `{ "full_name": "Reza", "birthday": "YYYY-MM-DD", "timezone": "Asia/Jakarta" }`                            | Update a user and reschedule the message      |
| `DELETE`   | `/users/:id` | `id`           | None                                                                                                       | Delete a user and cancel the scheduler        |
| `GET`      | `/users/:id` | `id`           | None                                                                                                       | Retrieve user details                         |

Try on `http://localhost:3000`.

### Temporal UI

Visit `http://localhost:8080` to check the scheduler's status and logs.

## 🌲 Project Tree

The project follows a modular and organized structure to enhance maintainability and scalability. Below is the directory structure:

```plaintext
.
├── dynamicconfig            # Configuration files for Temporal
├── migrations               # Database migration scripts
├── src
│   ├── config               # Application configuration files
│   ├── connectors           # Interfaces to call external services
│   ├── handlers             # Handle input requests and output responses
│   ├── middlewares          # Middleware for tasks like authorization and 404 handling
│   ├── models               # Database models, e.g., for users
│   ├── repositories         # Database interaction logic
│   ├── routes               # API endpoint definitions
│   ├── usecases             # Business logic and endpoint workflows
│   ├── utils                # Helper functions and utilities
│   └── workflows            # Temporal workflows for scheduling and orchestration
├── *.postman_*.json         # Postman collection for API testing
├── *.swagger.yaml           # Swagger/OpenAPI documentation for API reference
├── docker-compose.yml       # Docker Compose configuration
├── dockerfile               # Dockerfile for building the application image
├── local.env                # Default environment configuration
├── makefile                 # Makefile for running common tasks
├── package.json             # Project dependencies and scripts
└── tests                    # Unit and integration test cases
```

### Directory Description

- **`dynamicconfig`**: Stores Temporal-related configuration files to define workflows and activities.
- **`migrations`**: Contains scripts for applying database schema changes and updates.
- **`src/config`**: Centralized configuration files for the application.
- **`src/connectors`**: Manages integration with external services and APIs.
- **`src/handlers`**: Processes and manages incoming HTTP requests and prepares outgoing responses.
- **`src/middlewares`**: Contains middleware for authorization and handling 404 or other errors.
- **`src/models`**: Defines data models, such as the user model, for interacting with the database.
- **`src/repositories`**: Encapsulates database queries and operations.
- **`src/routes`**: Maps HTTP methods and endpoint URLs to their corresponding handlers.
- **`src/usecases`**: Implements the core business logic and workflows of API endpoints.
- **`src/utils`**: Utility functions to support reusable operations across the project.
- **`src/workflows`**: Defines Temporal workflows for managing scheduled tasks and orchestrations.
- **`*.postman_*.json`**: Predefined Postman collection to test APIs interactively.
- **`*.swagger.yaml`**: Swagger/OpenAPI files for documenting and testing API endpoints.
- **`docker-compose.yml`**: Configures services for Docker Compose to orchestrate the application setup.
- **`dockerfile`**: Defines the Docker image for building and running the application.
- **`local.env`**: Stores default environment variables for local development.
- **`makefile`**: Defines shortcuts for running common commands like starting the app or applying migrations.
- **`package.json`**: Tracks project dependencies and NPM scripts for build and run tasks.
- **`tests`**: Contains all unit and integration test cases to validate functionality.

## 📝 Notes

Ensure you have all dependencies installed and proper environment variables configured before running the project. The Temporal UI at `http://localhost:8080` is particularly helpful for debugging and monitoring scheduled tasks.

## 💯 Test Coverage

[![Test Civerage](https://i.ibb.co.com/zfPzCnW/Screenshot-2025-01-05-at-21-44-54.png)]("")

## 📧 Contact

For questions or suggestions, feel free to reach out:

- **LinkedIn**: [@hireza](https://www.linkedin.com/in/hireza)
- **Email**: [say@hireza.top](mailto:say@hireza.top)

---

### ⭐ If you find this repository helpful, please give it a star
