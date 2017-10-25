import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, Form, FormGroup, FormControl, Row, Col, ControlLabel } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';
import OptionData from './OptionData.jsx';
import AddOption from '../create/addOption.jsx';

class OptionListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      date: '',
      showAddOption: false,
      showAddCredits: false,
      total: 0,
      perView: 0,
      notEnoughCredits: false
    };
    this.revealAddOption = this.revealAddOption.bind(this);
    this.showAddCreditsForm = this.showAddCreditsForm.bind(this);
    this.closeAddCredits = this.closeAddCredits.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    this.updatePerView = this.updatePerView.bind(this);
    this.submitCredits = this.submitCredits.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get('/api/getTestersForOption', { params: { optionId: this.props.option.id }})
      .then((testerIds) => {
        this.props.concatTesters(testerIds.data, this.props.index);
      })
      .catch((err) => {
        console.log('Error retrieving testers for option', err);
      });
  }

  revealAddOption() {
    this.setState({
      showAddOption: !this.state.showAddOption
    });
  }

  showAddCreditsForm(id) {
    console.log('OPTIONID', id)
    this.setState({
      showAddCredits: true
    })
  }

  closeAddCredits() {
    this.setState({
      showAddCredits: false
    })
  }

  updateTotal(e) {
    if(e.target.value > this.props.credits) {
      this.setState({
        notEnoughCredits: true
      })
    } else {
      this.setState({
        notEnoughCredits: false,
        total: e.target.value
      })
    }
  };

  updatePerView(e) {
    this.setState({
      perView: e.target.value
    })
  };

  submitCredits() {
    let body = {
      optionId: this.props.option.id,
      total: this.state.total,
      perView: this.state.perView
    };
    axios.post('/api/addCreditsToOption', body)
    .then((res)=>{
      // console.log('res from addCreditsToOption', res)
      this.setState({
        showAddCredits: false
      })
    })
    .then(()=>{
      //deduce points from user total
      axios.post('/api/addCredits', {
        amount: -this.state.total
      })
      .then((res)=>{
        // console.log('res from deducting credits from user', res);
        this.setState({
          total: 0,
          perView: 0
        })
      })
    })
  }

  render() {
    return (
      <div>
        { this.props.option !== 'End'  ? (
          <div className="currentSectionOptionListEntry" onClick={() => this.props.onOptionClick(this.props.index)}>
            <div className="optionListEntry">
              <img className="optionListThumbnail" src={this.props.option.thumbnail} alt=""/>
              <p className="closerText">{this.props.option.name}</p>
              <p className="closerText">{this.props.option.description}</p>
              {/* <p>Created On: {this.state.date = new Date(this.props.option.createdAt.slice(0, 19)).toString().slice(0, 24)}</p> */}
            </div>
            {/* <OptionData data={this.props.optionData}/> */}
            <Button onClick={() => this.props.deleteOption(this.props.option.id)}>Delete</Button>
            <Button onClick={this.showAddCreditsForm}>Add Credits</Button>

            <div className='addCreditsFormContainer'>

            <Modal bsSize="large" show={this.state.showAddCredits} onHide={this.closeAddCredits}>
              <Modal.Header closeButton>
                <Modal.Title>Add Credits to Option</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Form horizontal>
                  <Row>
                    <Col sm={3}>
                      <p>Credits available: {this.props.credits}</p>
                    </Col>
                  </Row>
                  <FormGroup controlId="amount">
                    <Row>
                      <Col sm={2}>
                        Total:
                      </Col>
                      <Col sm={2}>
                        <FormControl type="number" placeholder="eg. 200" onChange={this.updateTotal}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={2}>
                        Per View:
                      </Col>
                      <Col sm={2}>
                        <FormControl type="number" placeholder="eg. 20" onChange={this.updatePerView}/>
                      </Col>
                    </Row>
                    <Row>
                      {this.state.notEnoughCredits ? (
                        <p style={errorStyle}> Your account balance is too low - either add points in 'Account', or add
                            no more than {this.props.credits} credits to this option.
                        </p>
                      ) : ''}
                    </Row>
                  </FormGroup>
                </Form>

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.submitCredits}>Add</Button>
                <Button onClick={this.closeAddCredits}>Cancel</Button>
              </Modal.Footer>
            </Modal>

            </div>

          </div>
        ) : (
          <div onClick={this.revealAddOption} className="currentSectionOptionListEntry">
            <div className="optionListEntry">
              <h1>+</h1> {/* Style this later */}
              <Modal bsSize="large" show={this.state.showAddOption} onHide={this.revealAddOption}>
                <Modal.Header closeButton>
                  <Modal.Title>Add an Option</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddOption
                    close={this.revealAddOption}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.revealAddOption}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const errorStyle = {
  textAlign: "center",
  color: "red",
  fontWeight: "bold"
}

export default OptionListEntry;
