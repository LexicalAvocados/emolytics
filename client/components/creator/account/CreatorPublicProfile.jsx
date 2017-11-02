import React from 'react';
import { Col, Row, Grid } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import axios from 'axios';
import {Link} from 'react-router-dom';

class CreatorPublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: '',
      title: '',
      bio: '...',
      name: 'Blobberto',
      video: '',
      youtube: '',
      twitter: '@twitterhandle',
      username: null,
      patreonId: null,
      patreonAbout: null,
      patreonImageUrl: null,
      patreonUrl: null,
      patreonVanity: null,
      campaignId: null,
      creationName: null,
      isPlural: null,
      pledgeUrl: null,
      summary: null,
      moreVideos: [],
      email: '',
      website: ''
    }
    this.apply = this.apply.bind(this);
  }

  componentWillMount() {
    axios.get('/api/tester/getCreatorData', {
      params: {
        uid: +this.props.match.params.id.slice(1) || 1
      }
    })
    .then((res) => {
      console.log('res from getCreatorData', res);
      let userData = res.data;
      if (userData.name === '') userData.name = userData.username;
      this.setState({
        profilePicture: userData.profilepicture,
        bio: userData.aboutme,
        name: userData.name,
        video: userData.showcasevideo,
        youtube: userData.youtubeprofile,
        twitter: userData.twitterhandle,
        username: userData.username,
        patreonId: userData.patreonId,
        patreonAbout: userData.patreonAbout,
        patreonImageUrl: userData.patreonImageUrl,
        patreonUrl: userData.patreonUrl,
        patreonVanity: userData.patreonVanity,
        campaignId: userData.campaignId,
        creationName: userData.creationName,
        isPlural: userData.isPlural,
        pledgeUrl: userData.pledgeUrl,
        summary: userData.summary,
        title: userData.title,
        email: userData.email,
        website: userData.website
      })
    })
    axios.get('/api/getCreatorVideosForPublicProfile', {
      params: {
        uid: +this.props.match.params.id.slice(1)
      }
    })
    .then((res) => {
      this.setState({
        moreVideos: res.data
      }, () => console.log('more public videos by creator', this.state.moreVideos))
    })
  }


  apply(e) {
    e.preventDefault();
    let data = {
      username: this.state.username
    }
    axios.post('/api/tester/applyFocusGroup', data)
      .then(res => {
        console.log(res);
      })
  }

  render() {
    return (

        <Grid fluid={true}>

          <Row >

            <Col md={9} style={header}>
              <Col md={3}>
                <div style={profilePictureStyle}>
                  <img src={this.state.profilePicture} height='100%' width='50%' style={imgStyle}></img>
                </div>
              </Col>

              <Col md={8}>
                <Row style={centerStyle}>
                  <h3> {this.state.name} </h3>
                  <h5> {this.state.title}</h5>
                </Row>
                <br/>
                <Row style={leftBioStyle}>
                  {this.state.bio}
                </Row>
              </Col>
              <Col md={1}></Col>
            </Col>

            <Col md={3} style={patreonStyle}>
              <Row>
                <Row>
                  <br/>
                  <a href={`https://www.patreon.com/${this.state.pledgeUrl}`}>
                    <img src='../../../become_patron.png' height={50} width={200}/>
                  </a>
                  <hr style={hrStyle}/>
                </Row>
                <Row>
                  <h4>Join Focus Group</h4>
                  <p onClick={this.apply}> Apply </p>
                </Row>
                <br/><br/>
              </Row>
            </Col>


            <br/><br/><br/><br/>
          </Row>



          <Row style={bodyStyle}>

            <Col md={2}>

              <br/>
              <Row style={moreVideosStyle}>
                <h4 style={centerStyle}> More videos from {this.state.name.split(' ')[0]}: </h4>
                <hr/>
                <div>
                  {this.state.moreVideos.length > 0 ? (
                    this.state.moreVideos.map((vid, i) => (
                      <div>
                      <Row>
                      <Link to={'/video/:'+vid.id}>
                        <div key={i}>
                          <Col md={4}>
                            <img height={100} width={100} src={vid.thumbnail} />
                          </Col>
                          <Col md={1}></Col>
                          <Col md={6} style={black}>
                            <br/>
                            {vid.name}
                            <br/>
                            ({vid.creditsperview} credits)
                          </Col>
                        </div>
                      </Link>
                      </Row>
                      <br/>
                      </div>
                    ))
                  ) : (
                    <p style={centerStyle}> {this.state.name.split(' ')[0]} has no public videos to display, but you can ask to join their focus group! </p>
                  )}
                </div>
              </Row>

            </Col>

          <Col md={6} style={bodyStyle}>
            <br/>
            <Row style={centerStyle}>
              <div className="optionPlayer" style={reactPlayerStyle}>
                <ReactPlayer url={this.state.video} height="100%" width='100%' style={centerStyle}/>
              </div>
            </Row>
            <br/>
          </Col>




          <Col md={1}></Col>
          <Col md={3}>
            <br/>
            <Row style={socialBoxStyle}>

            <Row>
              <h4 style={centerStyle}> Connect</h4>
              <hr style={hrStyle}/>
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

                <Col md={3}>
                  <a href={this.state.facebook || ''}>
                    <img src='https://cdn0.iconfinder.com/data/icons/social-flat-rounded-rects/512/facebook-256.png'
                      height={50} width={50}></img>
                  </a>
                </Col>
              </Row>
              <br/>
              <hr style={hrStyle}/>

            <Row>

              <Col md={3} style={emailIconStyle}>
                <a>
                  <img src='http://icon-park.com/imagefiles/mail_vector_icon_navy_blue.png'
                    height={40} width={60}></img>
                </a>
              </Col>
              <Col md={2} style={emailStyle}>
                {this.state.email}
              </Col>

            </Row>
            <br/>
            <Row>

              <Col md={3} style={emailIconStyle}>
                <a>
                  <img src='https://cdn2.iconfinder.com/data/icons/picons-essentials/57/website-512.png'
                    height={60} width={60}></img>
                </a>
              </Col>
              <Col md={6} >
                <br/>
                <a style={websiteStyle} href={this.state.website}><u>Personal Website</u></a>
              </Col>

            </Row>


            </Row>


          </Col>
        </Row>


        </Grid>

    )
  }

};

const header = {
  // backgroundColor: '#686c72',
  // color: 'black',
  // border: 'solid black 1px',
  // borderRadius: '7px'
}

const reactPlayerStyle = {
  marginLeft: '12%'
}

const black = {
  color: 'black'
}

const imgStyle = {
  border: 'solid black 2px',
  borderRadius: '3px'
}

const leftBioStyle = {
  marginLeft: '2%'
}

const emailStyle = {
  marginTop: '2%'
}

const emailIconStyle = {
  marginLeft: '10%'
}

const profilePictureStyle = {
  height: '25vh',
  width: '28vw',
  padding: '10px'
}

const rightColumnSocialButtonsStyle = {
  marginLeft: '9%'
}

const centerStyle = {
  textAlign: "center",
  align: "center"
}

const bodyStyle = {
  backgroundColor: '#f7f7f7'
}

const patreonStyle = {
  padding: '10px',
  border: 'solid black 1px',
  borderRadius: '1px',
  borderColor: '#e5d8ff',
  // boxShadow: '2px 2px 2px #888888',
  textAlign: 'center',
  float: 'right',
  width: '23%',
  // backgroundColor: '#ad7ecf'
  backgroundColor: '#f3edff'
}

const bioStyle = {
  // marginTop: '5%',
  // width: "100%",
  padding: '10px',
  // border: 'solid black 1px',
  // borderRadius: '10px',
  // boxShadow: '2px 2px 2px #888888',
  backgroundColor: '#d4d6d8',
  color: 'black',
  height: '25vh',
  // width: '28vw',
}

const moreVideosStyle = {
  width: "100%",
  padding: '10px',
  // border: 'solid black 1px',
  // borderRadius: '10px',
  // boxShadow: '2px 2px 2px #888888',
  // backgroundColor: '#f7f7f7',
  float: 'right',
  color: 'black'
}

const socialBoxStyle = {
  width: "100%",
  padding: '10px',
  border: 'solid black 1px',
  borderRadius: '1px',
  borderColor: '#e5d8ff',
  // boxShadow: '2px 2px 2px #888888',
  textAlign: 'center',
  // backgroundColor: '#f7f7f7',
  backgroundColor: '#f3edff',
  float: 'right'
}

const hrStyle = {
  width: '75%',
  borderWidth: '2px',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
}

const websiteStyle = {
  color: 'black',
  marginTop: '50%'
}

export default CreatorPublicProfile;

//3 Columns
//2 rows
  //3rd column 2nd row divide into 2 rows
  //3rd column 2nd row 2nd row divide into 2 colunmns
