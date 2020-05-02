import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mic-control',
  templateUrl: './mic-control.component.html',
  styleUrls: ['./mic-control.component.css']
})
export class MicControlComponent implements OnInit {

  constructor() { }

  micON = true;
  ngOnInit() {
  }

  toggleMic(){
    this.micON = !this.micON;
  }
}
