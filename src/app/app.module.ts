import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { ChatComponent } from "./chat/chat.component";
import { DataService } from "./data.service";

@NgModule({
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [DataService],
  declarations: [AppComponent, ChatComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
