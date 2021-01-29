import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { User } from '../models/user';
import { Storage } from '@ionic/storage';
import { constant } from '../constants/constant'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  dresser = constant.hairdresser[0];

  startKey: boolean = false;
  othersTyping:boolean=false;

  messageList: any[] = [];
  chatMessage: string = "";
  currentUser: any;
  clientId: any;
  clientSocketId = '';

  @ViewChild('chatText') public chatText: ElementRef;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private storage: Storage,
    private activeRouter: ActivatedRoute,
    private renderer: Renderer2
  ) {
    router.events
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          window.location.reload();
          console.log('sdfsdfsdfsdf')
        }
      });

  }



  ngOnInit() {
    this.activeRouter.paramMap.subscribe(params => {
      this.clientId = params.get('clientId');
      console.log('this.clientId')
      console.log(this.clientId)

      this.startChat();
    });

    this.chatService.confirmConnectClientToDresser().subscribe(result => {
      console.log('result')
      console.log(result)
      if (result) {
        this.clientSocketId = result;

        alert('client enter the room!')
      }
    });
    this.chatService.ClientExit().subscribe(result => {

      alert('Client disconnected!')
      this.clientSocketId = result;



    });

    this.chatService.receiveMessageFromClient().subscribe((result) => {
      const text = `${result.client.firstname} ${result.client.lastname}: ${result.message}`
      const p = this.renderer.createElement('p');
      const d = this.renderer.createText(text);
      this.renderer.appendChild(p, d);
      this.renderer.appendChild(this.chatText.nativeElement, p);
    });

    this.chatService.backMessageToDresser().subscribe(result => {
      const text = `${result.dresser.firstname} ${result.dresser.lastname}: ${result.message}`
      const p = this.renderer.createElement('p');
      const d = this.renderer.createText(text);
      this.renderer.setStyle(p, 'text-align', 'right');
      this.renderer.appendChild(p, d);
      this.renderer.appendChild(this.chatText.nativeElement, p);
    });
    this.chatService.receiveUntyping().subscribe(result=>{
      this.othersTyping=true;
    })
    this.chatService.receiveUntyping().subscribe(result=>{
      this.othersTyping=false;
    })

  }
  startChat() {
    this.chatService.clickStartButton(this.dresser.id, this.clientId);


  }
  enterRoom() {
    this.chatService.dresserEnterRoom(this.clientId);
    // this.chatService.disconnect();
    this.router.navigateByUrl('/chat-provider/' + this.clientId)
  }

  sendMessage() {
    if (this.clientSocketId == '') {
      alert('client does not enter!')
      this.chatMessage = ''
      return;

    }

    if (this.chatMessage == '')
      return;
    console.log('this.chatMessage')
    console.log(this.chatMessage)
    this.chatService.sendMessage(this.clientSocketId, { dresser: this.dresser, message: this.chatMessage });
    this.chatMessage = '';

  }

  Exit() {
    this.chatService.Exit();
    window.history.go(-1);

  }
  Typing(){
    this.chatService.Typing(this.clientSocketId);
  }
  Untyping(){
    this.chatService.Untyping(this.clientSocketId);
  }

}
