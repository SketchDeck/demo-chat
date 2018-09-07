import { Component, OnInit, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { IUser } from '../../model/user';
import { IChat } from '../../model/chat';
import { DataService } from '../data.service';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {
  @Input('user') private user: IUser;
  
  private data: DataService;
  private el:HTMLElement;
  private selection;
  hits: IUser[] = [];
  model: IChat;
  chatCollection: AngularFirestoreCollection<IChat>;
  
  resetModel(){
  	this.model = {} as IChat;
  }

  constructor(
    db: AngularFirestore,
    data: DataService,
    el: ElementRef
  ) {
     this.el = el.nativeElement;
     this.chatCollection = db.collection<IChat>('chat', ref => ref.orderBy("dateCreated"))
     this.data = data;
     this.selection = 0;
     this.resetModel();
  }

  ngOnInit() {
  }
  
  onSubmit() {
    if (this.model.text != "" && this.model.text != undefined) {
    	this.model.dateCreated = firebase.firestore.FieldValue.serverTimestamp()
      this.model.from = this.user;
      this.chatCollection.add(this.model);
      this.resetModel();
      // this.scrollToBottom();
    }
  }

  calcLeft() {
    let el = <Element>this.el.parentNode;
    let v = el.getBoundingClientRect();
    return (v.left + 68).toString() + "px";
  }
  
  calcTop() {
    if (this.hits.length > 8) {
      return '-450px';
    }
    return ((51 * this.hits.length * -1) - 18).toString() + "px";
    let el = <Element>this.el.parentNode;
    let v = el.getBoundingClientRect();
    return (v.top + 140 + (this.el.clientHeight)).toString() + "px";
  }
  
  handleKey($event) {
    console.log("got a key", $event.key);
    if (this.hits.length === 0) {
      console.log('nothing to navigate');
      return;
    }
    
    // set handle text if enter, tab, up or down
    let setHandleText = false;
    
    // clear results on tab, enter or escape
    let clearResults = false;
    
    // escape key - close dialog, no change to text
    if ($event.key === 'Escape') {
      clearResults = true;
    }
    
    // enter or tab - use selected
    if ($event.key === 'Enter' || $event.key === 'Tab') {
      setHandleText = true;
      clearResults = true;
      $event.preventDefault();
    }
    
    // up or down arrow, navigate results
    if ($event.key == 'ArrowDown') {
      setHandleText = true;
      this.selection++;
      if (this.selection === this.hits.length) {
        this.selection = 0;
      }
    }
    
    if ($event.key === 'ArrowUp') {
      setHandleText = true;
      this.selection--;
      if (this.selection < 0) {
        this.selection = this.hits.length - 1;
      }
    }
    
    this.hits.forEach((user) => { delete user.selected });
    this.hits[this.selection].selected = true;
    if (setHandleText) {
      this.model.text = '@' + this.hits[this.selection].handle + ' ';
    }
    if (clearResults) {
      this.hits = [];
    }
  }

  handleSearch($event) { 
    // if type "@", trigger the autocomplete menu
    if (this.model.text && this.model.text.match(/^@/)) {
      this.data.queryUsers(this.model.text.substring(1))
        .subscribe((result: Array<IUser>) => {
          console.log('search data', result);
          this.hits = result;
          if (this.hits.length) {
            this.hits[this.selection].selected = true;
          }
        });
    } else {
      this.hits = [];
    }
  }
}
