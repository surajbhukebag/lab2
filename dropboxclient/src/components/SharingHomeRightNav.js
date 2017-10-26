import React from 'react';
import {connect} from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { Input, Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import logo from './../images/user.png';
import { Link } from 'react-router-dom';
import {uploadToSharedFolder} from "../actions/files";
import {signout} from "../actions/useractions";
import NewFolder from "./NewFolder";

class SharingHomeRightNav extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };

  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  
  handleFileUpload = (event) => {
      if(this.props.shareDir !== '/' && this.props.sharedDirOwner !== "") {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        data.append('path', this.props.shareDir);
        data.append('owner', this.props.sharedDirOwner);
        data.append('uploader', this.props.userId);
        this.props.uploadToSharedFolder(data,  this.props.shareDir, this.props.sharedDirOwner, this.props.userId);  
      }
      
  }


  navigate() {
    this.props.history.push('/');
  }

  navigateSettings() {
    this.props.history.push('/settings');
  }

  render() {
    if(!this.props.loggedin) {
      this.navigate();
    }
    return (
      <div className="pt-5">       
          <div className="row">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle>
                <img  src={logo} alt="fireSpot"/>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>{this.props.fname}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem><a onClick={() => {this.navigateSettings()}}>Settings</a></DropdownItem>
                <DropdownItem divider />
                <DropdownItem><a onClick={() => {this.props.signout()}}>Sign Out</a> </DropdownItem>
              </DropdownMenu>
            </Dropdown>

          </div>
          <br /><br /><br />
          <div className="row">
             <Nav vertical>
              <NavItem>
                <label className="btn-bs-file btn btn-xs btn-primary">
                  Upload<input type="file" hidden  onChange={this.handleFileUpload} />
               </label>
              </NavItem>
               <NavItem>
                <NavLink href="#"><NewFolder buttonLabel="Create Folder"/></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">New Shared File</NavLink>
              </NavItem>

           </Nav>       
          </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        uploadToSharedFolder : (data, sharedDir, sharedDirOwner, userId) => dispatch(uploadToSharedFolder(data, sharedDir, sharedDirOwner, userId)),
        signout : () => dispatch(signout())
    };
}

function mapStateToProps(user) {
  if(user.user.user.basic != null) {
      const email = user.user.user.basic.email;
      const userId = user.user.user.basic.id;
      const fname = user.user.user.basic.fname;
      const loggedin = user.user.user.loggedin;
      let pwd = "/", shareDir, sharedDirOwner;
      if(user.files.files != null ) {
        pwd = user.files.files.pwd;
        shareDir = user.files.files.sharedDir;
        sharedDirOwner = user.files.files.sharedDirOwner
      }
      return {email, fname, loggedin, pwd, userId, shareDir, sharedDirOwner};
  }
    
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (SharingHomeRightNav));