import React from 'react';
import {connect} from 'react-redux';
import {userSignup} from "../actions/useractions";
import { Alert, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Signup extends React.Component {

  constructor() {
    super();
    this.state = {
      "fname":"",
      "lname":"",
      "email":"",
      "password":""
    }
  }

  render() {

    return (     

      <Form>
      
        {this.props.expression ? <Alert color="success">{this.props.expression}</Alert> : ''}
      
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>Email</Label>
          <Col sm={10}>
            <Input type="email" name="email" id="exampleEmail" placeholder="Email" onChange={(event) => {
                                    this.setState({
                                        email: event.target.value
                                    });
                                }} required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="examplePassword" sm={2}>Password</Label>
          <Col sm={10}>
            <Input type="password" name="password" id="examplePassword" placeholder="Password"  onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }} required/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleText" sm={2}>First Name</Label>
          <Col sm={10}>
            <Input type="text" name="fname" id="fname" placeholder="First Name" onChange={(event) => {
                                    this.setState({
                                        fname: event.target.value
                                    });
                                }} required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleText" sm={2}>Last Name</Label>
          <Col sm={10}>
            <Input type="text" name="lname" id="lname" placeholder="Last Name" onChange={(event) => {
                                    this.setState({
                                        lname: event.target.value
                                    });
                                }} required/>
          </Col>
        </FormGroup>
        <Button className="btn btn-primary" onClick={() => {this.props.signup(this.state)}}>Submit</Button>
      </Form>

    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        signup : (data) => dispatch(userSignup(data))
    };
}

function mapStateToProps(user) {
  if(user.user != null) {
      const expression = user.user.user.signupmsg;
      console.log(expression);
      user.user.user.signupmsg = "";
      return {expression};
  }
    
}

export default connect(mapStateToProps, mapDispatchToProps) (Signup);