import React from 'react';
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