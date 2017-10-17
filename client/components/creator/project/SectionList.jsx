import React from 'react';
import {Link} from 'react-router-dom';
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
      <div onClick={this.onClickCallback}>
        <Link to={'/section' + this.props.section.id}> 
          <p>{this.props.section.name}</p>
          <p>{this.props.section.description}</p>
          { this.state.options.map((option, i) => {
            return <img src={option.thumbnail} alt="" key={i}/>
          })}
        </Link>
      </div>
    );
  }
}

export default SectionList;