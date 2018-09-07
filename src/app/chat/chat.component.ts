import { Component, OnInit, AfterViewChecked, Inject, ViewChild, ElementRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators'
import { first } from 'rxjs/operators';

import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { IChat } from '../../model/chat';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked
{
  chatCollection: AngularFirestoreCollection<IChat>;
  chat$: Observable<IChat[]>;
  
  user$: Observable<Object>;
  userObject: Object;

  @ViewChild('chatStream') private container: ElementRef;

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

    this.chat$.subscribe(() => {this.scrollToBottom()});
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
    this.user$.pipe(first()).subscribe( (u) => this.userObject = u );
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }

  public tracker(index, item):any {
    return item.$id;
  }

}
