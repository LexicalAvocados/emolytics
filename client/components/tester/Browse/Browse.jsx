import React from 'react';
import axios from 'axios';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton, Col, Row} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

import BrowseListEntry from './BrowseListEntry.jsx';
import SearchAutosuggest from './SearchAutosuggest.jsx';

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      library: [],
      sort: 1
    }
    this.handleSort = this.handleSort.bind(this);
    this.redirectUser = this.redirectUser.bind(this);
    this.filterResultsBasedOnSelecion = this.filterResultsBasedOnSelecion.bind(this);
  }

  componentDidMount() {
    axios.get('/api/allSponsoredOptions')
    .then((res) => {
      console.log('res from sponsored options endpoint', res)
      let sortedVidList = res.data.sort((a,b)=> b.creditsperview - a.creditsperview)
      this.setState({
        videos: sortedVidList,
        library: sortedVidList
      })
    })
  };

  handleSort(num) {
    var sorted = [];
    if (num === 1) {
      let vidList = this.state.videos;
      sorted = sorted.concat(this.state.videos.sort((a,b)=> b.creditsperview - a.creditsperview))
    } else if (num === 2) {
      let vidList = this.state.videos;
      sorted = sorted.concat(this.state.videos.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)))
    }
    this.setState({
      videos: sorted
    }, () => console.log('sorted state', this.state.videos))
  }

  redirectUser(option) {
    this.props.actions.changeTesterOption(option);
  }

  filterResultsBasedOnSelecion(name) {
    if (name !== '') {
      var filteredVideos = this.state.videos.filter(vid => vid.name === name);
      this.setState({
        videos: filteredVideos
      })
    } else {
      this.setState({
        videos: this.state.library
      })
    }
  }


  render() {
    return (
      <div className='TesterBrowseContainer'>
        <h1> Browse </h1>
        <br/><br/>

      <Row >
        <Col md={5}></Col>
        <Col md={2} style={center}>
          <SearchAutosuggest options={this.state.videos} filterResultsBasedOnSelecion={this.filterResultsBasedOnSelecion} style={autosuggestStyle}/>
          <br/>
          <ButtonToolbar>
            <ToggleButtonGroup type="radio" name='sort' defaultValue={1} onChange={this.handleSort} style={toggleButtonStyle}>
              <ToggleButton value={1}>Credits</ToggleButton>
              <ToggleButton value={2}>Recent</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
          <br/><br/>
      </Col>
        <Col md={5}></Col>
      </Row>
        <div className='allBrowseVideos TesterBrowseContainer' style={allBrowseVideosStyle}>
          {this.state.videos.length > 0 ? (
            this.state.videos.map((item, i) => (
              <Col className='BrowseListItem' md={3} key={item.name}>
                <BrowseListEntry item={item} key={item.name} handleWatch={this.redirectUser}/>
              </Col>
            ))
          ) : ''}
          </div>
      </div>
    )
  }
};

const autosuggestStyle = {
  zIndex: '1001'
}

const browseHeaderStyle = {
  textAlign: 'center',
  marginLeft: '2%'
}

const center = {
  textAlign: 'center',
  align: 'center'
  // marginLeft: '3%'
}

const toggleButtonStyle = {
  marginLeft: '20%',
  zIndex: '1'
}

const mapStateToProps = (state) => {
  // console.log('state', state);
  return ({
    currentTesterOption: state.currentTesterOption
  })
}

const allBrowseVideosStyle = {
  width: '100%',
  marginLeft: '11%'
  // padding: '3%'
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (Browse);
