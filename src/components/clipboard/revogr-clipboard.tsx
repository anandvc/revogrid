import { Component, Listen, Method, Event, EventEmitter } from '@stencil/core';
import { RevoGrid } from '../../interfaces';

@Component({ tag: 'revogr-clipboard' })
export class Clipboard {
  @Event({ bubbles: false }) copyRegion: EventEmitter<DataTransfer>;
  @Event({ bubbles: false }) pasteRegion: EventEmitter<string[][]>;
  @Listen('paste', { target: 'document' }) onPaste(e: ClipboardEvent) {
    const data = this.getData(e).getData('text');
    this.pasteRegion.emit(this.parserPaste(data));
    e.preventDefault();
  }
  @Listen('copy', { target: 'document' }) copyStarted(e: ClipboardEvent) {
    this.copyRegion.emit(this.getData(e));
    e.preventDefault();
  }
  @Method() async doCopy(e: DataTransfer, data?: RevoGrid.DataFormat[][]) {
    e.setData('text/plain', data ? this.parserCopy(data) : '');
  }

  parserCopy(data: RevoGrid.DataFormat[][]) {
    return data.map(row => row.join('\t')).join('\n');
  }

  parserPaste(data: string) {
    const result: string[][] = [];
    const rows = data.split('\n');
    for (let y in rows) {
      result.push(rows[y].split('\t'));
    }
    return result;
  }

  private getData(e: ClipboardEvent) {
    return e.clipboardData || ((window as unknown) as { clipboardData: DataTransfer | null })?.clipboardData;
  }
}
