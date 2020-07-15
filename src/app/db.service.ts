import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/firestore";

import { environment } from "../environments/environment";

@Injectable()
export class DB {
  public firestore;

  constructor() {
    const config = {
      apiKey: environment.firebase.apiKey,
      authDomain: environment.firebase.authDomain,
      databaseURL: environment.firebase.databaseURL,
      projectId: environment.firebase.projectId,
      storageBucket: environment.firebase.storageBucket,
      messagingSenderId: environment.firebase.messagingSenderId,
    };
    firebase.initializeApp(config);

    this.firestore = firebase.firestore();
  }
}
