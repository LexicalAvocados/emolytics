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
    this.handleChange = this.handleChange.bind(this);
    this.submitOptionClick = this.submitOptionClick.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    var name = e.target.name;
    var val = e.target.value;
    this.setState({
      [name]: val
    });
  }

  submitOptionClick(e) {
    e.preventDefault();
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
          this.props.history.push('/project' + this.props.currentProject.id);
        });

      })
      .catch((err) => {
        console.error('Request to add new option NOT sent to server!', err);
      });
  }

  render() {
    return (
      <div className="AddOption">
        <p>{this.props.currentSection.name}</p>
        <h2>Add Option</h2>
        <form onSubmit={this.submitOptionClick}>
        Option Name: <br />
          <input type="text" name="name" value={this.state.name} onChange={this.handleChange} /><br />
          Option Description: <br />
          <input type="text" name="description" value={this.state.description} onChange={this.handleChange} /><br />
          Url: <br />
          <input type="text" name="url" value={this.state.url} onChange={this.handleChange} /><br />
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



