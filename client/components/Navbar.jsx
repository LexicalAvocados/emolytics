import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
=======
import { Button, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
>>>>>>> with basic navbar and stylesheet

const Navbar = (props) => {

  return (
    <div>
    { !props.isLoggedIn ?
      (
<<<<<<< HEAD
        <div className='navContainer' style={navbarContainerStyle}>
          <Link to='/login' style={noUnderline}>
            <p className='navItem'>Log in </p>
          </Link>
          <Link to='/signup' style={noUnderline}>
            <p className='navItem'>Sign up</p>
          </Link>
        </div>
      ) : (
          <div className='navContainer' style={navbarContainerStyle}>
            <Link to='/' style={noUnderline}>
              <p className='navItem'>Home</p>
            </Link>
            <Link to='/projects' style={noUnderline}>
              <p className='navItem'>Projects</p>
            </Link>
            <Link to='/logout' style={noUnderline}>
              <p className='navItem'>Log out</p>
            </Link>
=======
        <div classID='NavOutside' style={navbarStyle}>
          <ButtonToolbar>
            <Link to='/login'>
              <Button> Log in </Button>
            </Link>
            <Link to='/signup'>
              <Button> Sign up </Button>
            </Link>
          </ButtonToolbar>
        </div>
      ) : (
          <div classID='NavInside' style={navbarStyle}>
          <ButtonToolbar>
            <Link to='/'>
              <Button bsStyle="primary">Home</Button>
            </Link>
            <Link to='/projects'>
              <Button>Projects</Button>
            </Link>
            <Link to='/logout'>
              <Button>Log out</Button>
            </Link>
          </ButtonToolbar>
>>>>>>> with basic navbar and stylesheet
        </div>
      )
    }
    </div>
  )
};

<<<<<<< HEAD
const navbarContainerStyle = {
  float: "right",
  display: "flex",
  padding: "10px",
  marginRight: "3%"
}

const noUnderline = {
  textDecoration: "none"
=======
const navbarStyle = {
  float: "right"
>>>>>>> with basic navbar and stylesheet
}

export default Navbar;
