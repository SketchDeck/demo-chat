import { Component, OnInit, AfterViewChecked, Inject, ViewChild, ElementRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';

import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { IChat } from '../../model/chat';
import { DataService } from '../data.service';
import { NgAisModule } from 'angular-instantsearch';

// class Chat implements IChat {}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked
{
  chatCollection: AngularFirestoreCollection<IChat>;
  chat$: Observable<IChat[]>;
  model: IChat;

  user$: Observable<Object>;
  userObject: Object;

  @ViewChild('chatStream') private container: ElementRef;

  resetModel(){
  	this.model = {} as IChat;
  }

  constructor(
      db: AngularFirestore, 
      data: DataService) 
  {
    this.chatCollection = db.collection<IChat>('chat', ref => ref.orderBy("dateCreated"))
    this.chat$ = this.chatCollection.valueChanges();
    this.user$ = data.getUser();

    this.chat$.subscribe(() => {this.scrollToBottom()})

    this.resetModel();
  }

  scrollToBottom(): void {
      try {
        this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
      } catch(err) { 
        console.error(err);
        console.log(this.container);
      }                 
    }

  ngOnInit() {
    this.algoliaConfig = {
	    apiKey: '9631efee5b7518aecd0fd96df17a1427',
	    appId: 'JYBBND0XOY',
	    indexName: 'users',
	    routing: true
	  };
    this.user$.first().subscribe( (u) => this.userObject = u );
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  onSubmit() {

    if (this.model.text != "" && this.model.text != undefined) {
    	this.model.dateCreated = firebase.firestore.FieldValue.serverTimestamp()
      this.model.from = this.userObject;
      this.chatCollection.add(this.model);
      this.resetModel();
      this.scrollToBottom();
    }
   
  }

  public tracker(index, item):any {
    return item.$id;
  }

  


}
