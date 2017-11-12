import React from 'react';
import {connect} from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import {createGroup} from "../actions/files";
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class NewGroup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      "email":"",
      "path":"",
      "groupName":"",
      "members":""
    };

    this.toggle = this.toggle.bind(this);
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }


  handleCreateFolder() {
      this.state.email = this.props.email;
      this.props.createGroup(this.state, this.props.userId);
      this.toggle();

  }

  render() {

    return (
      <div>
        <br/>
        <a onClick={this.toggle}>{this.props.buttonLabel}</a>
            
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader>Create Group</ModalHeader>
          <ModalBody>
            <Form>
                <FormGroup>
                  <Label for="folder">Group Name</Label>
                  <Input type="text" name="group" id="semail" placeholder="Group Name" onChange={(event) => {
                                    this.setState({
                                        groupName: event.target.value
                                    });
                                }} />

                  <Label for="folder">Group Members</Label>
                  <Input type="text" name="group" id="semail" placeholder="Members email" onChange={(event) => {
                                    this.setState({
                                        members: event.target.value
                                    });
                                }} />
                </FormGroup>                
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {this.handleCreateFolder()}} >Create Folder</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        createGroup : (data, userId) => dispatch(createGroup(data, userId))
    };
}

function mapStateToProps(user) {
  if(user.user.user.basic != null) {
      const email = user.user.user.basic.email;
      const userId = user.user.user.basic.id;
      let pwd = "/";
      if(user.files.files != null ) {
        pwd = user.files.files.pwd;
      }
      return {email, pwd, userId};
  }
    
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (NewGroup));