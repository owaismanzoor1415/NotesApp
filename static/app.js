const notesContainer =document.getElementById("notesConatiner")
const titleInput =document.getElementById("title")
const contentInput =document.getElementById("content")
const saveBtn =document.getElementById("saveBtn")

let editingId=null;

window.addEventListener("DOMContentLoaded",loadNotes);
async function loadNotes(params) {
    const res = await fetch("/api/notes");
    const notes = await res.json();
    notesContainer.innerHTML = "";
    notes.forEach(renderNoteCard);
    
}


function renderNoteCard(note) {
    const card = document.createElement("div");
    card.className = "note-card";
    card.dataset.id = note._id;

    card.innerHTML = `
        <div class="note-title">${note.title || "(No title)"}</div>
        <div class="note-content">${note.content || ""}</div>
        <div class="note-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
        </div>
    `;

    card.querySelector(".btn-edit").addEventListener("click", () => {
        editingId = note._id;
        titleInput.value = note.title;
        contentInput.value = note.content;
        saveBtn.textContent = "Update Note";
    });

    
    card.querySelector(".btn-delete").addEventListener("click", async () => {
        await fetch(`/api/notes/${note._id}`, { method: "DELETE" });
        loadNotes();
    });

    notesContainer.appendChild(card);
}


saveBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title && !content) {
        alert("Note cannot be empty!");
        return;
    }

    if (editingId) {
    
        await fetch(`/api/notes/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });
        editingId = null;
        saveBtn.textContent = "Save Note";
    } else {
        
        await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });
    }

    titleInput.value = "";
    contentInput.value = "";
    loadNotes();
});
