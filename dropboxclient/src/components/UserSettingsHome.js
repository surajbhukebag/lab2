import React from 'react';
import { Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { TabContent, TabPane, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import text from './../images/1.svg';
import logo from './../images/2.svg';
import UserPersonalInfo from './UserPersonalInfo';
import UserEducation from './UserEducation';
import UserInterest from './UserInterest';
import Item from './Item';

export default class UserSettingsHome extends React.Component {

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
       <p className="text-left">User Settings</p> 
        <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Personal Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Education
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              User Interests
            </NavLink>
          </NavItem>

           <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggle('4'); }}
            >
              Life Events
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <br />
                <UserPersonalInfo />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <br />
                <UserEducation />
              </Col>
            </Row>
          </TabPane>
         <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <br />
                <UserInterest />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <br />
                User Life Events
                <br />

              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>

      </div>
    );
  }
}