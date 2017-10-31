import React from 'react';
import { Button, Form, FormControl, Fade, Alert } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

class PayoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typedAcctNum: '',
      typedRoutingNum: '',
      typedNameOnAcct: '',
      displayPayoutSuccess: false
    };
    this.updateTypedAcctNum = this.updateTypedAcctNum.bind(this);
    this.updateTypedRoutingNum = this.updateTypedRoutingNum.bind(this);
    this.updateTypedNameOnAcct = this.updateTypedNameOnAcct.bind(this);
    this.takePayout = this.takePayout.bind(this);
  }

  updateTypedAcctNum(e) {
    this.setState({
      typedAcctNum: e.target.value
    });
  }

  updateTypedRoutingNum(e) {
    this.setState({
      typedRoutingNum: e.target.value
    });
  }

  updateTypedNameOnAcct(e) {
    this.setState({
      typedNameOnAcct: e.target.value
    });
  }

  takePayout(e) {
    e.preventDefault();
    axios.post('/api/depleteCreditBalance', {
      userId: this.props.loggedInUser.id
    })
      .then(res => {
        if (res) {
          this.setState({displayPayoutSuccess: true});
          setTimeout(() => {
            this.setState({displayPayoutSuccess: false});
            setTimeout(() => {
              this.props.togglePayoutForm();
              this.props.makeBalanceZero();
            }, 1000);
          }, 3000);
        } else {
          console.log('Error with payout, try again later');
        }
      })
  }

  render() {
    const formsPopulated =
      (this.state.typedAcctNum !== '') && (this.state.typedRoutingNum !== '') && (this.state.typedNameOnAcct !== '');
    return (
      <div>
        <form>
          <h3>Bank Account</h3>
          <FormControl
            value={this.state.typedAcctNum}
            placeholder='Enter account number'
            onChange={this.updateTypedAcctNum}
          />
          <FormControl
            value={this.state.typedRoutingNum}
            placeholder='Enter routing number'
            onChange={this.updateTypedRoutingNum}
          />
          <FormControl
            value={this.state.typedNameOnAcct}
            placeholder='Enter name on account'
            onChange={this.updateTypedNameOnAcct}
          />
          <Button
            bsStyle='primary'
            type='submit'
            disabled={!formsPopulated}
            onClick={this.takePayout}
          > Receive ${this.props.balance / 100} </Button>
        </form>
        <br/><br/>
        <Fade in={this.state.displayPayoutSuccess}>
          <Alert bsStyle='success'>
            <div>Success! Check your bank statement in 2 business days.</div>
            <div>{this.props.balance} credits have been deducted from your credits balance.</div>
          </Alert>
        </Fade>
      </div>
    )
  }
}

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PayoutForm));