import React from 'react';
import axios from 'axios';
import BrowseListEntry from './BrowseListEntry.jsx';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      sort: 1
    }
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    axios.get('/api/allSponsoredOptions')
    .then((res) => {
      console.log('res from sponsored options endpoint', res)
      let sortedVidList = res.data.sort((a,b)=> b.creditsperview - a.creditsperview)
      this.setState({
        videos: sortedVidList
      })
    })
  };

  handleSort(num) {
    var sorted;
    if (num === 1) {
      let vidList = this.state.videos;
      sorted = this.state.videos.sort((a,b)=> b.creditsperview - a.creditsperview)
    } else if (num === 2) {
      let vidList = this.state.videos;
      sorted = this.state.videos.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
    }
    this.setState({
      videos: sorted
    }, () => console.log('sorted state', this.state.videos))
  }


  render() {
    return (
      <div className='browseContainer'>

        <ButtonToolbar>
          <ToggleButtonGroup type="radio" name='sort' defaultValue={1} onChange={this.handleSort}>
            <ToggleButton value={1}>Credits</ToggleButton>
            <ToggleButton value={2}>Recent</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <br/><br/>

        {this.state.videos.length > 0 ? (
          this.state.videos.map((item, i) => (
            <BrowseListEntry item={item} key={i}/>
          ))
        ) : ''}
      </div>
    )
  }
};

export default Browse;
