
// API endpoint
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Get HTML elements
const loadButton = document.getElementById("load-btn");
const notesList = document.getElementById("notes-list");
const statusMessage = document.getElementById("status");

// Reusable API request function
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

// Display status messages
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
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
        const item = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body || "No content available.";

        item.appendChild(title);
        item.appendChild(body);
        notesList.appendChild(item);
    });
}

// GET request: Load notes
async function loadNotes() {
    loadButton.disabled = true;
    showStatus("Loading notes...");

    try {
        const notes = await request(`${API_URL}?_limit=10`);

        displayNotes(notes);

        if (notes.length === 0) {
            showStatus("No notes found.", "status-success");
        } else {
            showStatus(
                `Loaded ${notes.length} notes from the server.`,
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

// Listen for button clicks
loadButton.addEventListener("click", loadNotes);
