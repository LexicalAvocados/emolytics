import React from 'react'
import { connect } from 'react-redux'
import { changeText} from '../actions'
import { bindActionCreators } from 'redux'
import * as ChangeActions from '../actions'
import Navbar from './Navbar.jsx';

import DashboardHome from './creator/dashboard/dashboardHome.jsx';


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <h2> Home </h2>
        <DashboardHome />
      </div>

    )
  }
}



const mapStateToProps = (state) => {
  console.log('state', state);
  return ({
    example: state.example,
    router: state.router
  })
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
})



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
