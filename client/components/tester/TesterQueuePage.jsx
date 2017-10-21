import React from 'react';
import axios from 'axios';
import TesterQueueOptionEntry from './TesterQueueOptionEntry.jsx';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

class TesterQueuePage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    axios.post('/api/tester/getTesterQueue', {
      id: this.props.loggedInUser.id
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
    console.log('TesterQueuePage render');
    return (
      <div>
        {this.props.testerQueue.map((option, i) => (
          <TesterQueueOptionEntry
            key={i}
            option={option}
            index={i}
          />
        ))}
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