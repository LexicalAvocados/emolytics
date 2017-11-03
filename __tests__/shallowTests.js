import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallow } from 'enzyme';
import { Signup } from '../client/components/auth/signup.jsx';
import { Login } from '../client/components/auth/login.jsx';
import { Navbar } from '../client/components/Navbar.jsx';
import { DashboardHome } from '../client/components/creator/dashboard/dashboardHome.jsx';
import { TesterVideo } from '../client/components/tester/TesterVideo.jsx';

Enzyme.configure({ adapter: new Adapter() });


describe('<Signup />', () => {

  const signup = shallow(<Signup />);
  
  it('renders', () => {
    expect(signup).toHaveLength(1);
  });

});



describe('<Login />', () => {

  const login = shallow(<Login />);

  it('renders', () => {
    expect(login).toHaveLength(1);
  });

});


describe('<Navbar />', () => {

  it('renders for Creators', () => {
    const navbarCreator = shallow(<Navbar loggedInUser={{username: 'bob', isCreator: true}}/>);
    expect(navbarCreator).toHaveLength(1);
  });

  // it('renders for Testers', () => {
  //   const navbarTester = shallow(<Navbar role={{isCreator: false}} loggedInUser={{username: 'alice', isCreator: false}}/>);
  //   expect(navbarTester).toHaveLength(1);
  // });

});


describe('<DashboardHome />', () => {

  const dashboardHome = shallow(<DashboardHome loggedInUser={{username: 'bob', isCreator: true}}/>);

  it('renders', () => {
    expect(dashboardHome).toHaveLength(1);
  });

});

describe('<TesterVideo />', () => {
  const testerVideo = mount(<TesterVideo/>)
})