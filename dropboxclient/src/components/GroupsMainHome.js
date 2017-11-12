import React from 'react';
import { Alert, Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import text from './../images/1.svg';
import logo from './../images/2.svg';
import GroupItem from './GroupItem';
import { Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

class GroupsMainHome extends React.Component {

  render() {
    return (
      <div className="pt-5">       
       <p className="text-left">Groups</p>
       <br/>
       {this.props.msg ? <Alert color="info">{this.props.msg}</Alert> :''}
       <hr/>
       {
          this.props.groups !== undefined && this.props.groups.length > 0 ?
          this.props.groups.map((group) => {
          
            return(
                  <NavLink href="#"> <GroupItem group={group} /> </NavLink>
              );
          
          }) : <Alert color="info">No Groups found.</Alert>       
       }

                         
       
       <br/>
      </div>
    );
  }
}


function mapStateToProps(files) {
  if(files.files != null) {
      const groups = files.files.files.groups;
       let msg = "";
       console.log(groups)
      if(groups === undefined) {
        msg = "No groups found."
      }
     console.log(msg)
      files.files.files.msg = "";
      return {groups, msg};
  }
    
}


export default withRouter(connect(mapStateToProps, null) (GroupsMainHome));