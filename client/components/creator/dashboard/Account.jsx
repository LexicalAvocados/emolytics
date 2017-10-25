import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      complete: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      amount: 0,
      complete: false
    })
  }

  handleChange(e) {
    this.setState({
      amount: e.target.value
    })
  }

  handleSubmit() {
    //axios call
    axios.post('/api/addCredits', {
      amount: this.state.amount*5
    })
    this.setState({
      complete: true
    })
  }

  render() {
    return (
      <div className='accountContainer'>
        <h3>Add Credits to your Account</h3>
        <h5> (You can use these to sponsor options so viewers will watch them...)</h5>
        <br/><br/><br/>
          <Form horizontal>
            <FormGroup controlId="amount" >
              <Col sm={1}>
                Amount:
              </Col>
              <Col sm={3}>
                <FormControl type="number" placeholder="eg. 20" onChange={this.handleChange}/>
              </Col>
              <Col sm={1}>
                <a> = {this.state.amount * 5 || 0} credits</a>
              </Col>
            </FormGroup>
            <Button onClick={this.handleSubmit}>Proceed to Payment</Button>
          </Form>
          {this.state.complete ? (
            <div className='complete'>
              <p> Payment processed!</p>
              <Link to='/'>
                <Button> Done </Button>
              </Link>
            </div>
          ) : ''}
      </div>
    )
  }
};

export default Account;
