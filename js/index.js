// functions
function loadSaved() {
  var storedNotes = localStorage.getItem("notes");
  var storedNoteIndex = localStorage.getItem("noteIndex");

  if (storedNotes && storedNoteIndex) {
    notes = JSON.parse(storedNotes);
    noteIndex = parseInt(storedNoteIndex);
  }
  if (notes.length == 0) {
    notes.push({
      title: "",
      body: "",
      color: "",
      deleted: false,
    });
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
function changeJsText(id) {
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
function updateSidebar() {
  var ul = document.getElementById("notes");
  ul.innerHTML = "";
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    displayTitle =
      note.title.length < 25 ? note.title : note.title.substring(0, 20) + "...";
    displayTitle = displayTitle == "" ? "Untitled Note" : displayTitle;
    console.log(note.title.length);
    var liHTML =
      `<li class = "noteItem" id = ${i}>` +
      "<h3>" +
      displayTitle +
      "</h3>" +
      `<button class="deleteItem" id = ${i}>` +
      '<span class="material-symbols-outlined"> delete </span>' +
      "</button>" +
      "</li>";

    ul.innerHTML += liHTML;
  }
  var listItems = document.querySelectorAll(".noteItem");
  listItems.forEach(function (listItem) {
    listItem.addEventListener("click", function () {
      var itemId = listItem.id;
      // Call the clicked function and pass the item ID
      console.log(itemId);
      noteIndex = itemId;
      updateTextArea();
    });
  });

  var listItems = document.querySelectorAll(".deleteItem");
  listItems.forEach(function (listItem) {
    listItem.addEventListener("click", function () {
      var itemId = listItem.id;
      // Call the clicked function and pass the item ID
      if (notes.length == 0) {
        notes.push({
          title: "",
          body: "",
          color: "",
          deleted: false,
        });
      }
      notes.splice(itemId, 1);
      updateSidebar();
      SaveLoaded();

      // updateTextArea();
    });
  });
}
function updateTextArea() {
  if (noteIndex > notes.length - 1) {
    noteIndex = 0;
  }
  const title = document.getElementById("title");
  const body = document.getElementById("body");
  title.value = notes[noteIndex].title;
  body.value = notes[noteIndex].body;
}
function init() {
  notes = {};
  noteIndex = 0;
  loadSaved();
  updateSidebar();
  updateTextArea();
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
  d3.select("#addItem").on("click", () => {
    notes.push({
      title: "",
      body: "",
      color: "",
      deleted: false,
    });
    updateSidebar();
    SaveLoaded();
  });
}
init();
