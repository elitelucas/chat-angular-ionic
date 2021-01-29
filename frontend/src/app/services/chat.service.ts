import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Socket } from 'ng-socket-io';
import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io(environment.socket_endpoint,
    {'forceNew': true,'reconnection':true,'reconnectionDelay': 500,'reconnectionAttempts': 13333});

  INSTANCE_LOCATOR = 'YOUR_INSTANCE_LOCATOR';
  GENERAL_ROOM_ID = 'YOUR_ROOM_ID';
  GENERAL_ROOM_INDEX = 0;

  chatManager: ChatManager;
  currentUser;
  messages = [];


  usersSubject = new BehaviorSubject([]);
  messagesSubject = new BehaviorSubject([]);

  constructor(
    private http:HttpClient,
    // private socket:Socket
  ) { }

  public clickStartButton(dresserId, clientId) {
    console.log('dresserId') 
    console.log(dresserId) 
    console.log('clientId') 
    console.log(clientId) 

    this.socket.emit('clickStartButton', dresserId,clientId);
  }
  public confirmConnectClient(dresserId, clientId) {
    console.log('dresserId') 
    console.log(dresserId) 
    console.log('clientId') 
    console.log(clientId) 

    this.socket.emit('confirmConnectClient', dresserId,clientId);
  }

  public dresserEnterRoom(clientId){
    this.socket.emit('dresserEnterRoom', clientId);
  }

  public sendMessage(clientSocketId,data){
    this.socket.emit('sendTextFromDresser',clientSocketId,data)
  }

  public sendClientMessage(dresserSocketId,data){
    this.socket.emit('sendTextFromClient',dresserSocketId,data)
  }

  public reconnect(){
    this.socket.emit('reconnection')
  }
  public Typing(data){
    this.socket.emit('Typing',data)
  }
  public Untyping(data){
    this.socket.emit('Untyping',data)
  }
  public confirmConnectClientToDresser() {
    return Observable.create((observer) => {
      this.socket.on('confirmConnectClient', (enter) => {
        observer.next(enter)
      });
    })
  }

  public dresserEnterRoomToClient() {
    return Observable.create((observer) => {
      this.socket.on('dresserEnterRoom', (enter) => {
        observer.next(enter)
      });
    })
  }

  public startChattingToClient() {
    return Observable.create((observer) => {
      this.socket.on('startChatting', (enter) => {
        observer.next(enter)
      });
    })
  }

  public backToClient() {
    return Observable.create((observer) => {
      this.socket.on('backToClient', (enter) => {
        observer.next(enter)
      });
    })
  }

  public receiveMessageFromDresser() {
    return Observable.create((observer) => {
      this.socket.on('receiveMessageFromDresser', (data) => {
        observer.next(data)
      });
    })
  }

  public receiveMessageFromClient() {
    return Observable.create((observer) => {
      this.socket.on('receiveMessageFromClient', (data) => {
        observer.next(data)
      });
    })
  }


  public backMessageToDresser() {
    return Observable.create((observer) => {
      this.socket.on('backMessageToDresser', (data) => {
        observer.next(data)
      });
    })
  }

  public backMessageToClient() {
    return Observable.create((observer) => {
      this.socket.on('backMessageToClient', (data) => {
        observer.next(data)
      });
    })
  }

  public receiveTyping() {
    return Observable.create((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data)
      });
    })
  }
  public receiveUntyping() {
    return Observable.create((observer) => {
      this.socket.on('untyping', (data) => {
        observer.next(data)
      });
    })
  }
  public DresserExit() {
    return Observable.create((observer) => {
      this.socket.on('DresserExit', (data) => {
        observer.next(data)
      });
    })
  }

  public ClientExit() {
    return Observable.create((observer) => {
      this.socket.on('ClientExit', (data) => {
        observer.next(data)
      });
    })
  }
  

  public Exit() {
    this.socket.disconnect();
}

  public forceDisconnect(){
    this.socket.emit('forceDisconnect');
  }
  public connect(){
    console.log('connect')
  }
  
  

}


