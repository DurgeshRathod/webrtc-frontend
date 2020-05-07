import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mic-control',
  templateUrl: './mic-control.component.html',
  styleUrls: ['./mic-control.component.css']
})
export class MicControlComponent implements OnInit {

  constructor() { }

  micON = false;
  ngOnInit() {
  }

  stream: any
  toggleMic() {
    this.micON = !this.micON;
    if (this.micON) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream: any) => {
        this.stream = stream
        console.log(stream)
      }).catch((err) => {
        alert(err)
      })
    } else {
      this.stream.getTracks().map(function (val) {
        if (val.kind == "audio") {
          val.stop();
        }
      });
    }
  }
}
