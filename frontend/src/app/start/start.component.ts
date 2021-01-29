import { ChatService } from './../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import{constant} from '../constants/constant' 

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  clientId:any;
  dresser=constant.hairdresser[0];
  enterKey:boolean=false;


  constructor(
    private router:Router, 
    private activeRouter:ActivatedRoute,
    private chatService:ChatService
    ) { 
    this.activeRouter.paramMap.subscribe(params => {
      this.clientId = params.get('clientId');
      console.log('this.clientId')
      console.log(this.clientId)
    });
  }

  ngOnInit() {


    // this.chatService.confirmConnectClientToDresser().subscribe(result => {
    //   console.log('result')
    //   console.log(result)
    //   if(result=='enter'){
    //     this.enterKey=true;
    //   }
    // });
  }
  startChat(){
    this.router.navigateByUrl('/chat-provider/'+1)

    // this.chatService.clickStartButton(this.dresserId,this.clientId);


  }
  enterRoom(){
    this.chatService.dresserEnterRoom(this.clientId);
    this.router.navigateByUrl('/chat-provider/'+this.clientId)
  }

}
