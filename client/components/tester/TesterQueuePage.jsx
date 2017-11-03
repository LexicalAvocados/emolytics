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

class TesterQueuePage extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);
  }

  componentWillMount() {
    axios.post('/api/tester/getOptionsForTester', {
      id: this.props.loggedInUser.id,
      mode: 'queue'
    })
      .then(res => {
        let queue = res.data;
        console.log('queue:', queue);
        if (queue.length > 0) this.props.actions.populateTesterQueue(queue);
      })
      .catch(err => {
        console.log('Error fetching Tester Queue from database:', err);
      })
  }

  render() {
    return (
      <div className="testerQueueContainer">
        <h1>Your Queue</h1><br/>
        {this.props.testerQueue.map((option, i) => {
          return (
            <Link onClick={() => {
              this.props.actions.changeTesterOption(option);
            }} key={JSON.stringify(option.name)+i} to={`/video/${option.id}`}>
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
  testerQueue: state.testerQueue,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TesterQueuePage));