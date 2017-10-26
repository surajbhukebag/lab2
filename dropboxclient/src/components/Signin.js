import React from 'react';
import {connect} from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import {userSignin} from "../actions/useractions";
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Signin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      "email":"",
      "password":""
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  navigate() {
    this.props.history.push('/home');
  }

  render() {

    if(this.props.isLoggedIn){
      this.navigate();
    }

    return (
      <div>
        <Button outline color="secondary" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader>Sign In</ModalHeader>
          <ModalBody>
        
          {this.props.msg ? <Alert color="success">{this.props.msg}</Alert> : ''}
            <Form>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="email" name="semail" id="semail" placeholder="Email" onChange={(event) => {
                                    this.setState({
                                        email: event.target.value
                                    });
                                }} />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input type="password" name="spassword" id="spassword" placeholder="Password"  onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }} />
                </FormGroup>
                
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {this.props.signin(this.state)}} >Login</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        signin : (data) => dispatch(userSignin(data))
    };
}

function mapStateToProps(user) {
  if(user.user != null) {
      const isLoggedIn = user.user.user.loggedin;
      const msg = user.user.user.signinmsg;
      user.user.user.signinmsg = "";
      return {isLoggedIn, msg};
  }
    
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Signin));