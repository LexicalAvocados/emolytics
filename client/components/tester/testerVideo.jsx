import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import ReactPlayer from 'react-player';
import axios from 'axios';




class TesterVideo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      video: {
        url: '',
        name: '',
        desc: ''
      }
      
    }
  }

  componentDidMount() {
    console.log(this);
    axios.get('/api/tester/getVideo')
      .then((data) => {
        console.log(data);
        this.setState({
          video: {
            url: data.data[0].youtubeUrl,
            name: data.data[0].name,
            desc: data.data[0].description
          }
        })
      })
  }

  render() {
    return (
      <div>
        <h2> Test Video </h2>
        <ReactPlayer url={this.state.video.url} playing />
        <h2> {this.state.video.name} </h2>
        <h4> {this.state.video.desc} </h4>
      </div>

    )
  }
}



const mapStateToProps = (state) => {
  console.log('state', state);
  return ({

  })
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
})





export default connect(
  mapStateToProps,
  mapDispatchToProps
  ) (TesterVideo)