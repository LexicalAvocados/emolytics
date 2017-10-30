import React from 'react';
import { Col, Row, Grid } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import axios from 'axios';

class CreatorPublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: '',
      bio: '...',
      name: 'Blobberto',
      video: '',
      youtube: '',
      twitter: '@twitterhandle'
    }
  }

  componentWillMount() {
    axios.get('/api/tester/getCreatorData', {
      params: {
        uid: +this.props.match.params.id.slice(1) || 1
      }
    })
    .then((res) => {
      console.log('res from getCreatorData', res)
      this.setState({
        profilePicture: res.data.profilepicture,
        bio: res.data.aboutme,
        name: res.data.name || res.data.username,
        video: res.data.showcasevideo,
        youtube: res.data.youtubeprofile,
        twitter: res.data.twitterhandle
      })
    })
  }

  render() {
    return (
      <div>
        <Grid fluid={true}>
        <div className='left'>
          <Col md={3}>
            <Row>
              <img src={this.state.profilePicture} height={150} width={150}></img>
            </Row>
            <br/>
            <Row style={bioStyle}>
              <h4> About me </h4>
              {this.state.bio}
            </Row>
          </Col>
        </div>

        <div className='center'>
          <Col md={6}>
            <Row>
              <h2>{this.state.name}</h2>
              <br/><br/><br/>
            </Row>
            <Row>
              <ReactPlayer url={this.state.video}/>
            </Row>
          </Col>
        </div>

        <div className='right'>
          <Col md={3}>
            <Row>
              <h3> Social </h3>
              <br/><br/><br/>
            </Row>
            <div className='socialInfo' style={socialBoxStyle}>

              <Row>
                <br/>
                <Row>
                  <img src='../../../become_patron.png' height={50} width={200}/>
                  <hr style={hrStyle}/>
                  <br/>
                </Row>
                <Row>
                  <Col md={3} style={rightColumnSocialButtonsStyle}>
                    <a href={this.state.youtube}>
                      <img src='https://cdn0.iconfinder.com/data/icons/social-flat-rounded-rects/512/youtube_v2-512.png'
                        height={50} width={50}></img>
                    </a>
                  </Col>

                  <Col md={3}>
                    <a href={this.state.twitter}>
                      <img src='https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697029-twitter-512.png'
                        height={50} width={50}></img>
                    </a>
                  </Col>
                </Row>
              </Row>
            </div>

          </Col>
        </div>
        </Grid>
      </div>
    )
  }

};

const rightColumnSocialButtonsStyle = {
  marginLeft: '7%'
}

const bioStyle = {
  width: "70%",
  padding: '10px',
  border: 'solid black 1px',
  borderRadius: '10px',
  boxShadow: '2px 2px 2px #888888'
}

const socialBoxStyle = {
  padding: '10px',
  border: 'solid black 1px',
  borderRadius: '10px',
  boxShadow: '2px 2px 2px #888888',
  textAlign: 'center'
}

const hrStyle = {
  width: '75%',
  borderWidth: '2px'
}

export default CreatorPublicProfile;

//3 Columns
//2 rows
  //3rd column 2nd row divide into 2 rows
  //3rd column 2nd row 2nd row divide into 2 colunmns
