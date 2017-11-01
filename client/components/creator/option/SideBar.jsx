import React from 'react';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';


const SideBar = (props) => {

  return (
    <div className='sidemenucontainer' style={{background: '#FFF', color: 'grey'}}>
      <SideNav highlightColor='#90AFC5' highlightBgColor='#f2f2f2' selected={props.currSelected} onItemSelection={props.changeCb}>
          <Nav id='overview'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://cdn2.iconfinder.com/data/icons/thin-charts-analytics/24/thin-1078_kpi_dashboard_report-512.png'}/></NavIcon>
              <NavText className='sideNavItem'> Overview </NavText>
          </Nav>
          <Nav id='heatmap'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://cdn.shopify.com/s/files/1/1061/1924/products/Eyes_Emoji_large.png?v=1480481045'}/></NavIcon>
              <NavText className='sideNavItem'> Heatmap </NavText>
          </Nav>
          <Nav id='emotions'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://cdn3.iconfinder.com/data/icons/stroke/53/28-512.png'}/></NavIcon>
              <NavText className='sideNavItem'> Emotions </NavText>
          </Nav>
          <Nav id='attention'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://cdn2.iconfinder.com/data/icons/business-224/24/Target-512.png'}/></NavIcon>
              <NavText className='sideNavItem'> Attention </NavText>
          </Nav>
          <Nav id='feedback'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://d30y9cdsu7xlg0.cloudfront.net/png/204643-200.png'}/></NavIcon>
              <NavText className='sideNavItem'> Feedback </NavText>
          </Nav>
          <Nav id='annotations'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://cdn3.iconfinder.com/data/icons/abstract-1/512/annotation-512.png'}/></NavIcon>
              <NavText className='sideNavItem'> Annotations </NavText>
          </Nav>
          <Nav id='detailedDemographics'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://i.warosu.org/data/biz/img/0017/28/1484259015773.png'}/></NavIcon>
              <NavText className='sideNavItem'> Demographics+ </NavText>
          </Nav>
          <Nav id='settings'>
              <NavIcon><img className='sidebarIcon' height={25} width={25} src={'https://image.flaticon.com/icons/png/512/32/32441.png'}/></NavIcon>
              <NavText className='sideNavItem'> Settings </NavText>
          </Nav>
      </SideNav>
    </div>
  )
};

export default SideBar;
