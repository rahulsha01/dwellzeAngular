import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicationComponent } from './communication.component';
import { MeetingScheduleComponent } from './meeting-schedule/meeting-schedule.component';
import { EventComponent } from './event/event.component';
import { BroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { ProcessRequestComponent } from './process-request/process-request.component';
import { AlbumComponent } from './album/album.component';
import { NoticeBoardComponent } from './notice-board/notice-board.component';


const routes: Routes = [
  {
    path: '',
    component: CommunicationComponent,
    data: {
      breadcrumb: 'communication'
    },
    children: [{
      path: '',
      redirectTo: 'meeting-schedule',
      pathMatch: 'full'
    },
    {
      path: 'meeting-schedule',
      component: MeetingScheduleComponent,
      data: {
        breadcrumb: 'Meetings'
      }
    },
    {
      path: 'event',
      component: EventComponent,
      data: {
        breadcrumb: 'Event'
      }
    },
    {
      path: 'broadcast-message',
      component: BroadcastMessageComponent,
      data: {
        breadcrumb: 'Broadcast Message'
      }
    }, {
      path: 'album',
      component: AlbumComponent,
      data: {
        breadcrumb: 'Album'
      }
    },
    {
      path: 'process-request',
      component: ProcessRequestComponent,
      data: {
        breadcrumb: 'process request'
      }
    },
    {
      path: 'notice-board',
      component: NoticeBoardComponent,
      data: {
        breadcrumb: 'Notice Board'
      }
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule { }
