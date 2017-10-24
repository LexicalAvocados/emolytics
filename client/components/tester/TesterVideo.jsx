import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import ReactPlayer from 'react-player';
import axios from 'axios';
import TesterFinishedVideo from './TesterFinishedVideo.jsx';
import atob from 'atob';
import AWS from 'aws-sdk';
import S3Upload from 's3-bucket-upload';
// import cloudinary from 'cloudinary';
import ToggleDisplay from 'react-toggle-display';
import { Modal, Button } from 'react-bootstrap';
import {Circle} from 'react-shapes';

class TesterVideo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      video: {
        url: null,
        name: '',
        desc: ''
      },
      complete: false,
      time: {
        0: true
      },
      img: 0,
      show: false,
      key: '',
      height: 0,
      width: 0,
      eyeTime:{
        0: true
      },
    }
    this.videoStart = this.videoStart.bind(this);
    this.getWebcam = this.getWebcam.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.checkVideo = this.checkVideo.bind(this);
    this.processImage = this.processImage.bind(this);
    this.showOverlay = this.showOverlay.bind(this);
    this.likeClick = this.likeClick.bind(this);
    this.processImage = this.processImage.bind(this);
    this.eyeTracking = this.eyeTracking.bind(this);
    // this.upload = this.upload.bind(this);
  }
  componentWillMount() {
    // console.log(this);
    // axios.post('/api/tester/getVideo', {id: this.props.match.params.id})
    //   .then((data) => {
    //     console.log(data);
    //     this.setState({
    //       video: {
    //         url: data.data[0].youtubeUrl,
    //         name: data.data[0].name,
    //         desc: data.data[0].description
    //       }
    //     })

    //     this.props.actions.changeTesterOption(data.data[0]);
    //     console.log(this);
    //   })
    this.setState({
      video: {
        url: this.props.currentTesterOption.youtubeUrl,
        name: this.props.currentTesterOption.name,
        desc: this.props.currentTesterOption.description
      }
    })
  }

  componentDidMount() {

    this.setState({
      height: screen.height,
      width: screen.width
    }, () => {
      // console.log(this.state.height)
    })
    window.webgazer.setRegression('weightedRidge')
      .setTracker('clmtrackr')
      .begin()

    this.getWebcam();
    var runTimer = setInterval(() => {
      this.checkVideo()
    }, 1000)

    var eyeTrackingTimer = setInterval(() => {
      this.eyeTracking();
    }, 250)

    this.setState({
      runTimer: runTimer,
      eyeTrackingTimer: eyeTrackingTimer
    }, () => {
      this.state.timer();
      this.state.eyeTrackingTimer();
    })
    this.videoStart();

  }

  componentWillUnmount() {
    // console.log(this);
    clearInterval(this.state.runTimer);
    clearInterval(this.state.eyeTrackingTimer);
    window.webgazer.end();
  }

  clearVideoCheck() {
    clearInterval(this.state.checkVideo);
  }

  eyeTracking() {
    let prediction = window.webgazer.getCurrentPrediction();
    // console.log('prediction', prediction);
    var video = this.refs.video;
    var time = (Math.round(video.getCurrentTime() * 4) / 4).toFixed(2);
    // console.log(this.state.eyeTime);
    if (!this.state.eyeTime[time]) {
      // console.log(prediction);
      let newPrediction = {};
      newPrediction.x = (prediction.x/this.state.width).toFixed(3);
      newPrediction.y = (prediction.y/this.state.height).toFixed(3);
      this.state.eyeTime[time] = true;
      let sendObj = {
        prediction: newPrediction,
        time: time,
        option: this.props.currentTesterOption
      }
      // console.log('sending');
      axios.post('/api/tester/addEyeTracking', sendObj)
        // .then(data => {
        //   console.log(data);
        // })
    }

  }



  videoStart() {
    axios.post('/api/tester/startVideo', {
      option: this.props.currentTesterOption
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
    if (!this.state.time[time]) {
      this.takePicture();
      this.state.time[time] = true;
      this.processImage(time);

    }

  }



  showOverlay() {
    this.setState({
        show: true
      })
  }

  // upload(img) {
  //   cloudinary.config({
  //     cloud_name: 'dcp74bsm8',
  //     api_key: '169847461734926',
  //     api_secret: 'Gqk2mNBC1D8q3LJQe0b1fLokn-Y'
  //   });
  //   cloudinary.uploader.upload(
  //     img,
  //     function(res) {
  //       console.log('res from cloudinary', res)
        // Microsoft Post Request
        // var subscriptionKey = "4fc26d1500d04025a699f1ae74597ab3";
        // var uriBase = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?";
        // // var uriBase = "https://requestb.in/1ijcwry1";

        // // axios.get(uriBase);

        // // axios.post(uriBase, {data: byteArr});
        // // var instance = axios.create({
        // //   headers: {
        // //     "Content-Type" : "application/octet-stream"
        // //   }
        // // });
        // // instance.post('https://requestb.in/wpray0wp', byteArr);

        // // var url ='https://requestb.in/zdz1bczd'
        // // request(url, function (error, response, body) {
        // //   if (!error) {
        // //     console.log(body);
        // //   }
        // // });
  //     }
  //   )
  // }

  processImage(time) {

    var data = canvas.toDataURL('image/jpeg');


        // pure base64 data
        // var realData = data.replace(/^data:image\/(png|jpg);base64,/, "")

        // // blob data
        // var blobData = this.state.img[0];

        // // file format
        // var file = new File([blobData], 'test');

        // // form format
        // var fd = new FormData();
        // fd.append('data', blobData);

        // console.log('file format', file);
        // console.log('blob format', blobData);
        // console.log('form data', fd);

        // // test to see if image about to send is the correct one
        // var test = this.refs.test;
        // test.setAttribute('src', data);

        // var dataTest = data.split(',')[1];
        // var mimeType = data.split(';')[0].slice(5);

        // var bytes = window.atob(dataTest);
        // var buf = new ArrayBuffer(bytes.length);
        // var byteArr = new Uint8Array(buf);

        // for (var i = 0; i < bytes.length; i++) {
        //   byteArr[i] = bytes.charCodeAt(i);
        // }
        let currentTesterOption = this.props.currentTesterOption;
        return fetch(data)
          .then(res => res.blob())
          .then(blobData => {
            // Microsoft Post Request
            axios.get('/api/tester/getKey')
              .then(data => {

                var subscriptionKey = data.data[0].key;
                var uriBase = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?";

                var instance = axios.create({
                  headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    'Content-Type': "application/octet-stream"
                  }
                });

                instance.post(uriBase, blobData)
                  .then(data => {
                    // console.log((JSON.stringify(data.data, null, 2)));
                    if (data.data[0]) {
                      let sendObj = {
                        emotions: data.data[0].scores,
                        time: time,
                        option: currentTesterOption
                      }
                      axios.post('/api/tester/sendFrame', sendObj)
                    }
                    else {
                      let sendObj = {
                        time: time,
                        option: currentTesterOption
                      }
                      axios.post('/api/tester/sendFrame', sendObj)
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  })

              })
          });



        // Kairos post request
        // var instance = axios.create({
        //   timeout: 5000,
        //   headers: {
        //     "Content-Type" : "application/x-www-form-urlencoded",
        //     "app_id": '87bbd5b0',
        //     "app_key": '113158cf12ebfe904380eff729e99034'
        //   }
        // });

        // instance.post('https://api.kairos.com/v2/media', {
        //   source: fd
        // })
        //   .then(res => console.log(res))
        //   .catch(err => console.log(err))

        // var uriBase = 'https://requestb.in/wpray0wp';

        // axios.post(uriBase, byteArr);


        // instance.get('https://api.kairos.com/v2/analytics/59dfc67f3f273')
        //   .then(res => console.log(res))

    };
    likeClick(e) {
      e.preventDefault();

      axios.post('/api/tester/getVideo', {
        like: e.target.value
      })
      this.setState({
        show: false
      })


    }

  render() {
    var imgStyle = {
      opacity: 0

    }

    var circleStyle = {
      backgroundColor: 'red',
      position: 'absolute',
      left: this.state.x * 1.5,
      top: this.state.y,
      borderRadius: '6px',
      width:'10px',
      height: '10px',
      zIndex: '1000'
    }

    return (
      <div>
        <div style={circleStyle}></div>
        <ToggleDisplay className="overlay"  show={this.state.show}>
          <TesterFinishedVideo />
        </ToggleDisplay>

        <div className="videoPlayer">

          <ReactPlayer  className="videoWrapper" onStart={this.videoStart} onEnded={this.showOverlay} width='100%' height='100%' controls={true} ref="video" url={this.state.video.url} playing />
          <br/>
          <br/>

          <h2> {this.state.video.name} </h2>
          <h4> {this.state.video.desc} </h4>
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



const mapStateToProps = (state) => {
  // console.log('state', state);
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
  ) (TesterVideo)
