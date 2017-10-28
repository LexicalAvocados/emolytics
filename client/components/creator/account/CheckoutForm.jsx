import React from 'react';
import axios from 'axios';
import { Form, FormControl } from 'react-bootstrap';
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
    this.state = {
      submitButtonDisabled: true,
      submitButtonClass: 'ccSubmitDeactivated'
    };
    this.createStripeToken = this.createStripeToken.bind(this);
    this.toggleSubmitButton = this.toggleSubmitButton.bind(this);
  }

  toggleSubmitButton(e) {
    this.setState({
      submitButtonDisabled: e.complete ? false : true,
      submitButtonClass: e.complete ? 'ccSubmit' : 'ccSubmitDeactivated'
    });
  }

  createStripeToken(e) {
    e.preventDefault();
    this.props.stripe.createToken({name: 'Test Creator'})
      .then(token => {
        console.log('Stripe Token Received:', token);
        this.props.addCreditsToAccount();
      })
      .catch(err => {
        console.log('Stripe Token Error:', err);
      })
  }

  render() {
    return (
      <div>
        <div className='ccForm'>
          <Form onSubmit={this.createStripeToken}>
            <h3>Card Details</h3>
            <div>
              <CardElement
                onChange={this.toggleSubmitButton}
                style={{
                  base: {
                    iconColor: '#666EE8',
                    color: '#31325F',
                    lineHeight: '40px',
                    fontSize: '20px',

                    '::placeholder': {
                      color: '#CFD7E0'
                    }
                  }
                }}
              />
            </div>
            <button
              type='submit'
              className={this.state.submitButtonClass}
              disabled={this.state.submitButtonDisabled}
            > Pay {this.props.amount} </button>
          </Form>
        </div>
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

export default injectStripe(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutForm)));