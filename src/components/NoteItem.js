import { deleteNoteFromApi, archiveNoteInApi } from '../app';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'body', 'created-at', 'id'];
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="note">
        <h2>${this.getAttribute('title')}</h2>
        <p>${this.getAttribute('body')}</p>
        <small>${new Date(
          this.getAttribute('created-at')
        ).toLocaleDateString()}</small>
        <button class="archive-button">Archive</button>
        <button class="delete-button">Delete</button>
      </div>
    `;

    // Efek animasi masuk dengan GSAP
    gsap.from(this.querySelector('.note'), {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });

    // Event listener untuk tombol arsip
    this.querySelector('.archive-button').addEventListener(
      'click',
      async () => {
        const noteId = this.getAttribute('id');
        try {
          const result = await archiveNoteInApi(noteId);
          if (result.status === 'success') {
            Swal.fire('Success', 'Note archived successfully!', 'success');
            gsap.to(this.querySelector('.note'), {
              opacity: 0,
              scale: 0.9,
              duration: 0.5,
              ease: 'power2.in',
              onComplete: () => this.remove(),
            });
          } else {
            Swal.fire('Error', 'Failed to archive the note.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to archive the note.', 'error');
        }
      }
    );

    // Event listener untuk tombol hapus
    this.querySelector('.delete-button').addEventListener('click', async () => {
      const noteId = this.getAttribute('id');
      try {
        await deleteNoteFromApi(noteId);
        gsap.to(this.querySelector('.note'), {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => this.remove(),
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to delete the note.', 'error');
      }
    });
  }
}

customElements.define('note-item', NoteItem);
