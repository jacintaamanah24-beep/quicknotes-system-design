
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const notesList = document.getElementById("notes-list");
const statusMessage = document.getElementById("status");

const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");

// Reusable API request function
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
        data,
        status: response.status
    };
}

// Display status messages
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// DELETE: Remove a note from the server
async function deleteNote(noteId, deleteButton, noteElement) {
    deleteButton.disabled = true;
    showStatus("Deleting note...");

    try {
        const result = await request(`${API_URL}/${noteId}`, {
            method: "DELETE"
        });

        // Remove the note from the screen after success
        noteElement.remove();

        showStatus(
            `Note deleted successfully (status ${result.status}).`,
            "status-success"
        );

    } catch (error) {
        showStatus(
            `Unable to delete note. ${error.message}`,
            "status-error"
        );

    } finally {
        deleteButton.disabled = false;
    }
}

// Create and display one note
function createNoteElement(note) {
    const item = document.createElement("li");

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body || "No content available.";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
        deleteNote(note.id, deleteButton, item);
    });

    item.appendChild(title);
    item.appendChild(body);
    item.appendChild(deleteButton);

    return item;
}

// Display notes
function displayNotes(notes) {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No notes found.";
        notesList.appendChild(item);
        return;
    }

    notes.forEach(note => {
        notesList.appendChild(createNoteElement(note));
    });
}

// GET: Load notes
async function loadNotes() {
    loadButton.disabled = true;
    showStatus("Loading notes...");

    try {
        const result = await request(`${API_URL}?_limit=10`);

        displayNotes(result.data);

        if (result.data.length === 0) {
            showStatus("No notes found.", "status-success");
        } else {
            showStatus(
                `Loaded ${result.data.length} notes from the server.`,
                "status-success"
            );
        }

    } catch (error) {
        showStatus(
            `Unable to load notes. ${error.message}`,
            "status-error"
        );

    } finally {
        loadButton.disabled = false;
    }
}

// POST: Create a new note
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus("Please enter a note title.", "status-error");
        return;
    }

    if (title.length > 100) {
        showStatus(
            "Title cannot be longer than 100 characters.",
            "status-error"
        );
        return;
    }

    submitButton.disabled = true;
    showStatus("Creating your note...");

    try {
        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1
            })
        });

        const newNote = result.data;

        // JSONPlaceholder simulates creation; it does not persist notes.
        notesList.prepend(createNoteElement(newNote));

        showStatus(
            `Note created (status ${result.status}, id ${newNote.id}).`,
            "status-success"
        );

        noteForm.reset();

    } catch (error) {
        showStatus(
            `Unable to create note. ${error.message}`,
            "status-error"
        );

    } finally {
        submitButton.disabled = false;
    }
}

// Event listeners
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
