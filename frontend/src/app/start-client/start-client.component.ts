import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatService } from './../services/chat.service';
import { Router } from '@angular/router';
import{constant} from '../constants/constant' 

@Component({
  selector: 'app-start-client',
  templateUrl: './start-client.component.html',
  styleUrls: ['./start-client.component.scss']
})
export class StartClientComponent implements OnInit {
  dresser=constant.hairdresser[0];
  client=constant.client[0];

  constructor(
    private chatService:ChatService,
    private router:Router

  ) { }

  ngOnInit() {
    console.log('sdfsdf')
    // this.chatService.dresserEnterRoomToClient().subscribe(result=>{
    //   console.log('result')
    //   console.log(result)
    //   alert('Hairdresser entered the chatting room.')
    //   this.router.navigateByUrl('chat-client')
    // })
  }
  startClientChat(){
    this.router.navigateByUrl('chat-client')
    // this.chatService.confirmConnectClient(this.dresserId,this.clientId);

  }
 
}
