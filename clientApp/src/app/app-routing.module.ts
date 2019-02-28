import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatSearchComponent } from './chat-search/chat-search.component';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent
  },
  {
    path: 'chat-search',
    component: ChatSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
