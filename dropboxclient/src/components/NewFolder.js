import React from 'react';
import {connect} from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import {createFolder} from "../actions/files";
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class NewFolder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      "email":"",
      "path":"",
      "foldername":""
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
      this.state.path = this.props.pwd;
      this.props.createFolder(this.state, this.props.userId);
      this.toggle();

  }

  render() {

    return (
      <div>
        <br/>
        <a onClick={this.toggle}>{this.props.buttonLabel}</a>
            
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader>Create Folder</ModalHeader>
          <ModalBody>
            <Form>
                <FormGroup>
                  <Label for="folder">Folder Name</Label>
                  <Input type="text" name="folder" id="semail" placeholder="Folder Name" onChange={(event) => {
                                    this.setState({
                                        foldername: event.target.value
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
        createFolder : (data, userId) => dispatch(createFolder(data, userId))
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (NewFolder));