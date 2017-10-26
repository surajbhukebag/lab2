import React from 'react';
import {connect} from 'react-redux';
import {userPersonalInfo} from "../actions/useractions";
import { Alert, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class UserPersonalInfo extends React.Component {

  constructor() {
    super();
    this.state = {
      "contact":"",
      "dob":"",
      "email":""
    }
  }

  render() {

    return (     

      <Form>
      
        {this.props.msg ? <Alert color="success">{this.props.msg}</Alert> : ''}
        <br/>
        <FormGroup row>
          <Label for="contact" sm={2}>Contact Number</Label>
          <Col sm={10}>
            <Input type="text" name="contact" id="contact" defaultValue={this.props.pinfo ? this.props.pinfo.contact : ''} placeholder="Contact Number" onChange={(event) => {
                                    this.setState({
                                        contact: event.target.value
                                    });
                                }} required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="dob" sm={2}>Date of Birth</Label>
          <Col sm={10}>
            <Input type="date" name="dob"  id="dob" placeholder="Date of Birth" defaultValue={this.props.pinfo ? this.props.pinfo.dob : ''} onChange={(event) => {
                                    this.setState({
                                        dob: event.target.value
                                    });
                                }} required/>
          </Col>
        </FormGroup>
        <Button className="btn btn-primary" onClick={() => {this.props.userPersonalInfo(this.state, this.props.email)}}>Update</Button>
      </Form>

    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        userPersonalInfo : (data, email) => dispatch(userPersonalInfo(data, email))
    };
}

function mapStateToProps(user) {
  if(user.user.user.basic != null) {
      const email = user.user.user.basic.email;
      let pinfo = "", msg="";
      if(user.user.user.pinfo) {
        pinfo = user.user.user.pinfo;        
        var today = new Date(pinfo.dob);
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        pinfo.dob = yyyy+'-'+mm+'-'+dd;


        msg = user.user.user.pinfo.msg;
        user.user.user.pinfo.msg = "";
      }

      return {email, pinfo, msg};
  }
    
}



export default connect(mapStateToProps, mapDispatchToProps) (UserPersonalInfo);