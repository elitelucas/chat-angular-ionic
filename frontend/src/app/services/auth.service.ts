import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable,throwError } from 'rxjs';
import { Storage } from '@ionic/storage';
import {catchError, map} from "rxjs/operators";

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_SERVER: string = 'http://localhost:3000';
  TTL= 1000 * 60 * 120;
  constructor(private http: HttpClient, private storage: Storage) { }

  register(userInfo: User){
    return this.http.post<any>(`${this.AUTH_SERVER}/auth/register`, userInfo).pipe(map(res=> {
      return res;
    }));;
  }

  login(userInfo: User){
    return this.http.post<any>(`${this.AUTH_SERVER}/auth/login`, userInfo).pipe(
      map(res => {
        if(res.token) {
          const now = new Date();
          this.storage.set("token", res.token);
          this.storage.set('currentUser', JSON.stringify(res.user));
          this.storage.set('tokenExpiredTime',JSON.stringify(this.TTL + now.getTime()));
        }
        return res;
      }), catchError( (error: HttpErrorResponse) => {
        if(error && error.status === 401) {
          return throwError( error );
        }
      })
    );
  }
}
