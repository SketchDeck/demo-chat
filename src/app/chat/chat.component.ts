
import {first} from 'rxjs/operators';
import {
  Component,
  OnInit,
  AfterViewChecked,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { TitleCasePipe } from "@angular/common";

import { Observable ,  Subscription } from "rxjs";
import "rxjs/add/operator/first";
import * as firebase from "firebase";

import { IChat } from "../../model/chat";
import { DataService } from "../data.service";

// class Chat implements IChat {}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chat$: Observable<IChat[]>;
  model: IChat;

  user$: Observable<Object>;
  userObject: Object;

  @ViewChild("chatStream") private container: ElementRef;

  resetModel() {
    this.model = {} as IChat;
  }

  constructor(
    // db: AngularFirestore,
    data: DataService
  ) {
    // this.chatCollection = db.collection<IChat>('chat', ref => ref.orderBy("dateCreated"))
    // this.chat$ = this.chatCollection.valueChanges();
    this.user$ = data.getUser();

    this.chat$.subscribe(() => {
      this.scrollToBottom();
    });

    this.resetModel();
  }

  scrollToBottom(): void {
    try {
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
      console.log(this.container);
    }
  }

  ngOnInit() {
    this.user$.pipe(first()).subscribe((u) => (this.userObject = u));
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onSubmit() {
    if (this.model.text != "" && this.model.text != undefined) {
      this.model.dateCreated = firebase.firestore.FieldValue.serverTimestamp();
      this.model.from = this.userObject;
      // this.chatCollection.add(this.model);
      this.resetModel();
      this.scrollToBottom();
    }
  }

  public tracker(index, item): any {
    return item.$id;
  }
}
