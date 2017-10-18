import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class AddOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      url:''
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.submitOptionClick = this.submitOptionClick.bind(this);
  }

  // handleChange(event) {
  //   this.setState({

  //   })
  // }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value
    });
  }

  handleUrlChange(event) {
    this.setState({
      url: event.target.value
    });
  }

  submitOptionClick(event) {
    event.preventDefault();
    axios.post('/api/addOption', {
      name: this.state.name,
      description: this. state.description,
      // need to add url here...
      url: this.state.url,
      sectionId: this.props.currentSection.id
    })
      .then((response) => {
        this.setState({
          name: response.data.name,
          description: response.data.description
        }, () => {
          this.props.actions.changeCurrentOption(response.data);
          this.props.history.push('/')
        });
        
      })
      .catch((err) => {
        console.error('Request to add new option NOT sent to server!', err);
      });
  }

  render() {
    return (
      <div className="AddOption">
        <h2>Add Option</h2>
        <form onSubmit={this.submitOptionClick}>
        Option Name: <br />
          <input type="text" name="optionname" value={this.state.name} onChange={this.handleNameChange} /><br />
          Option Description: <br />
          <input type="text" name="optiondescription" value={this.state.description} onChange={this.handleDescriptionChange} /><br />
          Url: <br />
          <input type="text" name="optionurl" value={this.state.url} onChange={this.handleUrlChange} /><br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection

  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
) (AddOption));



