import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import axios from 'axios';

class TesterFinishedVideo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      like: true,
      dislike: false
    }
    this.likeClick = this.likeClick.bind(this);
  }


  likeClick(e) {
    e.preventDefault();
    axios.post('/api/tester/likeVideo', {
      like: e.target.value,
      option: this.props.currentTesterOption
    })
  }

  render() {
      return (
        <div>
          <Button value={this.state.like} onClick={this.likeClick}> Like </Button>


          <Button value={this.state.dislike} onClick={this.likeClick}> Dislike </Button>


        </div>
      )
    }

};

const mapStateToProps = (state) => {
  console.log('state', state);
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
  ) (TesterFinishedVideo)