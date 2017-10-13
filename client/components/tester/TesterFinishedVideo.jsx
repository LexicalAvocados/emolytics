import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class TesterFinishedVideo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      likeResponse: '',
      feedbackText: ''
    }
    this.LikeOnClick = this.LikeOnClick.bind(this);
    this.feedBackTextChange = this.feedBackTextChange.bind(this);
  }

  LikeOnClick(e) {
    this.setState({
      likeResponse: e.target.value
    })
  }

  feedBackTextChange(e) {
    this.setState({
      feedbackText: e.target.value
    })
  }

  render() {
      return (
        <div className="feedbackModal">

          <Modal show={true}>
            <Modal.Header>
              <Modal.Title>Feedback for Creator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="likeButtons">
                <Button onClick={this.LikeOnClick}> Like </Button>
                <Button onClick={this.LikeOnClick}> Eh </Button>
                <Button onClick={this.LikeOnClick}> Dislike </Button>
              </div>
              <div className="feedbackTextArea">
                <input type='text' placeholder='Any feedback for creator?'
                       value={this.state.feedbackText} onChange={this.feedBackTextChange}>
                </input>
              </div>
              <div className='controlButtons'>
                <Button>Close</Button>
                <Button bsStyle="primary">Submit</Button>
              </div>

            </Modal.Body>
          </Modal>

        </div>
      )
    }

};

export default TesterFinishedVideo;
