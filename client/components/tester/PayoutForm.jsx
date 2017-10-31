import React from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
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
      populatedForms: 0
    };
    this.updateTypedAcctNum = this.updateTypedAcctNum.bind(this);
    this.updateTypedRoutingNum = this.updateTypedRoutingNum.bind(this);
    this.updateTypedNameOnAcct = this.updateTypedNameOnAcct.bind(this);
  }

  updateTypedAcctNum(e) {
    this.setState({
      typedAcctNum: e.target.value,
      populatedForms: e.target.value === '' ? Math.min(--this.state.populatedForms, 0) : ++this.state.populatedForms
    });
  }

  updateTypedRoutingNum(e) {
    this.setState({
      typedAcctNum: e.target.value,
      populatedForms: e.target.value === '' ? Math.min(--this.state.populatedForms, 0) : ++this.state.populatedForms
    });
  }

  updateTypedNameOnAcct(e) {
    this.setState({
      typedAcctNum: e.target.value,
      populatedForms: e.target.value === '' ? Math.min(--this.state.populatedForms, 0) : ++this.state.populatedForms
    });
  }  

  render() {
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
            onChange={this.updatedTypedNameOnAcct}
          />
          <Button
            bsStyle='primary'
            type='submit'
            disabled={this.state.populatedForms === 3}
          > Receive ${this.props.balance / 100} </Button>
        </form>
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