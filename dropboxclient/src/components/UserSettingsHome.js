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
import PieChart from "react-svg-piechart"

export default class UserSettingsHome extends React.Component {

    constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      expandedSector: null
    };

    this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this)
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

   handleMouseEnterOnSector(sector) {
        this.setState({expandedSector: sector})
    }

  render() {

    const data = [
            {label: "Facebook", value: 100, color: "#3b5998"},
            {label: "Twitter", value: 60, color: "#00aced"},
            {label: "Google Plus", value: 30, color: "#dd4b39"},
            {label: "Pinterest", value: 20, color: "#80ffdf"},
            {label: "Linked In", value: 10, color: "#ccb3ff"},
        ]
    const {expandedSector} = this.state
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
              <Col sm="6">
                <br />
                User Life Events
                <br /><br />
                <div>

                 <PieChart
                    data={ data }
                    expandedSector={expandedSector}
                    onSectorHover={this.handleMouseEnterOnSector}
                    sectorStrokeWidth={2}
                    expandOnHover
                    shrinkOnTouchEnd
                />

                
                </div>

                
              </Col>
              <Col sm="4">
              <div>
               <br /><br /><br /> <br /><br /><br /><br />
                {
                    data.map((element, i) => (
                        <div key={i}>
                            <span style={{background: element.color}}></span>
                            <span style={{fontWeight: this.state.expandedSector === i ? "bold" : null}}>
                                {element.label} : {element.value}
                            </span>
                        </div>
                    ))
                }
              </div>
              </Col>
             
            </Row>
          </TabPane>
        </TabContent>
      </div>

      </div>
    );
  }
}