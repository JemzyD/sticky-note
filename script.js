// making them gobal variables
var displayNotes = document.getElementById("displayNotes");
var editNoteForm = document.getElementById("editNoteForm");
var newNoteForm = document.getElementById("newNoteForm");
var newTitle = document.getElementById("newTitle");
var newContent = document.getElementById("newContent");

// creating the sticky note
function createNoteBody(note, titlePart, contentPart) {
  var newNote = document.createElement("div");
  newNote.className = "note";
  newNote.id = note.substring(10);
  var title = document.createElement("h2");
  title.innerText = titlePart;
  var content = document.createElement("p");
  content.innerText = contentPart;
  newNote.appendChild(title);
  newNote.appendChild(content);
  newNote.addEventListener("click", oneNote);
  displayNotes.appendChild(newNote);
}

// toggles between the main page options
function showContent(type) {
  switch (type) {
    case "newNote":
      editNoteForm.style.display = "none";
      displayNotes.style.display = "none";
      newNoteForm.style.display = "block";
      break;

    case "allNotes":
      editNoteForm.style.display = "none";
      newNoteForm.style.display = "none";
      displayNotes.style.display = "flex";
      break;

    case "editNote":
      displayNotes.style.display = "none";
      newNoteForm.style.display = "none";
      editNoteForm.style.display = "block";
  }
}

//displays all the sticky notes
function allNotes() {
  showContent("allNotes");
  var allNotes = window.localStorage;
  for (var note in allNotes) {
    if (note.includes("stickyNote")) {
      savedNote = JSON.parse(localStorage.getItem(note));
      createNoteBody(note, savedNote["title"], savedNote["content"]);
    }
  }
}

// displays the create a new note page
function showNewNote() {
  showContent("newNote");
}

//saves the new note in local storage
function createNote(e) {
  //prevent it from submitting a form and creating a url
  e.preventDefault();

  var currentDate = new Date();

  var newTitleValue = newTitle.value;
  var newContentValue = newContent.value;

  //sticky note data saved as object
  var newNoteBody = {
    title: newTitleValue,
    content: newContentValue,
    date: currentDate
  };

  var noteData = "stickyNote" + Date.parse(currentDate);

  localStorage.setItem(noteData, JSON.stringify(newNoteBody));
  allNotes();

  // clears input fields
  newTitle.value = "";
  newContent.value = "";
}

//displays a single note
function oneNote(event) {
  var noteData;
  if (event.target["className"] === "note") {
    noteData = event.target["id"];
  } else {
    noteData = event.target.parentNode.id;
  }

  var noteTitle = "";
  var noteContent = "";
  var allNotes = window.localStorage;
  for (var note in allNotes) {
    if (note.slice(0, 10) == "stickyNote" && note.slice(10) == noteData) {
      savedNote = JSON.parse(localStorage.getItem(note));
      noteTitle = savedNote["title"];
      noteContent = savedNote["content"];
    }
  }

  editNoteForm.setAttribute("id-noteData", noteData);
  document.getElementById("editTitle").value = noteTitle;
  document.getElementById("editContent").value = noteContent;

  showContent("editNote");
}

//editing and saving note
function editNote(e) {
  e.preventDefault();
  var noteData = editNoteForm.getAttribute("id-noteData");
  var noteTitle = document.getElementById("editTitle").value;
  var noteContent = document.getElementById("editContent").value;
  var newNoteBody = {
    title: noteTitle,
    content: noteContent,
    date: noteData
  };

  localStorage["stickyNote" + noteData] = JSON.stringify(newNoteBody);
  allNotes();
}

// deleting a sticky note
function delNote(e) {
  e.preventDefault();
  var noteData = editNoteForm.getAttribute("id-noteData");
  localStorage.removeItem("stickyNote" + noteData);
  allNotes();
}

//loads js functions when all elements are loaded
window.onload = function() {
  allNotes();

  document.getElementById("createNote").addEventListener("click", createNote);

  document.getElementById("editNote").addEventListener("click", editNote);
  document.getElementById("delNote").addEventListener("click", delNote);
};
