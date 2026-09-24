# Hospital API

A REST API for managing hospital operations, built with NestJS, TypeScript, MongoDB, and Mongoose.

The API manages patients, doctors, departments, and appointments. Completing an appointment atomically updates its status and creates a medical record. It also provides schedule views and aggregate reports for operational dashboards.

## Features

- Patient, doctor, and department CRUD operations
- Text search for doctors by name or specialization
- Appointment creation with doctor and patient availability checks
- Appointment lifecycle: scheduled, completed, or cancelled
- Doctor schedules and patient appointment history
- Department statistics and appointment reporting
- Medical record creation when an appointment is completed
- DTO validation with `class-validator`
- Centralized handling of MongoDB duplicate-key errors

## Tech stack

- [NestJS](https://nestjs.com/) 11
- TypeScript
- MongoDB with [Mongoose](https://mongoosejs.com/)
- Jest and Supertest for testing
- ESLint and Prettier for code quality

## Requirements

- Node.js 20 or newer
- npm
- MongoDB 6 or newer

MongoDB must support transactions for `PATCH /appointments/:id/complete`. A replica set or a MongoDB Atlas deployment is recommended, including for local development.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/hospital-api?replicaSet=rs0
PORT=3000
```

`MONGODB_URI` is required by the application. `PORT` is optional and defaults to `3000`.

### 3. Start the API

```bash
# Development
npm run start:dev

# Standard start
npm run start

# Production
npm run build
npm run start:prod
```

The API is available at `http://localhost:3000` by default. The root endpoint returns `Hello World!` and can be used as a basic connectivity check:

```bash
curl http://localhost:3000
```

## API overview

All routes are relative to the server URL. IDs are MongoDB ObjectId values. Successful create, read, update, and delete operations return the relevant MongoDB document unless noted otherwise.

### Patients

| Method   | Route           | Description                |
| -------- | --------------- | -------------------------- |
| `POST`   | `/patients`     | Create a patient           |
| `GET`    | `/patients`     | List all patients          |
| `GET`    | `/patients/:id` | Get one patient            |
| `PATCH`  | `/patients/:id` | Partially update a patient |
| `DELETE` | `/patients/:id` | Delete a patient           |

Patient fields:

```json
{
  "name": "Jane Doe",
  "dateOfBirth": "1990-04-15",
  "phone": "+1-555-0100"
}
```

Patient responses include timestamps and a calculated `age` virtual.

### Doctors

| Method   | Route                      | Description                      |
| -------- | -------------------------- | -------------------------------- |
| `POST`   | `/doctors`                 | Create a doctor                  |
| `GET`    | `/doctors`                 | List all doctors                 |
| `GET`    | `/doctors/search?q=:query` | Search by name or specialization |
| `GET`    | `/doctors/:id`             | Get one doctor                   |
| `PATCH`  | `/doctors/:id`             | Partially update a doctor        |
| `DELETE` | `/doctors/:id`             | Delete a doctor                  |

Doctor fields:

```json
{
  "name": "Dr. Alex Morgan",
  "departmentId": "665f1a2b3c4d5e6f78901234",
  "specialization": "Cardiology"
}
```

The `q` search parameter is required and cannot be blank.

### Departments

| Method   | Route                    | Description                   |
| -------- | ------------------------ | ----------------------------- |
| `POST`   | `/departments`           | Create a department           |
| `GET`    | `/departments`           | List all departments          |
| `GET`    | `/departments/:id`       | Get one department            |
| `GET`    | `/departments/:id/stats` | Get department metrics        |
| `PATCH`  | `/departments/:id`       | Partially update a department |
| `DELETE` | `/departments/:id`       | Delete a department           |

Department fields:

```json
{
  "name": "Cardiology",
  "displayOrder": 1
}
```

The statistics endpoint returns the department name, doctor count, total appointments, and appointment counts grouped by status.

### Appointments

| Method   | Route                                   | Description                        |
| -------- | --------------------------------------- | ---------------------------------- |
| `POST`   | `/appointments`                         | Schedule an appointment            |
| `GET`    | `/appointments`                         | List all appointments              |
| `GET`    | `/appointments/report`                  | Get aggregate appointment metrics  |
| `GET`    | `/appointments/:id`                     | Get one appointment                |
| `PATCH`  | `/appointments/:id`                     | Partially update an appointment    |
| `DELETE` | `/appointments/:id`                     | Delete an appointment              |
| `PATCH`  | `/appointments/:id/complete`            | Complete and record an appointment |
| `PATCH`  | `/appointments/:id/cancel`              | Cancel an appointment              |
| `GET`    | `/doctors/:id/appointments`             | List a doctor's appointments       |
| `GET`    | `/doctors/:id/schedule?date=YYYY-MM-DD` | Get a doctor's daily schedule      |
| `GET`    | `/patients/:id/appointments`            | List a patient's appointments      |
| `GET`    | `/patients/:id/medical-record`          | Get a patient's medical records    |

Create an appointment with:

```json
{
  "patientId": "665f1a2b3c4d5e6f78901234",
  "doctorId": "665f1a2b3c4d5e6f78905678",
  "scheduledAt": "2026-09-25T10:30:00.000Z",
  "notes": "Initial consultation",
  "followUp": false
}
```

Appointment statuses are `scheduled`, `completed`, and `cancelled`. New appointments default to `scheduled`.

Before an appointment is created, the API verifies that the doctor and patient exist and prevents either from having another appointment at the same `scheduledAt` value. A completed or cancelled appointment cannot be completed or cancelled again.

To complete an appointment and create its medical record:

```json
{
  "patientIssue": "Recurring chest discomfort",
  "doctorReport": "Recommended additional cardiac testing",
  "medications": ["Medication name and dosage"]
}
```

The completion operation uses a MongoDB transaction and returns a confirmation message after both writes succeed.

## Validation and errors

The application enables NestJS's global `ValidationPipe`. Request bodies are validated according to their DTOs, including MongoDB IDs, ISO date strings, required strings, booleans, positive numbers, and appointment status values.

Common error responses include:

- `400 Bad Request` for invalid input or a missing schedule date
- `404 Not Found` when a referenced resource does not exist
- `409 Conflict` for duplicate scheduling or invalid appointment transitions

## Project structure

```text
src/
  appointments/       Appointment routes, lifecycle logic, and reports
  departments/        Department routes and department statistics
  doctors/             Doctor routes and text search
  patients/            Patient routes and age virtual
  medical_records/     Medical record schema and Mongoose module
  common/filters/      MongoDB exception handling
  app.module.ts        Global configuration and database connection
  main.ts              Application bootstrap and global middleware
```

Each primary domain module contains its controller, service, DTOs, and Mongoose schema. Medical records are currently created through appointment completion and retrieved through the patient medical-record endpoint; there is no standalone medical-record CRUD controller.

## Scripts

| Command               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `npm run start`       | Start the compiled NestJS application in standard mode |
| `npm run start:dev`   | Start in watch mode                                    |
| `npm run start:debug` | Start in watch and Node inspector mode                 |
| `npm run build`       | Compile the application to `dist/`                     |
| `npm run start:prod`  | Run `dist/main`                                        |
| `npm run lint`        | Run ESLint and apply fixes                             |
| `npm run format`      | Format source and test files with Prettier             |
| `npm run test`        | Run unit tests                                         |
| `npm run test:watch`  | Run tests in watch mode                                |
| `npm run test:cov`    | Generate a coverage report                             |
| `npm run test:e2e`    | Run end-to-end tests                                   |

## Development notes

- No authentication or authorization layer is currently configured.
- There is no API version prefix; routes are served from the root path.
- Appointment change streams are enabled at module initialization and log appointment updates.
- Use a transaction-capable MongoDB deployment when testing appointment completion.

## License

This project is currently marked as `UNLICENSED` in `package.json`.
