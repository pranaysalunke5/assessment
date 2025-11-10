# Node.js + GraphQL + PostgreSQL Assessment Submission

This project is a complete backend application built on Node.js, implementing a GraphQL API with JWT authentication, file uploading, server-side PDF generation, and email services, fulfilling all requirements of the assessment.

## 🛠️ Tech Stack

* **Node.js** (v18+)
* **GraphQL Server:** Apollo Server
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (via `jsonwebtoken`) and `bcrypt`
* **File Upload:** `graphql-upload` (Local disk storage)
* **PDF Generation:** Puppeteer (Headless Chrome)
* **HTML Templating:** Handlebars
* **Email Service:** Nodemailer (using Ethereal for development)
* **DevOps:** Docker and Docker Compose

## 🐳 Getting Started (Recommended Method)

The project includes a `Dockerfile` and `docker-compose.yml` to set up the application and a dedicated PostgreSQL database in a reproducible environment.

### Prerequisites

* Docker and Docker Compose installed and running.

### Setup Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/pranaysalunke5/assessment.git
    cd assessment
    ```



### Access

The GraphQL API is now running and accessible:

| Service | URL |
| :--- | :--- |
| **GraphQL API** | `http://localhost:4000/` |
| **Static Files (Uploads)**| `http://localhost:4000/uploads/` |

---

## 🚀 Example GraphQL Operations

Use the **Apollo Sandbox** interface at `http://localhost:4000/` to test the following flows:


mutation {
  register(email: "test@example.com", password: "mypassword") {
    id
    email
    role
  }
}

mutation {
  login(email: "test@example.com", password: "mypassword") {
    token
    user {
      id
      email
    }
  }
}

mutation {
  createDocument(
    title: "Invoice",
    templateData: { name: "Pranav", amount: "2000", date: "2025-11-10" }
  ) {
    id
    title
    pdfUrl
  }
}
