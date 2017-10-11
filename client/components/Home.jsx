import React from 'react'
import { connect } from 'react-redux'
import { changeText} from '../actions'
import { bindActionCreators } from 'redux'
import * as ChangeActions from '../actions'
import ProjectHome from './creator/project/ProjectHome.jsx' //REMOVE THIS


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <div>
        <h2> Home </h2>
        <ProjectHome />   {/*REMOVE THIS */}
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