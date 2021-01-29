import { Client } from './../../../../client.model';
import { Component, OnInit,Renderer2,ViewChild,ElementRef } from '@angular/core';
import { Router,ActivatedRoute,NavigationStart} from '@angular/router';
import { ChatService } from '../services/chat.service';
import { User } from '../models/user';
import { Storage } from '@ionic/storage';
import{constant} from '../constants/constant' 

@Component({
  selector: 'app-chat-client',
  templateUrl: './chat-client.component.html',
  styleUrls: ['./chat-client.component.scss']
})
export class ChatClientComponent implements OnInit {
  dresser=constant.hairdresser[0];
  client=constant.client[0];
  messageList: any[] = [];
  chatMessage: string = "";
  currentUser:any;
  dresserSocketId='';
  othersTyping:boolean=false;

  @ViewChild('chatText') public chatText: ElementRef;

  constructor(
    private router: Router,
     private chatService: ChatService,
     private storage:Storage,
     private activeRouter:ActivatedRoute,
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
    this.chatService.confirmConnectClient(this.dresser.id,this.client.id);

    this.chatService.startChattingToClient().subscribe(result=>{
      console.log('result')
      console.log(result)
      this.dresserSocketId=result;
      alert('Hairdresser entered the chatting room. Start chatting')
    })

    this.chatService.backToClient().subscribe(result=>{
      console.log('result')
      console.log(result)
      if(result=='fail'){
        alert('There is no hairdresser in the chatting room.')
        window.history.go(-1);
        // this.chatService.forceDisconnect();
        // this.router.navigateByUrl('/start-client')
      }

    })
    this.chatService.DresserExit().subscribe(result=>{
      console.log('result')
      console.log(result)


        alert('Hairdresser disconnected!');
        this.dresserSocketId=result;


    })
    

      this.chatService.receiveMessageFromDresser().subscribe((result) => {
        const text=`${result.dresser.firstname} ${result.dresser.lastname}: ${result.message}`
        const p = this.renderer.createElement('p');
        const d = this.renderer.createText(text);
        this.renderer.appendChild(p, d);
        this.renderer.appendChild(this.chatText.nativeElement, p);
      });   

      this.chatService.backMessageToClient().subscribe(result => {
        const text=`${result.client.firstname} ${result.client.lastname}: ${result.message}`
        const p = this.renderer.createElement('p');
        const d = this.renderer.createText(text);
        this.renderer.setStyle(p,'text-align','right');
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

  sendClientMessage() {
    if(this.dresserSocketId==''){
      alert('hairdresser does not enter!')
      this.chatMessage=''

      return;
    }
    if(this.chatMessage=='')
    return;
    console.log('this.chatMessage')
    console.log(this.chatMessage)
    this.chatService.sendClientMessage(this.dresserSocketId,{client:this.client,message:this.chatMessage});
    this.chatMessage='';
  }

  Typing(){
    this.chatService.Typing(this.dresserSocketId);
  }
  Untyping(){
    this.chatService.Untyping(this.dresserSocketId);
  }

  Exit(){
    this.chatService.Exit();
    window.history.go(-1);
  }
  ngAfterViewInit(){

  }
  ngOnDestroy() {

}
}

