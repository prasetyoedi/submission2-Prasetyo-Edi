import './styles.css';
import './components/AppBar';
import './components/NoteItem';
import './components/NoteList';
import Swal from 'sweetalert2';

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const loadingElement = document.getElementById('loading');

async function fetchNotes() {
  try {
    loadingElement.style.display = 'block';
    const response = await fetch(`${BASE_URL}/notes`);
    if (!response.ok) throw new Error('Network response was not ok');
    const responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch notes',
    });
  } finally {
    loadingElement.style.display = 'none';
  }
}

async function addNoteToApi(note) {
  try {
    loadingElement.style.display = 'block';
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to add note',
    });
  } finally {
    loadingElement.style.display = 'none';
  }
}

export async function deleteNoteFromApi(noteId) {
  try {
    loadingElement.style.display = 'block';
    const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to delete note',
    });
  } finally {
    loadingElement.style.display = 'none';
  }
}

export async function archiveNoteInApi(noteId) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
      method: 'PUT',
      mode: 'no-cors',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to archive note',
    });
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const noteListElement = document.querySelector('note-list');

  const notes = await fetchNotes();
  notes.forEach((note) => {
    const noteElement = document.createElement('note-item');
    noteElement.setAttribute('id', note.id);
    noteElement.setAttribute('title', note.title);
    noteElement.setAttribute('body', note.body);
    noteElement.setAttribute('created-at', note.createdAt);
    noteListElement.addNoteElement(noteElement);
  });

  const addNoteForm = document.getElementById('add-note-form');
  addNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const body = document.getElementById('note-body').value;

    const newNote = {
      title,
      body,
    };

    const response = await addNoteToApi(newNote);
    if (response && response.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Note added successfully!',
      });

      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('id', response.data.id);
      noteElement.setAttribute('title', response.data.title);
      noteElement.setAttribute('body', response.data.body);
      noteElement.setAttribute('created-at', response.data.createdAt);
      noteListElement.addNoteElement(noteElement);
      addNoteForm.reset();
    }
  });
});
