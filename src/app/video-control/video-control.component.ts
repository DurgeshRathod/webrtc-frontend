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
  socket;
  room_id = "ROOM-1"
  ngOnInit() {
    this.socket = this.socketService.socket;
    this.socket.emit("JOIN_ROOM", this.room_id);
    // navigator.mediaDevices.getUserMedia({ video: true , audio: true,}).then((stream: any) => {});
  }
  client = {
    gotAnswer: false,
    peer: undefined
  }
  vid: any;
  stream: any;
  video;
  toggleVideo() {
    this.videoON = !this.videoON;
    if (this.videoON) {
      navigator.mediaDevices.getUserMedia({ video: true , audio: true}).then((stream: any) => {
        this.stream = stream
        this.socket.emit('NewClient')
        this.vid = document.getElementById("vidId");
        this.vid.srcObject = stream;
        this.vid.play();


        //used to initialize a peer
        function InitPeer(type) {
          let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
          peer.on('stream', function (stream) {
            console.log('peer on stream called');
            console.log(stream);
            
            // CreateVideo(stream)

            // this.video = document.createElement('video');
            // this.video.id = 'peerVideo';
            this.video = document.getElementById("peerVideo");
            
            this.video.srcObject = stream;
            this.video.play();
            // this.video.setAttribute('class', 'embed-responsive-item');
            // document.querySelector('#peerDiv').appendChild(this.video);
            // this.video.play();
         
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
        let MakePeer = () => {
          console.log("Make Peer called due to CreatePeer");

          this.client.gotAnswer = false
          let peer = InitPeer('init')
          peer.on('signal', (data) => {
            console.log('peer on signal called');
            
            if (!this.client.gotAnswer) {
              this.socket.emit('Offer', { room: this.room_id, offer: data });
            }
          })
          this.client.peer = peer
        }

        //for peer of type not init
        let FrontAnswer = (offer) => {
          let peer = InitPeer('notInit')
          peer.on('signal', (data) => {
            this.socket.emit('Answer', {room:this.room_id, data:data})
          })
          peer.signal(offer)
          this.client.peer = peer
        }





        // this.socket.on('BackOffer', FrontAnswer);
        this.socket.on('BackOffer', (offer) => {
          console.log("Backoffer called")
          let peer = InitPeer('notInit')
          peer.on('signal', (data) => {
            console.log('peer ');
            
            this.socket.emit('Answer', data)
          })
          peer.signal(offer)
          this.client.peer = peer
        });
        this.socket.on('BackAnswer', (answer) => {
          this.client.gotAnswer = true
          let peer = this.client.peer
          peer.signal(answer)
        });
        this.socket.on('CreatePeer', MakePeer());
        this.socket.on('Disconnect', RemovePeer);
        console.log(stream)
      }).catch((err) => {
        console.log(err)
      })
    } else {
      this.vid.pause;
      this.vid.srcObject = null
      // this.stream.stop();
      this.stream.getTracks().map(function (track) {
        // if (track.kind == "video") {
          track.stop();
        // }

      });
    }
  }

}
