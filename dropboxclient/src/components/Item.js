import React from 'react';
import { Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {listfiles} from "../actions/files";
import text from './../images/1.svg';
import logo from './../images/2.svg';
import Sigin from './Signin'
import FileButton from './FileButton'
import folder from './../images/folder.jpg';
import file from './../images/file.png';
import { Glyphicon } from 'react-bootstrap';

class Item extends React.Component {

  render() {
    return (
      <div className="container-fluid">
      	{
          this.props.file !== undefined ? 
      		this.props.file.isDirectory ?
            <div className="row" >
              {this.props.file.starred === 1 ? 
                <div className="col-md-10 text-left clickable" ><p  onClick={() => {this.props.getListfiles(this.props.file.path, this.props.email)}}> <img  src={folder} alt="folder"/>&nbsp;&nbsp;{this.props.file.name} &nbsp; &#x2605; </p></div>
                :
                <div className="col-md-10 text-left clickable" ><p  onClick={() => {this.props.getListfiles(this.props.file.path, this.props.email)}}> <img  src={folder} alt="folder"/>&nbsp;&nbsp;{this.props.file.name} &nbsp; &#x2606; </p></div>
                 }
              
              <div className="col-md-2"><FileButton type="folder" attr={this.props.file} isStar={this.props.file.starred} /></div>
            </div>
      		   :
            <div className="row" >
            {this.props.file.starred === 1 ? 
                <div className="col-md-10 text-left"> <img  src={file} alt="file"/> &nbsp;&nbsp;{this.props.file.name} &nbsp; &#x2605; </div>
                :
                <div className="col-md-10 text-left"> <img  src={file} alt="file"/> &nbsp;&nbsp;{this.props.file.name} &nbsp; &#x2606; </div>
                 }
              
              <div className="col-md-2"><FileButton  type="file" attr={this.props.file} isStar={this.props.file.starred}/> </div>
            </div>
             : ''
      	}
      
       <hr />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getListfiles : (data, email) => dispatch(listfiles(data, email))
    };
}

function mapStateToProps(user) {
  if(user.user.user.basic != null) {
      const email = user.user.user.basic.id;
      return {email};
  }
    
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Item));
