import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../../actions';
import axios from 'axios';
import {Button, Col} from 'react-bootstrap';

class Annotations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      end: null,
      emotion: 'Anger',
      desc: '',
      select: null,
      Anger: 0,
      Contempt: 1,
      Disgust: 2,
      Fear: 3,
      Happiness: 4,
      Neutral: 5,
      Sadness: 6,
      Surprise: 7,
      error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.zoom = this.zoom.bind(this);
    this.deSelect = this.deSelect.bind(this);
    this.findLargest = this.findLargest.bind(this);
    this.preview = this.preview.bind(this);
    console.log(this);

  }

  componentDidMount() {

  }

  handleChange(e) {
    e.preventDefault();
    let name = e.target.name;
    let val = e.target.value;
    this.setState({
      [name]: val
    });
    // console.log(this);
  }

  addAnnotation(e) {
    e.preventDefault();

    let annotation = {
      time: this.state.time,
      end: this.state.end,
      emotion: this.state.emotion,
      option: this.props.currentOption,
      desc: this.state.desc
    };
    axios.post('/api/option/addAnnotation', annotation);

    this.props.annotations.annotations.push(annotation);

    this.props.annotations.annotations.forEach(anno => {
      if (this.state.time === anno.time) {
        anno.emotion = this.state.emotion;
        anno.desc = this.state.description;
      }
    });
    var temp = {
      annotations: this.props.annotations.annotations
    };
    this.props.actions.changeAnnotations(temp);
  }

  zoom(ann) {
    // console.log('zoom');
    if (ann.end) {
      this.props.graph.zoom([ann.time - 3, ann.end + 3]);
    } else {
      this.props.graph.zoom([ann.time - 3, ann.time + 3]);
    }
    
    this.props.graph.select([ann.emotion], [ann.time]);
    this.props.player.seekTo(ann.time);
  }

  deSelect(e) {
    e.preventDefault();
    this.props.graph.unzoom();
  }

  findLargest(ann) {
    var emotion;

    if (ann.end) {
      var test = 0;
      for (var i = ann.time; i < ann.end; i++) {
        test += this.props.optionEmotionObj.emotionAvg[this.state[ann.emotion]][i]
      }
      test = test / (ann.end - ann.time);
      // console.log('test', test);
      this.props.optionEmotionObj.emotionAvg.forEach(elem => {
        // console.log('WORKINGGGG');
        var temp = 0;
        for(var i = ann.time; i < ann.end; i++) {
          temp += elem[i]
        }
        temp = temp / (ann.end - ann.time);
        // console.log(elem[0], temp);
        if (temp > test) {
          test = temp;
          emotion = elem[0];
        }
        
      });
      // console.log(test, emotion)
      if (emotion) {
        return (
          <p> {emotion}: {test} </p>
        );
      } else {
        return (
          <p> {ann.emotion} </p>
        );
      }

    } else {
      var test = this.props.optionEmotionObj.emotionAvg[this.state[ann.emotion]][ann.time];
      this.props.optionEmotionObj.emotionAvg.forEach(elem => {
        if (elem[0] !== ann.emotion) {
          if (elem[ann.time] > test) {
            test = elem[ann.time];
            emotion = elem[0];
          }
        }
      });
      if (emotion) {
        return (
          <p> {emotion}: {test} </p>
        );
      } else {
        return (
          <p> {ann.emotion} </p>
        );
      }
    }

  }

  preview(e) {
    e.preventDefault();
    this.props.player.seekTo(this.state.time);
  }



  render() {
    let annotations = this.props.annotations.annotations.map((ann, i) => {
      return (
        
        <div onClick={() => {
          this.zoom(ann);
        }} className="annotations">
          <Col md={6}>
            <p> Start: {Math.floor(ann.time/60)}:{ann.time%60 < 10 ? '0' + ann.time%60 : ann.time%60}  </p>
            {ann.end ? (<p> End: {Math.floor(ann.end/60)}:{ann.end%60 < 10 ? '0' + ann.end%60 : ann.end%60} </p>)  : null}
            <p> Emotion: {ann.emotion} </p>
            <p> Description: {ann.desc} </p>

          </Col>
          <Col md={6}>

            <p> {`Expected Emotion Score: ${(this.props.optionEmotionObj.emotionAvg[this.state[ann.emotion]][ann.time] + this.props.optionEmotionObj.emotionAvg[this.state[ann.emotion]][ann.time])/2}`} </p>

            <p> {`Highest Emotion:`} </p>
            {this.findLargest(ann)}
            
          </Col>
        </div>
      );
    });
    var unselect = {
      float: 'right',
      marginRight: '16px'
    };
    return (
      <Col md={12}>
        <h3 className="optionAnnotationsTitle"> Annotations </h3>
        <div className="optionAnnotations">
          <div className="annotationForm">
            <h5> Add Annoation </h5>
            <form>
              <label> 
            Start: 
                <input type="number" name="time" value={this.state.time} onChange={this.handleChange} required/>
              </label>
              <label> 
            End: 
                <input type="number" name="end" value={this.state.end} onChange={this.handleChange} placeholder="Optional"/>
              </label>
              <br/>
              <label>
              Emotion: 
                <select name="emotion" value={this.state.emotion} onChange={this.handleChange}>
                  <option value="Anger">Anger</option>
                  <option value="Contempt">Contempt</option>
                  <option value="Disgust">Disgust</option>
                  <option value="Fear">Fear</option>
                  <option value="Happiness">Happiness</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Sadness">Sadness</option>
                  <option value="Surprise">Surprise</option>
                </select>
              </label>
              <br/>
              <label>
            Description:
                <input name="desc" value={this.state.desc} onChange={this.handleChange}/>
              </label>
              <br/>
              <Button onClick={this.preview}> Preview </Button>
              <Button onClick={this.addAnnotation}> Add </Button>
              <Button style={unselect} onClick={this.deSelect}> Unselect </Button>
            </form>
          </div>

          {annotations}
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    router: state.router,
    currentOptionAnnotations: state.currentOptionAnnotations,
    currentOption: state.currentOption,
    annotations: state.annotations,
    lineGraphData: state.lineGraphData
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (Annotations);
