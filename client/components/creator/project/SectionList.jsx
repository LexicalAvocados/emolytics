import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions'
import axios from 'axios';

class SectionList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [] // I suppose just keep these in local state because they are just here to display thumbnails
    };
    this.onClickCallback = this.onClickCallback.bind(this);
  }

  componentDidMount() {
    axios.get('/api/getOptionsForSection', { params: {sectionId: this.props.section.id}})
      .then((res) => {
        this.setState({
          options: res.data
        })
        this.props.actions.addOptionToCurrentProject(res.data);
      })
      .catch((err) => {
        console.log('Request to get options for section NOT sent to server');
      })
  }

  onClickCallback() {
    this.props.onSectionClick(this.props.section, this.state.options)
  }

  render () {
    return (
      <div>
        <Link to={'/section/' + this.props.section.id}> 
          <p onClick={this.onClickCallback}>{this.props.section.name}</p>
        </Link>
        { this.state.options.map((option, i) => {
          return <img src={option.thumbnail} alt="" key={i}/>
        })}
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