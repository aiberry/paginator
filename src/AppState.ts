import { action as a, observable as o, computed as c} from 'mobx';
import { textNotes } from './constants'

export class AppState {
  @o notes = textNotes.map((text, index) => ({text, id: index, isVisible: false, isCurrent: !Boolean(index), width: 0}))
  notesContainerRef: HTMLElement | null = null; 
  btnPrevRef: HTMLButtonElement | null = null;
  btnNextRef: HTMLButtonElement | null = null;
  @c get freeSpace () {
    return this.notesContainerRef ? this.notesContainerRef.clientWidth : 0;
  };
  @c get indexOfCurrent(): number {
    return this.notes.findIndex(note => note.isCurrent === true)
  }
 
  launchFillingToTheRight (startIndex: number) {
    const { notes } = this;
    let availableSpace = this.freeSpace - notes[startIndex].width;
    notes[startIndex].isVisible = true;
    for (let i = startIndex + 1; i < notes.length; i++) {
      availableSpace = availableSpace - notes[i].width;
      notes[i].isVisible = availableSpace > 0;
    }
    for (let i = startIndex - 1; i >= 0; i--) {
      availableSpace = availableSpace - notes[i].width;
      notes[i].isVisible = availableSpace > 0;
    }
  }
  
  launchFillingToTheLeft(startIndex: number) {
    const { notes } = this;
    let availableSpace = this.freeSpace - notes[startIndex].width;
    notes[startIndex].isVisible = true;
    for (let i = startIndex - 1; i >=0 ; i--) {
      availableSpace = availableSpace - notes[i].width;
      notes[i].isVisible = availableSpace > 0;
    }
    for (let i = startIndex + 1; i < notes.length; i++) {
      availableSpace = availableSpace - notes[i].width;
      notes[i].isVisible = availableSpace > 0;
    }
  }

  @a setPrevAsCurrent = () => {
    const { notes, indexOfCurrent } = this;
    const indexOfPrevious = indexOfCurrent - 1;
    if (notes[indexOfPrevious]) {
      notes[indexOfCurrent].isCurrent = false;
      notes[indexOfPrevious].isCurrent = true; 
      if (!notes[indexOfPrevious].isVisible) {
        this.launchFillingToTheLeft(indexOfPrevious)
      }
      if (this.btnPrevRef && !notes[indexOfCurrent - 2]) {
      this.btnPrevRef.setAttribute('disabled', 'true')
      }
      if (this.btnNextRef) {
        this.btnNextRef.removeAttribute('disabled')
      }
    }
  }
  
  @a setNextAsCurrent = () => {
    const { notes, indexOfCurrent } = this;
    const indexOfNext = indexOfCurrent + 1;
    if (notes[indexOfNext]) {
      notes[indexOfNext].isCurrent = true; 
      notes[indexOfCurrent].isCurrent = false;
      if(!notes[indexOfNext].isVisible) {
        this.launchFillingToTheRight(indexOfNext)
      }
      if (this.btnNextRef && !notes[indexOfCurrent + 2]) {
        this.btnNextRef.setAttribute('disabled', 'true')
      }
      if (this.btnPrevRef) {
        this.btnPrevRef.removeAttribute('disabled')
      }
    }
  }

  @a onNoteClick = (id: number) => {
    const { notes } = this;
    notes[this.indexOfCurrent].isCurrent = false;
    const newNoteIndex = notes.findIndex(note => note.id === id);
    if (notes[newNoteIndex]) {
      notes[newNoteIndex].isCurrent = true;

      if (this.btnPrevRef) {
        if (newNoteIndex !== 0) {
          this.btnPrevRef.removeAttribute('disabled')
        } else {
          this.btnPrevRef.setAttribute('disabled', 'true')
        }
      }
      if (this.btnNextRef) {
        if (newNoteIndex !== notes.length - 1) {
          this.btnNextRef.removeAttribute('disabled')
        } else {
          this.btnNextRef.setAttribute('disabled', 'true')
        }
      }
    }
  }

  @a calculateFilling = () => {
    const { indexOfCurrent , notes } = this;
    let availableSpace = this.freeSpace;
    notes[indexOfCurrent].isVisible = true;
    availableSpace = availableSpace - notes[indexOfCurrent].width;
    for (let i = 1; i < indexOfCurrent || i < notes.length - indexOfCurrent ; i++) {
      const indexOfRight = indexOfCurrent + i;
      const indexOfLeft = indexOfCurrent - i;
      if(indexOfRight < notes.length) {
        if (availableSpace > notes[indexOfRight].width) {
          availableSpace = availableSpace - notes[indexOfRight].width;
          notes[indexOfRight].isVisible = true;
        } else {
          availableSpace = 0;
          notes[indexOfRight].isVisible = false;
        }
      }
      if(indexOfLeft >= 0) {
        if (availableSpace > notes[indexOfLeft].width) {
          availableSpace = availableSpace - notes[indexOfLeft].width;
          notes[indexOfLeft].isVisible = true;
        } else {
          availableSpace = 0;
          notes[indexOfLeft].isVisible = false;
        }
      }
    }
  }
}
