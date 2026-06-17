# myDATA Invoice Manager

A full-stack app for submitting invoices to the Greek tax authority (AADE) via the myDATA API. Users log in, add their clients, create invoices, and the app handles the submission. AADE sends back a MARK number if accepted, or an error if something's wrong.

## Tech Stack

**Backend:** Java 21, Spring Boot 3.5, Spring Security, JPA/Hibernate, PostgreSQL  
**Frontend:** React 18, Vite, Tailwind CSS, i18next  
**Infrastructure:** Docker, Docker Compose

## What it does

- Register/login with JWT auth
- Manage clients
- Create invoices and submit them to AADE automatically
- See whether each invoice was accepted or rejected, and why
- Cancel or resubmit invoices
- Switch between Greek and English
- Dark mode

## Running the App

Requires Docker and Docker Compose.

```bash
docker-compose up --build
```

- Frontend: http://localhost:80  
- Backend API: http://localhost:8080

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/clients
POST   /api/clients
PUT    /api/clients/{id}
DELETE /api/clients/{id}

GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/{id}
POST   /api/invoices/{id}/cancel
POST   /api/invoices/{id}/resubmit
```

## Related Project

Same application built with C#/.NET 10 and Angular: [mydata-invoice-angular](https://github.com/thomasagg/mydata-invoice-angular)
