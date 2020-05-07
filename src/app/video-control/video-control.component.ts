import { Component, OnInit } from '@angular/core';
import * as Peer from "simple-peer";
import { SocketioService } from '../socketio.service';


@Component({
  selector: 'app-video-control',
  templateUrl: './video-control.component.html',
  styleUrls: ['./video-control.component.css']
})
export class VideoControlComponent implements OnInit {

  constructor(private socketService: SocketioService) { }
  currentFilter
  videoON = false;
  socket
  ngOnInit() {
    this.socket = this.socketService.socket;
    this.socket.emit("JOIN_ROOM","ROOM-1")
  }
  client = {}
  vid: any;
  stream: any
  toggleVideo() { 
    this.videoON = !this.videoON;
    if (this.videoON) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream: any) => {
        this.stream = stream
        this.vid = document.getElementById("vidId");
        this.vid.srcObject = stream;
        this.vid.play();


         //used to initialize a peer
         function InitPeer(type) {
          let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
          peer.on('stream', function (stream) {
              CreateVideo(stream)
          })
          //This isn't working in chrome; works perfectly in firefox.
          // peer.on('close', function () {
          //     document.getElementById("peerVideo").remove();
          //     peer.destroy()
          // })
          // peer.on('data', function (data) {
          //     let decodedData = new TextDecoder('utf-8').decode(data)
          //     let peervideo = document.querySelector('#peerVideo')
          //     peervideo.style.filter = decodedData
          // })
          return peer
      }

      //for peer of type init
      function MakePeer() {
          this.client.gotAnswer = false
          let peer = InitPeer('init')
          peer.on('signal', function (data) {
              if (!this.client.gotAnswer) {
                this.socket.emit('Offer', data)
              }
          })
          this.client.peer = peer
      }

      //for peer of type not init
      function FrontAnswer(offer) {
          let peer = InitPeer('notInit')
          peer.on('signal', (data) => {
            this.socket.emit('Answer', data)
          })
          peer.signal(offer)
          this.client.peer = peer
      }

      function SignalAnswer(answer) {
          this.client.gotAnswer = true
          let peer = this.client.peer
          peer.signal(answer)
      }

      function CreateVideo(stream) {
          this.CreateDiv()

          let video = document.createElement('video')
          video.id = 'peerVideo'
          video.srcObject = stream
          video.setAttribute('class', 'embed-responsive-item')
          document.querySelector('#peerDiv').appendChild(video)
          video.play()
          //wait for 1 sec
          // setTimeout(() => SendFilter(this.currentFilter), 1000)

          video.addEventListener('click', () => {
              if (video.volume != 0)
                  video.volume = 0
              else
                  video.volume = 1
          })

      }

      function SessionActive() {
          document.write('Session Active. Please come back later')
      }


      function RemovePeer() {
          document.getElementById("peerVideo").remove();
          document.getElementById("muteText").remove();
          if (this.client.peer) {
              this.client.peer.destroy()
          }
      }

      this.socket.on('BackOffer', FrontAnswer)
      this.socket.on('BackAnswer', SignalAnswer)
      this.socket.on('SessionActive', SessionActive)
      this.socket.on('CreatePeer', MakePeer)
      this.socket.on('Disconnect', RemovePeer)
        console.log(stream)
      }).catch((err) => {
        alert(err)
      })
    } else {
      this.vid.pause;
      this.vid.srcObject = null
      // this.stream.stop();
      this.stream.getTracks().map(function (val) {
        if (val.kind == "video") {
          val.stop();
        }

      });
    }
  }

  CreateDiv() {
    let div = document.createElement('div')
    div.setAttribute('class', "centered")
    div.id = "muteText"
    div.innerHTML = "Click to Mute/Unmute"
    document.querySelector('#peerDiv').appendChild(div)
  }
}
