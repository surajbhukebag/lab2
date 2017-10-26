import React from 'react';
import { Alert, Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import text from './../images/1.svg';
import logo from './../images/2.svg';
import Item from './Item';
import {connect} from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

class HomeMain extends React.Component {

  render() {
    return (
      <div className="pt-5">       
       <p className="text-left"><strong>Home</strong></p>
       <br/>
       <p className="text-left">Starred</p>
       <div><hr/>
       {this.props.starred !== undefined && this.props.starred.length > 0 ?
        this.props.starred.map((file) => {          
            return(
                   <NavLink href="#"> <Item file={file} /> </NavLink>
              );          
          })
        :
        <Alert color="info">No Starred Items</Alert>
       }
       
       <br/>
       <p className="text-left">User Activity</p>
       <hr/>
        {this.props.recent !== undefined && this.props.recent.length > 0 ?
        this.props.recent.map((file) => {          
            return(
                   <NavLink href="#"> <Item file={file} /> </NavLink>
              );          
          })
        :
        <Alert color="info">No User Activity</Alert>
       }
       <br/>
       </div>
      </div>
    );
  }
}

function mapStateToProps(user) {
  if(user.user.user.starred != null) {
      const starred = user.user.user.starred;
      const recent = user.user.user.activity;
      return {starred, recent};
  }
    
}

export default withRouter(connect(mapStateToProps, null) (HomeMain));