import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-control',
  templateUrl: './video-control.component.html',
  styleUrls: ['./video-control.component.css']
})
export class VideoControlComponent implements OnInit {

  constructor() { }

  videoON = true;
  ngOnInit() {
  }

  toggleVideo(){
    this.videoON = !this.videoON;
  }
}
