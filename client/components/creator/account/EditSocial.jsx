import React from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import { Form, FormGroup, FormControl, InputGroup, ControlLabel, Button, Col, Row } from 'react-bootstrap';


class EditSocial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youtube: '',
      twitter: '',
      patreon: '',
      website: '',
      subitted: false
    };
    this.handleYouTubeChange = this.handleYouTubeChange.bind(this);
    this.handleTwitterChange = this.handleTwitterChange.bind(this);
    this.handleWebsiteChange = this.handleWebsiteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('/api/tester/getCreatorData', {
      params: {
        uid: this.props.loggedInUser.id
      }
    })
    .then((res) => {
      console.log('res from getCreatorData', res)
      this.setState({
        youtube: res.data.youtubeprofile,
        twitter: res.data.twitterhandle
      })
    })
  }

  handleYouTubeChange(e) {
    this.setState({
      youtube: e.target.value
    })
  }

  handleTwitterChange(e) {
    this.setState({
      twitter: e.target.value
    })
  }

  handleWebsiteChange(e) {
    this.setState({
      website: e.target.value
    })
  }

  handleSubmit() {
    axios.post('/api/creator/updateCreatorSocial', {
      youtubeprofile: this.state.youtube,
      twitterhandle: this.state.twitter,
      website: this.state.website
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
        <h3> Connect your Social Media Accounts! </h3>
        <br/><br/>

        <div style={EditProfileStyle}>
        <Form>
          <FormGroup controlId='formBasicText'>
            <Row>
              <Col sm={1} md={1}>
                <ControlLabel> YouTube </ControlLabel>
              </Col>
              <Col sm={4} md={4}>
                <FormControl type='text' value={this.state.youtube} onChange={this.handleYouTubeChange} placeholder='Link to your YouTube profile'/>
              </Col>
            </Row>

            <br/><br/>
            <Row>
              <Col sm={1} md={1}>
                <ControlLabel> Twitter </ControlLabel>
              </Col>
              <Col sm={4} md={4}>
                <FormControl type='text' value={this.state.twitter} onChange={this.handleTwitterChange} placeholder='Your Twitter handle'/>
              </Col>
            </Row>

            <br/><br/>
            <Row>
              <Col sm={1} md={1}>
                <ControlLabel> Website </ControlLabel>
              </Col>
              <Col sm={4} md={4}>
                <FormControl type='text' value={this.state.website} onChange={this.handleWebsiteChange} placeholder='Your Personal Website'/>
              </Col>
            </Row>

          </FormGroup>
        </Form>
        <Row>
          <Col sm={2} md={2}>
            <img src='../../../patreon.jpg' height={50} width={200}/>
          </Col>
        </Row>
        </div>

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
)(EditSocial));
