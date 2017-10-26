import React from 'react';
import { Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Alert, TabContent, TabPane, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import text from './../images/1.svg';
import logo from './../images/2.svg';
import SharedItem from './SharedItem';
import { Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

class SharingMainHome extends React.Component {

    constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      
       <div className="pt-5">       
       <p className="text-left"><h3>Sharing</h3></p> 
        <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Folders
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Files
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              Links
            </NavLink>
          </NavItem>

          
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
              <br />
              <p className="text-left"><h5>Shared Folders</h5></p>
              <br/>
            
                   {
                      this.props.sharedfolders !== undefined && this.props.sharedfolders.length > 0 ?
                      this.props.sharedfolders.map((file) => {
                      
                        return(
                              <NavLink href="#"> <SharedItem file={file}/> </NavLink>
                          );
                      
                      }) : <Alert color="info">No Shared Folders</Alert>       
                   }

              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
              <br />
              <p className="text-left"><h5>Shared Files</h5></p>
              <br />
                
         
                   {
                      this.props.sharedfiles !== undefined && this.props.sharedfiles.length > 0 ?
                      this.props.sharedfiles.map((file) => {
                      
                        return(
                              <NavLink href="#"> <SharedItem file={file}/> </NavLink>
                          );
                      
                      }) : <Alert color="info">No Shared Files</Alert>       
                   }
              </Col>
            </Row>
          </TabPane>
         <TabPane tabId="3">
            <Row>
              <Col sm="12">
              <br />
                <p className="text-left"><h5>Shared Links</h5></p>
                <br />
                 
         
                   {
                      this.props.sharedlinks !== undefined && this.props.sharedlinks.length > 0 ?
                      this.props.sharedlinks.map((file) => {
                      
                        return(
                              <NavLink href="#"> <SharedItem file={file} /> </NavLink>
                          );
                      
                      }) : <Alert color="info">No Links Created</Alert>       
                   }
              </Col>
            </Row>
          </TabPane>
         
        </TabContent>
      </div>

      </div>

    );
  }
}

function mapStateToProps(files) {
  if(files.files != null) {
      const fileList = files.files.files.files;
      const msg = files.files.files.msg;
      files.files.files.msg = "";
      const sharedfiles = files.files.files.sharedfiles;
      const sharedfolders = files.files.files.sharedfolders;
      const sharedlinks = files.files.files.sharedlinks;
      return {fileList, msg, sharedfiles, sharedfolders, sharedlinks};
  }
    
}

export default withRouter(connect(mapStateToProps, null)(SharingMainHome));