import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators'
import { IUser } from '../model/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

	constructor(private http: HttpClient) {

	}

	getUser() {
		return this.http.get('https://randomuser.me/api/')
			.pipe(
				map((data: any[]) => {
					console.log('getUser results', data);
					return data['results'][0];
				})	
			);
	}
	
	queryUsers(term): Observable<IUser[]> {
		let appId = 'JYBBND0XOY';
		let apiKey = '9631efee5b7518aecd0fd96df17a1427';
		let index = 'users';
		let searchUrl = `https://${appId}-dsn.algolia.net/1/indexes/${index}?query=${term}`;
		let options = {
			headers: {
			  "X-Algolia-API-Key": apiKey,
			  "X-Algolia-Application-Id": appId
			}
		};
		return this.http.get<IUser[]>(searchUrl, options);
	}

}
