import { Component, OnInit, AfterViewChecked, Inject, ViewChild, ElementRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { map, filter, catchError, mergeMap } from 'rxjs/operators'
import 'rxjs/add/operator/first';

import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { IChat } from '../../model/chat';
import { DataService } from '../data.service';

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
  
  private el:HTMLElement;


  resetModel(){
  	this.model = {} as IChat;
  }

  constructor(
      db: AngularFirestore, 
      data: DataService,
      private http: HttpClient,
      el: ElementRef
  ) 
  {
    this.chatCollection = db.collection<IChat>('chat', ref => ref.orderBy("dateCreated"))
    this.chat$ = this.chatCollection.valueChanges();
    this.user$ = data.getUser();

    this.chat$.subscribe(() => {this.scrollToBottom()})

    this.resetModel();
    
    this.el = el.nativeElement;
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
  
  calcLeft() {
    if (this.el && this.el.parentNode) {
      let v = this.el.parentNode.getBoundingClientRect();
      return (v.x + 68).toString() + "px" 
    }
  }
  
  calcTop() {
    if (this.el && this.el.parentNode) {
       let v = this.el.parentNode.getBoundingClientRect();
       return (v.y + 160).toString() + "px"
    }
  }

  handleSearch($event) {
    // if type "@", trigger the autocomplete menu
    if (this.model.text && this.model.text.match(/^@/)) {
      let appId = 'JYBBND0XOY';
      let apiKey = '9631efee5b7518aecd0fd96df17a1427';
      let index = 'users';
      let term = this.model.text.substring(1);
      let searchUrl = `https://${appId}-dsn.algolia.net/1/indexes/${index}/query`;
      let options = {
        headers: {
          "X-Algolia-API-Key": apiKey,
          "X-Algolia-Application-Id": appId
        }
      };
      let data = {
        params: `query=${term}`
      };
      this.http.post(searchUrl, data, options)
      .pipe(
				map((data: any[]) => {
					console.log('getUser results', data, this);
					this.hits = data['hits'];
				})	
			)
			.subscribe();
    } else {
      this.hits = [];
    }
  }

}
