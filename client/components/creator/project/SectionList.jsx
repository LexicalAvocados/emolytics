import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions'
import axios from 'axios';

class SectionList extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      options: [] // I suppose just keep these in local state because they are just here to display thumbnails
    };
  }

  componentDidMount() {
    axios.get('/api/getOptionsForSection', { params: {sectionId: this.props.section.id}})
      .then((res) => {
        this.setState({
          options: res.data
        })
        console.log(this.state.options);
        this.props.actions.addOptionToCurrentProject(res.data);
      })
      .catch((err) => {
        console.log('Request to get options for section NOT sent to server');
      })
  }

  render () {
    return (
      <div>
        <Link to="/section"> 
          <p>{this.props.section.name}</p>
          { this.state.options.map((option) => {
            return <img src={option.thumbnail} alt="" />
          })}
        </Link>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('LOG WITHIN SECTION LIST', state);
  return ({
    currentProject: state.currentProject
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (SectionList);