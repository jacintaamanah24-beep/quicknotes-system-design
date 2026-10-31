
# QuickNotes API Design

## 1. Introduction

The QuickNotes API is a RESTful backend service that allows users to create, view, update, and delete notes. It also supports organizing notes using tags.

The API uses JSON for request and response data and follows standard HTTP methods and status codes.

**Base URL:** `https://api.quicknotes.com/v1`

**Content-Type:** `application/json`

**Authentication:** Bearer Token

---

## 2. API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | /notes | Retrieve all notes belonging to a user | 200 OK |
| GET | /notes/{id} | Retrieve a specific note | 200 OK |
| POST | /notes | Create a new note | 201 Created |
| PUT | /notes/{id} | Update an existing note | 200 OK |
| DELETE | /notes/{id} | Delete a note | 200 OK |
| GET | /tags | Retrieve all available tags | 200 OK |
| POST | /tags | Create a new tag | 201 Created |
| POST | /notes/{id}/tags | Assign a tag to a note | 200 OK |

---

## 3. Request and Response Examples

### A. Create a Note

**Endpoint:** `POST /notes`

Request body:

```json
{
  "title": "My First Note",
  "body": "Learning how REST APIs work.",
  "userId": 1
}
```

Response:

**Status:** `201 Created`

```json
{
  "id": 101,
  "title": "My First Note",
  "body": "Learning how REST APIs work.",
  "userId": 1,
  "createdAt": "2026-10-31T10:00:00Z",
  "updatedAt": "2026-10-31T10:00:00Z"
}
```

### B. List Notes

**Endpoint:** `GET /notes`

Response:

**Status:** `200 OK`

```json
{
  "data": [
    {
      "id": 101,
      "title": "My First Note",
      "body": "Learning how REST APIs work.",
      "userId": 1
    },
    {
      "id": 102,
      "title": "Project Ideas",
      "body": "Ideas for my next project.",
      "userId": 1
    }
  ],
  "total": 2
}
```

---

## 4. Error Handling

The API uses standard HTTP status codes to communicate errors.

| Status Code | Meaning | Example |
|---|---|---|
| 400 | Bad Request | Required title is missing |
| 401 | Unauthorized | Authentication token is missing or invalid |
| 403 | Forbidden | User does not have permission to access a note |
| 404 | Not Found | Requested note does not exist |
| 500 | Internal Server Error | Unexpected server failure |

### Example Error Response

**Status:** `400 Bad Request`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The note title is required."
  }
}
```

Another example:

**Status:** `404 Not Found`

```json
{
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "The requested note could not be found."
  }
}
```

---

## 5. Authentication and Authorization

The API uses Bearer Token authentication to protect user information.

Clients must include an access token in the Authorization header.

Example:

```http
Authorization: Bearer your_access_token
```

Users can only access, update, or delete notes that belong to them.

---

## 6. Validation Rules

The API applies validation before saving data.

- Note title is required.
- Note title must not exceed 100 characters.
- Note body is optional.
- Each note must belong to a valid user.
- Note IDs must be unique.
- Users cannot modify notes belonging to other users.

---

## 7. API Design Considerations

- REST principles are used to organize resources.
- JSON is used for communication between clients and the server.
- HTTP status codes communicate request outcomes.
- Authentication protects private user data.
- Validation prevents incomplete or invalid records.
- Consistent error responses make debugging easier.

---

## 8. Conclusion

The QuickNotes API provides a structured way to manage notes through RESTful endpoints. It supports creating, retrieving, updating, and deleting notes while maintaining security, validation, and consistent communication between the client and server.
