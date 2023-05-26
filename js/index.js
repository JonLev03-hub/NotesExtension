// functions
function loadSaved() {
  var storedNotes = localStorage.getItem("notes");
  var storedNoteIndex = localStorage.getItem("noteIndex");

  if (storedNotes && storedNoteIndex) {
    notes = JSON.parse(storedNotes);
    noteIndex = parseInt(storedNoteIndex);
  } else {
    localStorage.setItem(
      "notes",
      JSON.stringify([
        {
          title: "",
          body: "",
          color: "",
          deleted: false,
        },
      ])
    );
    localStorage.setItem("noteIndex", "0");
    loadSaved();
  }
}
function SaveLoaded() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("noteIndex", noteIndex.toString());
}
function autoResize(id) {
  const textArea = document.getElementById(id);
  textArea.style.height = "auto";
  textArea.style.height = textArea.scrollHeight + 10 + "px";
}
function addNote() {
  notes.push({
    title: "",
    body: "",
    color: "",
    deleted: false,
  });
  noteIndex = notes.length - 1;
  updateSidebar();
  SaveLoaded();
  updateTextArea();
}
function changeJsText(id) {
  if (notes.length == 0) {
    addNote();
  }
  const textArea = document.getElementById(id);
  notes[noteIndex][id] = textArea.value;
  SaveLoaded();
  if (id == "title") {
    updateSidebar();
  }
}
function autoTrim(id) {
  const textArea = document.getElementById(id);
  textArea.value = textArea.value.trimEnd();
}
function updateTextArea() {
  if (noteIndex > notes.length - 1) {
    noteIndex = 0;
  }
  const title = document.getElementById("title");
  const body = document.getElementById("body");
  title.value = notes[noteIndex] ? notes[noteIndex].title : "";
  body.value = notes[noteIndex] ? notes[noteIndex].body : "";
}

function updateSidebar() {
  // select item and reset inner html
  var ul = document.getElementById("notes");
  ul.innerHTML = "";

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    // check if title doesnt exist or is too long and update that
    displayTitle =
      note.title.length < 25 ? note.title : note.title.substring(0, 20) + "...";
    displayTitle = displayTitle == "" ? "Untitled Note" : displayTitle;

    var liHTML =
      `<li class = "noteItem ${i == noteIndex ? "focus" : ""}" id = ${i}>` +
      "<h3>" +
      displayTitle +
      "</h3>" +
      `<button class="deleteItem" id = ${i}>` +
      '<span class="material-symbols-outlined"> delete </span>' +
      "</button>" +
      "</li>";
    ul.innerHTML += liHTML;
  }

  // add event listeners to all items
  var listItems = document.querySelectorAll(".noteItem");
  listItems.forEach(function (listItem) {
    listItem.addEventListener("click", function () {
      // when an item name is clicked, update the noteIndex, and update the text area
      var itemId = listItem.id;
      noteIndex = itemId;
      updateTextArea();
      updateSidebar();
      SaveLoaded();
    });
  });

  var listItems = document.querySelectorAll(".deleteItem");
  listItems.forEach(function (listItem) {
    listItem.addEventListener("click", function () {
      var itemId = listItem.id;
      // when a delete button is clicked, remove the item, update the sidebar, and update the localstorage
      notes.splice(itemId, 1);
      updateSidebar();
      SaveLoaded();
    });
  });
}

function init() {
  // set variables here for them to be accessed gloally
  notes = {};
  noteIndex = 0;

  // build initial view
  loadSaved();
  updateTextArea();
  updateSidebar();

  // add event listeners for each action

  // code for all text area event listeners
  d3.select("#title").on("input", () => {
    autoResize("title");
    changeJsText("title");
  });
  d3.select("#body").on("input", () => {
    autoResize("body");
    changeJsText("body");
  });

  d3.select("#title").on("change", () => {
    autoTrim("title");
  });
  d3.select("#body").on("change", () => {
    autoTrim("body");
  });

  // add item button
  d3.select("#addItem").on("click", () => {
    addNote();
  });
}
init();
