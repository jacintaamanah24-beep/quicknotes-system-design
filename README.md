# QuickNotes – API Integration and System Design

## 1. Project Overview

QuickNotes is a simple note-taking application developed to demonstrate API integration and system design fundamentals.

The application allows users to retrieve notes from a server, create new notes, and delete existing notes.

The project also includes documentation covering REST API design, database modelling, and scalable system architecture.

## 2. Features

- Retrieve notes using GET requests.
- Create notes using POST requests.
- Delete notes using DELETE requests.
- Display loading, success, error, and empty states.
- Validate note titles before submission.
- Disable buttons while API requests are processing.
- Responsive user interface for different screen sizes.

## 3. Technologies Used

- HTML5 – Application structure.
- CSS3 – Styling and responsive layout.
- JavaScript – Application functionality and API integration.
- Fetch API – Communication with the server.
- JSONPlaceholder – Testing API.
- PostgreSQL – Proposed database design.
- Git and GitHub – Version control and project hosting.

## 4. Project Structure

```text
quicknotes-system-design/
│
├── index.html
├── style.css
├── api.js
├── README.md
│
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## 5. How to Run the Application

1. Clone the repository:

```bash
git clone https://github.com/jacintaamanah24-beep/quicknotes-system-design.git
```

2. Open the project folder in Visual Studio Code.

3. Open `index.html` using the Live Server extension.

4. Click **Load Notes** to retrieve sample notes from the API.

5. Enter a title and content to create a note.

6. Use the Delete button to remove a note from the displayed list.

**Note:** The application uses JSONPlaceholder as a testing API. POST and DELETE operations are simulated and do not permanently save changes.

## 6. Project Documentation

The project includes three system design documents:

- [API Design](docs/api-design.md) – REST endpoints, request and response examples, authentication, validation, and error handling.
- [Data Model](docs/data-model.md) – Database entities, relationships, SQL table creation, queries, indexes, and SQL vs NoSQL comparison.
- [System Architecture](docs/architecture.md) – Functional and non-functional requirements, load estimation, architecture diagram, request flows, scaling strategies, and trade-offs.

## 7. What I Learned

Through this project, I learned how to:

1. Integrate a frontend application with an external API using JavaScript Fetch.
2. Work with GET, POST, and DELETE HTTP methods.
3. Handle asynchronous operations using async/await.
4. Handle API errors using try/catch/finally.
5. Design RESTful API endpoints and understand HTTP status codes.
6. Design relational databases using PostgreSQL concepts, primary keys, foreign keys, and JOIN queries.
7. Understand system scalability through caching, load balancing, read replicas, and message queues.
8. Use Git and GitHub to manage project versions through meaningful commits.

## 8. Future Improvements

- Connect the application to a real PostgreSQL backend.
- Implement user registration and authentication.
- Add note editing functionality.
- Introduce note searching and filtering.
- Add permanent data storage.

## 9. Conclusion

QuickNotes demonstrates the fundamentals of frontend API integration and backend system design.

The project combines practical coding with architectural documentation to show how a simple application can be designed to support future growth.