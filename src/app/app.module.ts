import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoScreenComponent } from './video-screen/video-screen.component';
import { ControlToolbarComponent } from './control-toolbar/control-toolbar.component';
import { MicControlComponent } from './mic-control/mic-control.component';
import { VideoControlComponent } from './video-control/video-control.component';
import { SocketioService } from './socketio.service';
@NgModule({
  declarations: [
    AppComponent,
    VideoScreenComponent,
    ControlToolbarComponent,
    MicControlComponent,
    VideoControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
