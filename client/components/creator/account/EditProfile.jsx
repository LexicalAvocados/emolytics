import React from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import { Form, FormGroup, FormControl, InputGroup, ControlLabel, Button, Col, Row } from 'react-bootstrap';


class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      picture: '',
      bio: '',
      video: '',
      title: '',
      submitted: false
    };
    this.handlePictureChange = this.handlePictureChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  componentDidMount() {
    console.log('LOGGED IN USER')
    axios.get('/api/tester/getCreatorData', {
      params: {
        uid: this.props.loggedInUser.id
      }
    })
    .then((res) => {
      console.log('res from getCreatorData', res)
      this.setState({
        picture: res.data.profilepicture,
        bio: res.data.aboutme,
        name: res.data.name || res.data.username,
        video: res.data.showcasevideo,
        title: res.data.title
      })
    })
  }

  handlePictureChange(e) {
    this.setState({
      picture: e.target.value
    })
  }

  handleBioChange(e) {
    this.setState({
      bio: e.target.value
    })
  }

  handleVideoChange(e) {
    this.setState({
      video: e.target.value
    })
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    })
  }

  handleSubmit() {
    //axios call to do to update
    axios.post('/api/creator/updateCreatorBio', {
      picture: this.state.picture,
      aboutme: this.state.bio,
      video: this.state.video,
      title: this.state.title
    })
    .then( (res) => {
      console.log('res from updating creator profile info', res)
      this.setState({
        submitted: true
      })
    })
  }

  render() {
    return (
      <div style={EditProfileStyle}>
        <h3> Set your public profile here! </h3>
        <br/><br/>

        <div style={EditProfileStyle}>
        <Form>
          <FormGroup controlId='formBasicText'>
            <Row>
              <Col sm={1} md={1}>
                <ControlLabel> Profile Picture </ControlLabel>
              </Col>
              <Col sm={4} md={4}>
                <FormControl type='text' value={this.state.picture} onChange={this.handlePictureChange} placeholder='Publicly accessible url'/>
              </Col>
            </Row>

            <br/><br/>
            <Row>
              <Col sm={1} md={1}>
                <ControlLabel> Title </ControlLabel>
              </Col>
              <Col sm={4} md={4}>
                <FormControl type='text' value={this.state.title} onChange={this.handleTitleChange} placeholder='eg. Ad producer'/>
              </Col>
            </Row>

            <br/><br/>
            <Row>
              <Col sm={1} md={1}>
                <ControlLabel> About me </ControlLabel>
              </Col>
              <Col sm={4} md={4}>
                <FormControl componentClass="textarea" value={this.state.bio}
                            onChange={this.handleBioChange} placeholder='Tell your viewers a bit about yourself'/>
              </Col>
            </Row>

            <br/><br/>
            <Row>
              <Col sm={1} md={1}>
                <ControlLabel> Showcase Video </ControlLabel>
              </Col>
              <Col sm={4} md={4}>
                <FormControl type='text' value={this.state.video} onChange={this.handleVideoChange} placeholder='Optional but recommended!'/>
              </Col>
            </Row>

            <br/><br/>

            <Row>
              <Col sm={1} md={1}>
                <Button onClick={this.handleSubmit}> Done </Button>
              </Col>
            </Row>

            { this.state.submitted ? (
              <div>
                <Row>
                  <Col sm={2} md={2}>
                    <p> Your account was updated! </p>
                    <Link to={'profile:'+this.props.loggedInUser.id}>
                      <p> Check out your public profile</p>
                    </Link>
                  </Col>
                </Row>
              </div>
            ) : ''}

          </FormGroup>
        </Form>
        </div>

      </div>
    )
  }
};

const EditProfileStyle = {

}

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  router: state.router
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile));
