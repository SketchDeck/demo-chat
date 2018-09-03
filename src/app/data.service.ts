import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators'

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

}
