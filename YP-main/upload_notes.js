// Load existing notes from localStorage or initialize default notes
let notes = JSON.parse(localStorage.getItem("notes")) || [
    {
        id: 1,
        title: "Decoding-Cybercrime-Unit I",
        category: "lectures",
        filename: "notes/Decoding-Cybercrime-Unit I.pptx",
        uploadDate: "2025-03-10",
        fileSize: "3.1 MB"
    },
    {
        id: 2,
        title: "Cryptography-and-Cybercrime Unit II",
        category: "lectures",
        filename: "notes/Cryptography-and-Cybercrime Unit II.pptx",
        uploadDate: "2025-03-01",
        fileSize: "2.4 MB"
    }
];

// DOM Elements
const notesListContainer = document.getElementById("notesList");
const searchInput = document.getElementById("searchNotes");
const categoryFilter = document.getElementById("categoryFilter");
const sortOptions = document.getElementById("sortOptions");
const uploadForm = document.getElementById("uploadForm");

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Display notes in UI
function displayNotes(notesToDisplay) {
    notesListContainer.innerHTML = "";

    if (notesToDisplay.length === 0) {
        notesListContainer.innerHTML = `<div class="empty-state"><h3>No notes found</h3><p>Try adjusting your search or filters</p></div>`;
        return;
    }

    notesToDisplay.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
            <h3 class="note-title">${note.title}</h3>
            <div class="note-meta">
                <div>Date: ${new Date(note.uploadDate).toLocaleDateString()}</div>
                <div>Size: ${note.fileSize}</div>
            </div>
            <div class="note-actions">
                <a href="${note.filename}" download class="download-btn">Download</a>
                <button class="delete-btn" data-id="${note.id}">Delete</button>
            </div>
        `;
        notesListContainer.appendChild(noteCard);
    });
}

// Handle file upload
uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const titleInput = document.getElementById("noteTitle");
    const categoryInput = document.getElementById("noteCategory");
    const fileInput = document.getElementById("noteFile");
    const descriptionInput = document.getElementById("noteDescription");

    if (titleInput.value && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            const newNote = {
                id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
                title: titleInput.value,
                category: categoryInput.value,
                filename: reader.result,
                description: descriptionInput.value || "",
                uploadDate: new Date().toISOString().split("T")[0],
                fileSize: (file.size / 1048576).toFixed(1) + " MB"
            };
            
            notes.push(newNote);
            saveNotes();
            uploadForm.reset();
            displayNotes(notes);
            alert("Note uploaded successfully!");
        };
    }
});

// Handle delete action
notesListContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        const noteId = parseInt(e.target.getAttribute("data-id"));
        notes = notes.filter((note) => note.id !== noteId);
        saveNotes();
        displayNotes(notes);
        alert("Note deleted successfully!");
    }
});

// Search and filter functionality
searchInput.addEventListener("input", filterAndDisplayNotes);
categoryFilter.addEventListener("change", filterAndDisplayNotes);
sortOptions.addEventListener("change", filterAndDisplayNotes);

function filterAndDisplayNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const sortValue = sortOptions.value;

    let filteredNotes = notes.filter(note =>
        (categoryValue === "all" || note.category === categoryValue) &&
        note.title.toLowerCase().includes(searchTerm)
    );

    filteredNotes.sort((a, b) => {
        switch (sortValue) {
            case "date-desc": return new Date(b.uploadDate) - new Date(a.uploadDate);
            case "date-asc": return new Date(a.uploadDate) - new Date(b.uploadDate);
            case "title-asc": return a.title.localeCompare(b.title);
            case "title-desc": return b.title.localeCompare(a.title);
            default: return 0;
        }
    });

    displayNotes(filteredNotes);
}

// Initial display
displayNotes(notes);
