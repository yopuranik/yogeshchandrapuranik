// Load existing notes from localStorage or use an empty array
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// DOM Elements
const notesListContainer = document.getElementById("notesList");
const searchInput = document.getElementById("searchNotes");
const categoryFilter = document.getElementById("categoryFilter");
const sortOptions = document.getElementById("sortOptions");

// Function to display notes
function displayNotes(notesToDisplay) {
    notesListContainer.innerHTML = "";

    if (notesToDisplay.length === 0) {
        notesListContainer.innerHTML = `
            <div class="empty-state">
                <h3>No notes found</h3>
                <p>Try adjusting your search or filters</p>
            </div>`;
        return;
    }

    notesToDisplay.forEach((note) => {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
            <h3 class="note-title">${note.title}</h3>
            <div class="note-meta">
                <div><strong>Date:</strong> ${new Date(note.uploadDate).toLocaleDateString()}</div>
                <div><strong>Size:</strong> ${note.fileSize}</div>
            </div>
            <div class="note-actions">
                <a href="${note.filename}" download class="download-btn">
                    <i class="fa fa-download"></i> Download
                </a>
            </div>
        `;
        notesListContainer.appendChild(noteCard);
    });
}

// Search and filter functionality
searchInput.addEventListener("input", filterAndDisplayNotes);
categoryFilter.addEventListener("change", filterAndDisplayNotes);
sortOptions.addEventListener("change", filterAndDisplayNotes);

function filterAndDisplayNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const sortValue = sortOptions.value;

    let filteredNotes = notes.filter((note) => {
        return (
            (categoryValue === "all" || note.category === categoryValue) &&
            note.title.toLowerCase().includes(searchTerm)
        );
    });

    filteredNotes.sort((a, b) => {
        switch (sortValue) {
            case "date-desc":
                return new Date(b.uploadDate) - new Date(a.uploadDate);
            case "date-asc":
                return new Date(a.uploadDate) - new Date(b.uploadDate);
            case "title-asc":
                return a.title.localeCompare(b.title);
            case "title-desc":
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });

    displayNotes(filteredNotes);
}

// Initial display of notes when the page loads
displayNotes(notes);
