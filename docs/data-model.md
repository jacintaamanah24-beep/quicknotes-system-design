
# QuickNotes Database Data Model

## 1. Introduction

The QuickNotes application uses a relational database to store users, notes, tags, and the relationships between notes and tags.

The database is designed using PostgreSQL. It uses primary keys, foreign keys, and indexes to maintain data integrity and improve query performance.

## 2. Database Entities and Tables

The database contains four main entities:

1. Users
2. Notes
3. Tags
4. Note_Tags

### A. Users Table

Stores information about registered users.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique user identifier |
| username | VARCHAR(50) | UNIQUE | User's username |
| email | VARCHAR(100) | UNIQUE | User's email |
| password_hash | VARCHAR(255) | | Securely stored password hash |
| created_at | TIMESTAMP | | Account creation date |

### B. Notes Table

Stores notes created by users.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique note identifier |
| user_id | INTEGER | Foreign Key | References the user who owns the note |
| title | VARCHAR(100) | | Note title |
| body | TEXT | | Note content |
| created_at | TIMESTAMP | | Note creation date |
| updated_at | TIMESTAMP | | Last modification date |

### C. Tags Table

Stores tags that users can use to organize notes.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique tag identifier |
| user_id | INTEGER | Foreign Key | References the user who created the tag |
| name | VARCHAR(50) | | Tag name |

### D. Note_Tags Table

Connects notes to tags.

| Column | Data Type | Key | Description |
|---|---|---|---|
| note_id | INTEGER | Primary Key, Foreign Key | References a note |
| tag_id | INTEGER | Primary Key, Foreign Key | References a tag |

The combination of note_id and tag_id forms a composite primary key.

---

## 3. Database Relationships

The database has the following relationships:

### Users and Notes: One-to-Many

One user can create many notes, but each note belongs to one user.

- Users.id is the primary key.
- Notes.user_id is the foreign key.

### Users and Tags: One-to-Many

One user can create many tags, but each tag belongs to one user.

- Users.id is the primary key.
- Tags.user_id is the foreign key.

### Notes and Tags: Many-to-Many

One note can have many tags, and one tag can be assigned to many notes.

The Note_Tags junction table manages this relationship using note_id and tag_id.

---

## 4. SQL Table Creation

The following SQL statements create the four database tables.

### A. Create Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B. Create Notes Table

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### C. Create Tags Table

```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL
);
```

### D. Create Note_Tags Table

```sql
CREATE TABLE note_tags (
    note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

---

## 5. Example SQL Queries

### Query 1: Retrieve All Notes for a User

This query retrieves all notes belonging to a specific user.

```sql
SELECT *
FROM notes
WHERE user_id = 1
ORDER BY created_at DESC;
```

### Query 2: Create a New Note

This query inserts a new note into the database.

```sql
INSERT INTO notes (user_id, title, body)
VALUES (
    1,
    'My First Note',
    'Learning database design.'
);
```

### Query 3: Retrieve Notes Together With Their Tags

This query uses JOIN to combine notes, note_tags, and tags tables.

```sql
SELECT
    notes.id,
    notes.title,
    notes.body,
    tags.name AS tag_name
FROM notes
JOIN note_tags
    ON notes.id = note_tags.note_id
JOIN tags
    ON note_tags.tag_id = tags.id
WHERE notes.user_id = 1;
```

The JOIN operation allows related information stored in different tables to be retrieved together.

---

## 6. Database Indexing

An index improves the speed of database searches.

The QuickNotes application uses an index on the user_id column in the notes table.

```sql
CREATE INDEX idx_notes_user_id
ON notes(user_id);
```

This index improves the performance of queries that retrieve notes belonging to a particular user.

For example:

```sql
SELECT *
FROM notes
WHERE user_id = 1;
```

Without an index, the database may need to scan many rows to find matching notes.

---

## 7. SQL vs NoSQL Database Choice

QuickNotes uses PostgreSQL, which is a relational SQL database.

### Why SQL is suitable

- Notes have a structured relationship with users.
- Foreign keys maintain relationships between tables.
- Transactions help maintain data consistency.
- JOIN operations allow related information to be retrieved efficiently.
- PostgreSQL supports complex queries and indexing.

### Why NoSQL was not selected

NoSQL databases are useful for flexible or rapidly changing data structures. However, QuickNotes has clearly defined entities and relationships that benefit from a relational database.

Therefore, PostgreSQL is a suitable choice for this application.

---

## 8. Conclusion

The QuickNotes database model provides a structured way to manage users, notes, and tags.

Primary keys uniquely identify records, foreign keys maintain relationships, and indexes improve query performance.

The relational design supports data consistency, efficient retrieval, and future application growth.
