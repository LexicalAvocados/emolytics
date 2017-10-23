import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

class SectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      date: ''
    };
    this.onClickCallback = this.onClickCallback.bind(this);
    this.grabOptions = this.grabOptions.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.grabOptions(this.props.section);

  }

  shouldComponentUpdate(nextProps, nextState) { // Works, not sure exactly why
    // console.log('within should *******************', nextProps);
    if (nextProps.rerenderOptions) {
      this.grabOptions(nextProps.section);
      this.props.associateOptions();
      return true;
    } 
    return true;
  }

  grabOptions(section) {
    axios.get('/api/getOptionsForSection', { params: {sectionId: section.id}})
      .then((options) => {
        console.log('OPTIONS ASSOCIATED WITH SECTION', options);
        let sortedOptions = options.data.sort((one, two) => {
          if (one.createdAt < two.createdAt) return 1;
          if (one.createdAt > two.createdAt) return -1;
        });
        this.setState({
          options: sortedOptions
        });
      })
      .catch((err) => {
        console.log('Request to get options for section NOT sent to server');
      });
  }

  onClickCallback() {
    this.props.onSectionClick(this.props.section, this.state.options);
    this.props.history.push('/section' + this.props.section.id);
  }

  render () {
    return (
      <div>
        <div onClick={this.onClickCallback} className="projectHomeSectionListEntry">
          <p className="closerTextLarger">Section Name: {this.props.section.name}</p>
          <p className="closerText">Section Description: {this.props.section.description}</p>
          <p>Created On: {this.state.date = new Date(this.props.section.createdAt.slice(0, 19)).toString().slice(0, 24)}</p>
          <div>
            { this.state.options.map((option, i) => {
              return <img className="projectHomeSectionListThumbnail" src={option.thumbnail} alt="" key={i}/>
            })}
          </div>
        </div>
        <Button onClick={() => this.props.deleteSection(this.props.section.id)}>Delete</Button>
      </div>
    );
  }
}

export default withRouter(SectionList);