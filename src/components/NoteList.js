class NoteList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<section id="notes-container"></section>`;
  }

  addNoteElement(noteElement) {
    this.querySelector('#notes-container').appendChild(noteElement);
  }
}

customElements.define('note-list', NoteList);
