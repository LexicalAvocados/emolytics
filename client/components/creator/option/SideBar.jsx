import React from 'react';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';

const SideBar = (props) => {

  return (
    <div className='sidemenucontainer' style={{background: '#2c3e50', color: '#FFF', height: '20%'}}>
      <SideNav highlightColor='#eff0f2' highlightBgColor='#7a110d' defaultSelected='overview' onItemSelection={props.changeCb}>
            <Nav id='overview'>
                <NavText className='sideNavItem'> Overview </NavText>
            </Nav>
            <Nav id='emotions'>
                <NavText className='sideNavItem'> Emotions </NavText>
            </Nav>
            <Nav id='attention'>
                <NavText className='sideNavItem'> Attention </NavText>
            </Nav>
            <Nav id='feedback'>
                <NavText className='sideNavItem'> Feedback </NavText>
            </Nav>
        </SideNav>
    </div>
  )
};

export default SideBar;
