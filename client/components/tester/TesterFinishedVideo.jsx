import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class TesterFinishedVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      like: true,
      dislike: false,
      comment: '',
      navDisabled: true,
      navButtonClass: 'optionNavButtonDisabled'
    }
    this.likeClick = this.likeClick.bind(this);
    this.routeHome = this.routeHome.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  likeClick(e) {
    e.preventDefault();
    axios.post('/api/tester/likeVideo', {
      like: e.target.value,
      option: this.props.currentTesterOption,
      comment: this.state.comment
    })
      .then(data => {
          console.log("should be pushing");
          this.setState({navDisabled: false, navButtonClass: 'optionNavButton'});
        })
        .catch((err) => {
          console.log(err);
        });
  }

  routeHome() {
    this.props.history.push('/');
  }

  handleChange(e) {
    e.preventDefault();
    var name = e.target.name;
    var val = e.target.value;
    this.setState({
      [name]: val
    });
  }

  render() {
      return (
        <div className="finishVideo">
          <h3> Comments </h3> 
          <textarea
            name="comment"
            value={this.state.comment}
            onChange={this.handleChange}
            className="testerComments"
            rows="8"
            cols="80"
          >
          </textarea>
          <br/>
          <br/>
          <button
            className={this.state.navButtonClass} 
            onClick={() => this.props.history.push('/')}
            disabled={this.state.navDisabled}
          > Home </button>
          <button
            className="like"
            value={this.state.like}
            onClick={this.likeClick}
          > Like </button>
          <button
            className="unlike"
            value={this.state.dislike}
            onClick={this.likeClick}
          > Dislike </button>
          <button
            className={this.state.navButtonClass}
            onClick={() => this.props.history.push(`/history/${this.props.currentTesterOption.id}`)}
            disabled={this.state.navDisabled}
          > Results </button>
        </div>
      )
    }

};

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  currentTesterOption: state.currentTesterOption,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TesterFinishedVideo));