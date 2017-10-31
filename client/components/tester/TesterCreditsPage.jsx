import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

class TesterCreditsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevBalance: 0,
      payoutEligible: false,
      displayPayoutForm: false
    }
    this.togglePayoutForm = this.togglePayoutForm.bind(this);
  }

  componentDidMount() {
    axios.get('/api/getCreditBalance')
      .then(res => {
        this.setState({
          prevBalance: res.data,
          payoutEligible: res.data >= 500 ? true : false
        });
      })
      .catch(err => {
        console.log('Error fetching credits from DB:', err);
      });
  }

  togglePayoutForm() {
    this.setState({displayPayoutForm: !this.state.displayPayoutForm});
  }

  render() {
    return (
      <div>
        <h3>Credits Payouts</h3>
        <p>Each time you watch and provide feedback on a credited video, you will earn some
        credits. 100 credits may be redeemed for $1. Once you have accumulated 500 or more
        credits, you may take a credits payout.</p>
        <div>Current Balance: {this.state.prevBalance || 0} credits</div>
        <br/>
        <Button
          bsStyle='success'
          disabled={!this.state.payoutEligible}
          onClick={this.togglePayoutForm}
        > Take Payout </Button>
        <br/><br/><br/>
        {this.state.displayPayoutForm ? <PayoutForm /> : null}
      </div>
    )
  }
}

const testerProfileContainerStyle = {
  display: "flex",
  marginTop: "3%"
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
)(TesterCreditsPage));