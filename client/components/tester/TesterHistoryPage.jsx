import React from 'react';
import axios from 'axios';
import TesterOptionEntry from './TesterOptionEntry.jsx';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

class TesterHistoryPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    axios.post('/api/tester/getOptionsForTester', {
      id: this.props.loggedInUser.id,
      mode: 'history'
    })
      .then(res => {
        let history = res.data;
        console.log('history:', history);
        if (history.length > 0) this.props.actions.populateTesterHistory(history);
      })
      .catch(err => {
        console.log('Error fetching Tester History from database:', err);
      })
  }

  render() {
    return (
      <div className="testerHomeContainer">
        <h1>Your History</h1><br/>
        {this.props.testerHistory.map((option, i) => {
          return (
            <Link to={`/history/${option.id}`} key={i} onClick={() => this.props.actions.changeTesterOption(option)}>
              <Col md={3}>
                <TesterOptionEntry
                  option={option}
                  index={i}
                />
              </Col>
            </Link>
          )
        })}
      </div>
    )
  }
}


// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  testerHistory: state.testerHistory,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TesterHistoryPage));
