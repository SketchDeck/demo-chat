import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get("https://randomuser.me/api/", {
      responseType: "json",
    });
  }
}
