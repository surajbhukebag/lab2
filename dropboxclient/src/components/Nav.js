import React from 'react';
import { Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Route, withRouter } from 'react-router-dom';
import text from './../images/1.svg';
import logo from './../images/2.svg';
import Sigin from './Signin'

class NavHeader extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div  className="col-md-12">
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/"><div><img  src={logo} alt="fireSpot"/> &nbsp;<img  src={text} alt="fireSpot"/></div> </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
         
            <Nav className="ml-auto" navbar>
              <NavItem>
                 <Button outline color="secondary">Try Dropbox for Business</Button>  
              </NavItem>
              <NavItem>
                &nbsp;&nbsp;&nbsp;
              </NavItem>
              <NavItem className="mr-sm-2">
                <Sigin buttonLabel="Signin" />
              </NavItem>
            </Nav>
          
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavHeader);