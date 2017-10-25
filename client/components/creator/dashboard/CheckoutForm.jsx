import React from 'react';
import axios from 'axios';
import { Form, FormGroup, FormControl, ControlLabel, Button, Col } from 'react-bootstrap';
import { CardElement, PaymentRequestButtonElement, injectStripe } from 'react-stripe-elements';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);

    const paymentRequest = props.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Payment for Credits',
        amount: props.amount,
      }
    });

    paymentRequest.canMakePayment()
      .then(result => {
        this.setState({canMakePayment: !!result});
      });

    this.state = {
      canMakePayment: false,
      paymentRequest
    }
  }

  render() {
    return (
      <div>
        <div className='ccInput'>
          <h3>Enter Card Details</h3>
          <CardElement
            style={{
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontSize: '20px',

                '::placeholder': {
                    color: '#CFD7E0'
                }
              }
            }}
          />
        </div>
        {/*<PaymentRequestButtonElement 
          paymentRequest={this.state.paymentRequest}
        />*/}
      </div>
    )
  }
};

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  router: state.router
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default injectStripe(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutForm)));