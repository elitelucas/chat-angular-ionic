import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { StartClientComponent } from './start-client/start-client.component';
import { ChatClientComponent } from './chat-client/chat-client.component';

const routes: Routes = [
  { path: '', redirectTo: 'start-client', pathMatch: 'full' },
    { path: 'start/:clientId', component: StartComponent},
  { path: 'start-client', component: StartClientComponent},

  { path: 'chat-provider/:clientId', loadChildren: './chat/chat.module#ChatPageModule' },

  { path: 'chat-client', component: ChatClientComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
