import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommunicationComponent } from './communication.component';
import { CommunicationRoutingModule } from './communication-routing.module';
import { MeetingScheduleComponent } from './meeting-schedule/meeting-schedule.component';
import { EventComponent } from './event/event.component';
import { BroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { ProcessRequestComponent } from './process-request/process-request.component';
import { AlbumComponent } from './album/album.component';
import { NoticeBoardComponent } from './notice-board/notice-board.component';

@NgModule({
  imports: [
    SharedModule,
    CommunicationRoutingModule
  ],
  exports: [],
  declarations: [
    CommunicationComponent,
    MeetingScheduleComponent,
    EventComponent,
    AlbumComponent,
    BroadcastMessageComponent,
    ProcessRequestComponent,
    NoticeBoardComponent
  ],
  providers: [],
})
export class CommunicationModule { }
