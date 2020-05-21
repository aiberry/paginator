import React from 'react';
import { observer } from 'mobx-react';
import { AppState } from './AppState';
import classNames from 'classnames';
import classes from './App.module.scss';

export interface IAppProps {}

@observer
export default class App extends React.Component<IAppProps> {
  private appState = new AppState();

  componentDidMount() {
    window.addEventListener('resize', this.appState.calculateFilling)
    this.appState.calculateFilling();
  }

  render() {
    const { setPrevAsCurrent, setNextAsCurrent, onNoteClick, notes } = this.appState;
    return (
      <div className={classes.root}>
        <button 
          ref={e => this.appState.btnPrevRef = e} 
          onClick={setPrevAsCurrent}>
            Prev
        </button>
        <div 
        className={classes.notesContainer} 
        ref={e => this.appState.notesContainerRef = e}
        >
          {notes.map(note => 
            <span 
              key={note.id + note.text}
              onClick={() => onNoteClick(note.id)}
              className={classNames(note.isCurrent ? classes.currentNote : '', note.isVisible ? '': classes.hiddenNote)} 
              ref={e => note.width = 16 + (e ? e.clientWidth : 0)}
              >{note.text}
            </span> 
          )}
        </div>
        <button 
          ref={e => this.appState.btnNextRef = e}
          onClick={setNextAsCurrent}>
            Next
        </button>
      </div>
    );
  }
}
