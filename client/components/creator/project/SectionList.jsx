import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios';

class SectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
    this.onClickCallback = this.onClickCallback.bind(this);
  }

  componentDidMount() {
    axios.get('/api/getOptionsForSection', { params: {sectionId: this.props.section.id}})
      .then((options) => {
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
      <div onClick={this.onClickCallback} className="projectHomeSectionListEntry">
        {/* <Link to={'/section' + this.props.section.id}>  */}
          <p className="closerTextLarger">{this.props.section.name}</p>
          <p className="closerText">{this.props.section.description}</p>
          <div>
            { this.state.options.map((option, i) => {
              return <img className="projectHomeSectionListThumbnail" src={option.thumbnail} alt="" key={i}/>
            })}
          </div>
        {/* </Link> */}
      </div>
    );
  }
}

export default withRouter(SectionList);