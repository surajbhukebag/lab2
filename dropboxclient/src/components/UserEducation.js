import React from 'react';
import {connect} from 'react-redux';
import {userEduInfo} from "../actions/useractions";
import { Alert, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class UserEducation extends React.Component {

  constructor() {
    super();
    this.state = {
      "college":"",
      "sdate":"",
      "edate":"",
      "major": "",
      "gpa":""
    }
  }

  render() {

    return (     

      <Form>
      
        {this.props.msg ? <Alert color="success">{this.props.msg}</Alert> : ''}
        <br/>
        <FormGroup row>
          <Label for="college" sm={2}>Collge Name</Label>
          <Col sm={10}>
            <Input type="text" name="college" id="college" defaultValue={this.props.edu ? this.props.edu.college : ''} placeholder="College Name" onChange={(event) => {
                                    this.setState({
                                        college: event.target.value
                                    });
                                }} required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="sdate" sm={2}>Start Date</Label>
          <Col sm={10}>
            <Input type="date" name="sdate"  id="sdate" placeholder="Start Date" defaultValue={this.props.edu ? this.props.edu.sdate : ''} onChange={(event) => {
                                    this.setState({
                                        sdate: event.target.value
                                    });
                                }} required/>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="edate" sm={2}>End Date</Label>
          <Col sm={10}>
            <Input type="date" name="edate"  id="edate" placeholder="End Date" defaultValue={this.props.edu ? this.props.edu.edate : ''} onChange={(event) => {
                                    this.setState({
                                        edate: event.target.value
                                    });
                                }} required/>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="major" sm={2}>Major</Label>
          <Col sm={10}>
            <Input type="text" name="major" id="major" defaultValue={this.props.edu ? this.props.edu.major : ''} placeholder="Major" onChange={(event) => {
                                    this.setState({
                                        major: event.target.value
                                    });
                                }} required />
          </Col>
        </FormGroup>


        <FormGroup row>
          <Label for="gpa" sm={2}>GPA</Label>
          <Col sm={10}>
            <Input type="text" name="gpa" id="gpa" defaultValue={this.props.edu ? this.props.edu.gpa : ''} placeholder="GPA" onChange={(event) => {
                                    this.setState({
                                        gpa: event.target.value
                                    });
                                }} required />
          </Col>
        </FormGroup>

        <Button className="btn btn-primary" onClick={() => {this.props.userEduInfo(this.state, this.props.email)}}>Update</Button>
      </Form>

    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        userEduInfo : (data, email) => dispatch(userEduInfo(data, email))
    };
}

function mapStateToProps(user) {
  if(user.user.user.basic != null) {
      const email = user.user.user.basic.email;
      let edu = "", msg="";
      if(user.user.user.eduinfo) {
        edu = user.user.user.eduinfo;        
        var today = new Date(edu.sdate);
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        edu.sdate = yyyy+'-'+mm+'-'+dd;

        today = new Date(edu.edate);
       dd = today.getDate();
         mm = today.getMonth()+1; //January is 0!

         yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        edu.edate = yyyy+'-'+mm+'-'+dd;


        msg = user.user.user.eduinfo.msg;
        user.user.user.eduinfo.msg = "";
      }

      return {email, edu, msg};
  }
    
}



export default connect(mapStateToProps, mapDispatchToProps) (UserEducation);