import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';

const NavBar = (props) => (
  <div>
    <Navbar collapseOnSelect fluid fixedTop>
      <Navbar.Header>
        <Navbar.Brand>
          JSONtoSheets
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavItem 
            eventKey={1}
          >
            <Button 
              bsStyle='primary' 
              onClick={props.onFileUploadClick}
            >
              Upload JSON File
            </Button>
          </NavItem>
          <NavItem
            eventKey={2}
          >
            <Button
              bsStyle='primary'
              onClick={props.handleProcessJson}
              disabled={!props.isSignedIn || !props.jsonObj}
            >
              Process to Sheets
            </Button>
          </NavItem>
          <NavItem
            eventKey={3}
          >
            <button className='btn btn-block btn-social btn-google' href='#' onClick={props.handleGoogleAuth}>
              <span className='fa fa-google'></span>
              {
                !props.isSignedIn ?
                  'Sign in with Google' :
                  'Sign out'
              }
            </button>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

NavBar.propTypes = {
  onFileUploadClick: PropTypes.func.isRequired,
  handleProcessJson: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  jsonObj: PropTypes.object,
  handleGoogleAuth: PropTypes.func.isRequired,
};

export default NavBar;
