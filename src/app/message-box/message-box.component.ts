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

  handleSearch($event) {
    // if type "@", trigger the autocomplete menu
    if (this.model.text && this.model.text.match(/^@/)) {
      this.data.queryUsers(this.model.text.substring(1))
        .subscribe((data: any[]) => {
          this.hits = data.hits;
          console.log('got hits', this.hits);
        });
    } else {
      this.hits = [];
    }
  }
}
