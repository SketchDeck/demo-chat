import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators'
import * as algoliasearch from 'algoliasearch';

@Injectable()
export class DataService {

	constructor(private http: HttpClient) {
		let appId = 'JYBBND0XOY';
	    let apiKey = '9631efee5b7518aecd0fd96df17a1427';
	    let index = 'users';
	    let client = algoliasearch(appId, apiKey);
	    client.initIndex(index);
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
	
	

}
