
# QuickNotes System Architecture

## 1. Introduction

QuickNotes is a note-taking application that allows users to create, view, update, delete, and organize personal notes.

The system is designed to support growth as the number of users increases while maintaining performance, availability, and data security.

This document explains the system requirements, traffic estimates, architecture, request flows, scaling strategies, and design trade-offs.

---

## 2. Functional Requirements

Functional requirements describe what the application must do.

The QuickNotes system should allow users to:

1. Register and log in securely.
2. Create new notes.
3. View all their notes.
4. View an individual note.
5. Update existing notes.
6. Delete notes.
7. Organize notes using tags.
8. Search for notes.
9. Access only their own private notes.

## 3. Non-Functional Requirements

Non-functional requirements describe how well the system should operate.

- **Performance:** The application should respond quickly to user requests.
- **Scalability:** The system should support increasing numbers of users.
- **Availability:** Users should be able to access the application with minimal downtime.
- **Security:** User information and notes must be protected.
- **Reliability:** The system should handle failures without losing important data.
- **Maintainability:** The system should be easy to update and improve.

---

## 4. Load Estimation for 1 Million Users

To understand the resources required, we estimate the expected traffic and storage.

### Assumptions

- Registered users: 1,000,000
- Daily active users: 10% of registered users
- Each active user views 20 notes per day.
- Each active user creates 1 note per day.
- Average note storage size: 2 KB.
- Peak traffic is 5 times the average traffic.
- One year contains 365 days.

### A. Daily Active Users (DAU)

DAU means the number of unique users who use the application daily.

DAU = 1,000,000 × 10%

DAU = 100,000 active users per day.

### B. Read Requests Per Second

Each active user views 20 notes daily.

Total daily reads:

100,000 × 20 = 2,000,000 reads per day.

Average reads per second:

2,000,000 ÷ 86,400 = 23.15 reads per second.

Peak reads per second:

23.15 × 5 = 115.75 reads per second.

Approximately 116 reads per second at peak.

### C. Write Requests Per Second

Each active user creates 1 note daily.

Total daily writes:

100,000 × 1 = 100,000 writes per day.

Average writes per second:

100,000 ÷ 86,400 = 1.16 writes per second.

Peak writes per second:

1.16 × 5 = 5.8 writes per second.

Approximately 6 writes per second at peak.

### D. Annual Storage Estimation

Each active user creates one note daily.

Daily notes created:

100,000 notes.

Annual notes created:

100,000 × 365 = 36,500,000 notes.

Each note occupies approximately 2 KB.

Annual storage:

36,500,000 × 2 KB = 73,000,000 KB.

Approximately 73 GB of raw note data per year using decimal storage units.

This estimate excludes indexes, backups, database overhead, and other application data.

### Load Estimation Summary

| Metric | Estimated Value |
|---|---:|
| Registered users | 1,000,000 |
| Daily active users | 100,000 |
| Average reads/second | 23 |
| Peak reads/second | 116 |
| Average writes/second | 1.16 |
| Peak writes/second | 6 |
| Annual raw note storage | 73 GB |

---

## 5. Read-Heavy or Write-Heavy System?

QuickNotes is expected to be a read-heavy application.

Based on our assumptions:

- Daily reads: 2,000,000
- Daily writes: 100,000

Reads are approximately 20 times higher than writes.

A read-heavy system handles more data retrieval requests than data creation or modification requests.

### Design Implications

To improve performance:

1. Use caching to reduce repeated database queries.
2. Use a database read replica to handle additional read requests.
3. Use a Content Delivery Network (CDN) to distribute static frontend files.
4. Use database indexes to speed up searches.
5. Use multiple application servers to handle incoming traffic.

---

## 6. System Architecture Diagram

The following diagram illustrates the proposed QuickNotes architecture.

```text
                  USERS
                    |
                    v
                 DNS
                    |
                    v
                   CDN
                    |
                    v
             LOAD BALANCER
                    |
             +------+------+
             |             |
             v             v
        APP SERVER 1   APP SERVER 2
             |             |
             +------+------+
                    |
                    v
                  CACHE
                    |
             +------+------+
             |             |
             v             v
        PRIMARY DB     READ REPLICA
             |
             v
          MESSAGE QUEUE
             |
             v
            WORKER
             |
             v
       BACKGROUND JOBS
```

---

## 7. Architecture Components

### 1. Client

The client is the user's browser or mobile application used to access QuickNotes.

### 2. DNS (Domain Name System)

DNS translates the QuickNotes domain name into the IP address of the application entry point.

### 3. CDN (Content Delivery Network)

The CDN delivers static files such as HTML, CSS, JavaScript, and images from geographically distributed servers.

### 4. Load Balancer

The load balancer distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

### 5. Application Servers

Application servers process business logic, authenticate users, validate requests, and communicate with the database.

Running multiple application servers allows the system to handle more requests and remain available if one server fails.

### 6. Cache

The cache temporarily stores frequently accessed information to reduce repeated database queries and improve response times.

### 7. Primary Database

The primary PostgreSQL database handles write operations such as creating, updating, and deleting notes.

### 8. Read Replica

The read replica maintains a copy of the primary database and handles read requests, reducing the workload on the primary database.

### 9. Message Queue

The message queue stores background tasks so they can be processed asynchronously without delaying the user's request.

### 10. Worker

The worker processes background jobs such as sending notifications, generating reports, and performing scheduled tasks.

---

## 8. Request Flows

### A. GET /notes — Retrieve Notes

When a user requests their notes:

1. The user opens QuickNotes in the browser.
2. DNS resolves the application domain.
3. The request passes through the CDN and load balancer.
4. The load balancer forwards the request to an available application server.
5. The application server checks the cache for the requested notes.
6. If the notes are cached, they are returned immediately.
7. If they are not cached, the application server retrieves them from the database read replica.
8. The retrieved data may be stored in the cache.
9. The application server returns the notes as a JSON response.
10. The browser displays the notes to the user.

### B. POST /notes — Create a Note

When a user creates a new note:

1. The user enters a title and note content.
2. The browser sends a POST request to the application.
3. DNS, CDN, and the load balancer direct the request to an application server.
4. The application server authenticates the user and validates the note.
5. The application server writes the new note to the primary PostgreSQL database.
6. The database confirms that the note has been saved.
7. The application server returns a successful response with status 201 Created.
8. The browser displays the new note to the user.
9. Any required background task can be placed in the message queue for a worker to process.

---

## 9. Scaling Strategies

QuickNotes can support growth through several techniques.

### Horizontal Scaling

Add more application servers to distribute incoming requests.

### Caching

Store frequently requested notes temporarily to reduce database workload.

### Database Read Replicas

Use additional read replicas to distribute read requests.

### Database Indexing

Create indexes on frequently searched columns, such as user_id, to improve query performance.

### Asynchronous Processing

Use message queues and workers to process background jobs without slowing down the main application.

### CDN

Deliver static frontend resources from locations closer to users.

---

## 10. Architecture Trade-Offs

A trade-off is a decision where improving one aspect of a system may introduce a disadvantage in another area.

### Trade-off 1: SQL vs NoSQL

**Chosen:** PostgreSQL (SQL).

Advantages:
- Supports structured data.
- Maintains relationships through foreign keys.
- Supports transactions and complex queries.

Disadvantages:
- Requires schema management.
- Scaling some relational workloads can require additional planning.

### Trade-off 2: Caching vs Data Consistency

Advantages:
- Caching improves performance.
- Reduces repeated database queries.

Disadvantages:
- Cached information may become outdated.
- Cache invalidation adds complexity.

### Trade-off 3: Read Replicas vs Immediate Consistency

Advantages:
- Read replicas distribute database traffic.
- Reduce the workload on the primary database.

Disadvantages:
- Replication may introduce a delay.
- Recently updated data may not immediately appear on a replica.

### Trade-off 4: More Servers vs Infrastructure Cost

Advantages:
- Multiple servers improve scalability and availability.
- Requests can be distributed across servers.

Disadvantages:
- More servers increase hosting and maintenance costs.

---

## 11. Avoiding Single Points of Failure

A single point of failure is a component whose failure can cause the entire system to become unavailable.

QuickNotes reduces this risk through:

1. Multiple application servers instead of relying on one server.
2. A load balancer that redirects requests to healthy servers.
3. Database backups to protect important information.
4. Database replication to support recovery.
5. Monitoring and health checks to detect failures.
6. Redundant infrastructure for critical components.

The system should also use appropriate failover procedures and test recovery regularly.

---

## 12. Conclusion

The proposed QuickNotes architecture is designed to support one million registered users while maintaining performance, scalability, and availability.

Caching and read replicas improve read performance, while multiple application servers distribute incoming traffic.

PostgreSQL provides reliable structured data storage, and message queues allow background tasks to be processed asynchronously.

The architecture can grow as the application gains more users and requires additional resources.
```

---

## Step 19: Save your sixth commit

After saving the file, run these commands one at a time:

```powershell
git add docs/architecture.md
```

```powershell
git commit -m "Add architecture doc"
```

**Send me the commit output when you're done.** Then we'll finish the README, check the entire project against the assignment requirements, and push everything to GitHub. ❤️