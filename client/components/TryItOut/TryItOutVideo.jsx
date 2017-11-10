import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import ReactPlayer from 'react-player';
import axios from 'axios';
import TryerFinishedVideo from './TryerFinishedVideo.jsx';
import atob from 'atob';
import AWS from 'aws-sdk';
import S3Upload from 's3-bucket-upload';
// import cloudinary from 'cloudinary';
import ToggleDisplay from 'react-toggle-display';
import { Modal, Button } from 'react-bootstrap';

class TryItOutVideo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      video: {
        url: 'https://www.youtube.com/watch?v=gCcx85zbxz4',
        name: 'Try it out - Bladerunner trailer',
        desc: 'Just watch the video and see your reactions on the graph!'
      },
      complete: false,
      time: [0],
      img: 0,
      key: ''
    }
    this.videoStart = this.videoStart.bind(this);
    this.getWebcam = this.getWebcam.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.checkVideo = this.checkVideo.bind(this);
    this.processImage = this.processImage.bind(this);
    this.processImage = this.processImage.bind(this);
    // this.upload = this.upload.bind(this);
  }

  componentDidMount() {

    this.getWebcam();

    // this.videoStart();

  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    var list = document.getElementById("video");
    list.removeChild(list.childNodes[0])
  }

  clearVideoCheck() {
    clearInterval(this.state.checkVideo);
  }



  videoStart() {
    // axios.post('/api/tester/startVideo', {
    //   option: this.props.currentTesterOption
    // })
    var timer = setInterval(() => {
      this.checkVideo()
    }, 1000)
    this.setState({
      timer: timer
    }, () => {
      this.state.timer();
    })

  }

  getWebcam() {
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    var streaming = false;

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
          window.localstream = stream;
          video.srcObject = stream;
          video.play();
      })
      .catch(function(err) {
          console.log("An error occured! " + err);
      });
  }

  takePicture() {
    var canvas = this.refs.canvas;
    var context = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 250;
    context.drawImage(video, 0, 0, 300, 250);

    }

  checkVideo() {
    var video = this.refs.video;
    var time = Math.floor(video.getCurrentTime());
    var duration = Math.floor(video.getDuration());
    if (!this.state.time.includes(time)) {
      this.takePicture();
      this.state.time.push(time);
      this.processImage(time);
    }

  }

  processImage(time) {

    var data = canvas.toDataURL('image/jpeg');

    let currentTesterOption = this.props.currentTesterOption;
    return fetch(data)
      .then(res => res.blob())
      .then(blobData => {
        // Microsoft Post Request
        axios.get('/api/tester/getKey')
          .then(data => {
            // console.log('DATA', data)
            var subscriptionKey = data.data[0].key;
            var uriBase = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?";

            var instance = axios.create({
              headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/octet-stream'
              }
            });

           instance.post(uriBase, blobData)
            .then(data => {
              // return (JSON.stringify(data.data, null, 2));
              return data.data
            })
          .then( (emoObj) => {
            // console.log('emo obj after promise', emoObj[0].scores)
            if (emoObj[0]){
              this.props.setEmotionsArrFromObj(emoObj[0].scores, time);
            }
          })
      });
    });
  };

  render() {
    var imgStyle = {
      opacity: 0

    }

    return (
      <div>

        <div style={TryItOutVideoPlayerStyle} >
          <ReactPlayer  className="videoWrapper" onStart={this.videoStart} width='100%' height='100%' controls={true} ref="video" url={this.state.video.url} />
          <br/><br/>
        </div>


        <div >
          <video className="testerVideo" id="video">Video stream not available.</video>
        </div>
        <canvas className="testerVideo" ref="canvas" id="canvas">
        </canvas>
      </div>

    )
  }
}

const TryItOutVideoPlayerStyle = {
  marginLeft: '15%',
  marginRight: '15%',
  marginTop: '4%',
  position: 'relative',
  height: '40vh',
  width: '90%'
}

const mapStateToProps = (state) => {
  return ({
    currentTesterOption: state.currentTesterOption
  })
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
})





export default connect(
  mapStateToProps,
  mapDispatchToProps
  ) (TryItOutVideo)
