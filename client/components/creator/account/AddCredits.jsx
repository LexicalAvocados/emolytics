import React from 'react';
import { Form, FormGroup, FormControl, InputGroup, ControlLabel, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm.jsx';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class AddCredits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      paying: false,
      complete: false,
      prevBalance: 0
    };
    this.updateTypedAmount = this.updateTypedAmount.bind(this);
    this.transitionToPayment = this.transitionToPayment.bind(this);
    this.addCreditsToAccount = this.addCreditsToAccount.bind(this);
  }

  componentDidMount() {
    axios.get('/api/getCreditBalance')
      .then((res) => {
        this.setState({
          prevBalance: res.data
        });
      });
  }

  updateTypedAmount(e) {
    this.setState({amount: e.target.value});
  }

  transitionToPayment(e) {
    e.preventDefault();
    this.setState({paying: true});
  }

  addCreditsToAccount() {
    axios.post('/api/addCredits', {
      amount: this.state.amount * 100
    })
      .then(res => {
        this.setState({complete: true});
      })
      .catch(err => {
        console.log('Error crediting account:', err);
      });
  }

  render() {
    return (
      <div className='accountContainer'>
        <h3>Add Credits to your Account</h3>
        <div>Use these to sponsor options so viewers will be more likely to watch then</div>
        <div>Rate: $1 for 100 credits</div>
        <br/>
        <div>Current Balance: {this.state.prevBalance || 0} credits</div>
        <br/>
        <Form horizontal onSubmit={this.transitionToPayment}>
          <FormGroup controlId="amount">
            <Col sm={3}>
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl
                  type="number"
                  value={this.state.amount}
                  placeholder='Enter amount'
                  onChange={this.updateTypedAmount}
                />
              </InputGroup>
            </Col>
          </FormGroup>

          {this.state.amount ?
            <Button bsStyle='primary' type='submit'>Proceed to Payment</Button>
            :
            null}
        </Form>

        {this.state.paying ?
          <Elements>
            <CheckoutForm
              amount={this.state.amount}
              addCreditsToAccount={this.addCreditsToAccount}
            />
          </Elements>
          :
          null}

        {this.state.complete ?
          <div className='complete'>
            <p> Payment processed!</p>
            <Link to='/'>
              <Button> Done </Button>
            </Link>
          </div>
          :
          null}
      </div>
    );
  }
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
)(AddCredits));
