import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";

import { IChat } from "../../model/chat";
import { DataService } from "../data.service";
import { DB } from "../db.service";

// class Chat implements IChat {}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements AfterViewInit {
  public model: IChat;
  public chats;
  public user;

  private fbChatSub;

  @ViewChild("chatStream") public container: ElementRef;

  resetModel() {
    this.model = {} as IChat;
  }

  constructor(private dataSvc: DataService, private firebase: DB) {
    this.dataSvc.getUser().subscribe((res: any) => {
      this.user = res.results[0];
    });

    this.resetModel();
  }

  /**
   * Scroll the chat control to the bottom per stand UX expectations
   */
  scrollToBottom(): void {
    if (this.container) {
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    }
  }

  /**
   * Load chats, etc.
   */
  ngAfterViewInit() {
    this.fbChatSub = this.firebase.firestore
      .collection("chat")
      .orderBy("dateCreatedUnix")
      .limit(20)
      .onSnapshot(
        (snap) => {
          this.chats = [];
          snap.forEach((doc) => {
            this.chats.push(doc.data());
          });
          // timeout to give chats time to load
          setTimeout(() => {
            this.scrollToBottom();
          }, 300);
        },
        (error) => {
          console.log("Error loading chats", error);
        }
      );
  }

  /**
   * Handle user submitting chat
   */
  onSubmit() {
    if (this.model.text != "" && this.model.text != undefined) {
      this.model.dateCreatedUnix = Date.now();
      this.model.from = this.user;
      this.firebase.firestore.collection("chat").add(this.model);
      this.resetModel();
      this.scrollToBottom();
    }
  }

  /**
   * track by for chats
   * @param index
   * @param item
   */
  public tracker(index, item): any {
    return item.$id;
  }

  /**
   * Clean up
   */
  ngOnDestroy() {
    this.fbChatSub();
  }
}
