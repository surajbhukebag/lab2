import React from 'react';
import {connect} from 'react-redux';
import {fileDelete} from "../actions/files";
import {generateLink} from "../actions/files";
import {sharewithPpl} from "../actions/files";
import {starAFile} from "../actions/files";

import { Input, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class FileButton extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleModle = this.toggleModle.bind(this);
    this.toggleShareModle = this.toggleShareModle.bind(this);
    this.handleOnclick = this.handleOnclick.bind(this);
    this.state = {
      dropdownOpen: false,
      modal: false,
      shareModal: false,
      sharedwith : ""
    };
  }

    toggleModle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleShareModle() {
        this.setState({
      shareModal: !this.state.shareModal
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleOnclick() {
    this.props.fileDelete(this.props.attr, this.props.email, this.props.pwd, this.props.userId);
    this.toggleModle();
  }

  handleShareClick() {

    this.props.shareWithPpl(this.state.sharedwith, this.props.email, this.props.attr.path);
    this.toggleShareModle();

  }

  handleDownload() {
        fetch(`http://localhost:3001/getDownloadLink`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify({email:this.props.email, path:this.props.attr.path})
        }).then((response) => response.json())
        .then((responseJson) => {
            window.open(responseJson.link);
        }).catch(error => {
        });
  }

  render() {

    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle>
          ...
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <p onClick={this.toggleShareModle}>Share</p>
            <Modal isOpen={this.state.shareModal} toggle={this.toggleShareModle} className={this.props.className}>
              <ModalHeader>Share {this.props.attr.name} ?</ModalHeader>
              <ModalBody>
                  <div className="container-fluid">
                  {this.props.attr.isDirectory ? ''  :
                  <div>
                    <div className="row">
                      <div className="col-md-4"><Button color="primary" onClick={() => {this.props.generateLink(this.props.attr,this.props.email)}}>Share By Link</Button></div>         
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-md-12"><Input type="textarea" readOnly name="link" placeholder={this.props.link} /></div>
                    </div>
                    </div>
                }
           
                 <br/>
                 <div className="row">
                  <div className="col-md-4"><Button color="primary" onClick={() => {this.handleShareClick()}}>Share By Email or Name or Group</Button></div>
                  </div>
                  <br/>
                 <div className="row">
                    <div className="col-md-12"><Input type="text" name="emails" placeholder="Enter Email or Name" onChange={(event) => {
                                    this.setState({
                                        sharedwith: event.target.value
                                    });
                                }} /></div>
                 </div>
                 </div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleShareModle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </DropdownItem>
          {this.props.type === 'file' ? <DropdownItem onClick={() => {this.handleDownload()}}>Download</DropdownItem> : ''}
          {this.props.isStar === 'Y' ? '' :
           <DropdownItem>
          <p onClick={this.toggleModle}>Delete</p>
            <Modal isOpen={this.state.modal} toggle={this.toggleModle} className={this.props.className}>
              <ModalHeader>Delete Confirmation</ModalHeader>
              <ModalBody>
                Are you sure ?
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => {this.handleOnclick()}} >Confirm</Button>{' '}
                <Button color="secondary" onClick={this.toggleModle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </DropdownItem>
          }
          <DropdownItem>
          {this.props.isStar === 1 ? 
              <p onClick={() => {this.props.starAFile(this.props.attr.fileId, this.props.attr.path, this.props.pwd, this.props.userId, "unstar")}}>Remove From Starred</p>
            :
              <p onClick={() => {this.props.starAFile(this.props.attr.fileId, this.props.attr.path, this.props.pwd, this.props.userId, "star")}}>Add To Starred</p>         
         }
         
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        fileDelete : (data, email, pwd, userId) => dispatch(fileDelete(data, email, pwd, userId)),
        generateLink : (data, email) => dispatch(generateLink(data, email)),
        shareWithPpl : (sharedwith, email, path) => dispatch(sharewithPpl(sharedwith, email, path)),
        starAFile : (fileId, path, pwd, userId, star) => dispatch(starAFile(fileId, path, pwd, userId, star))
    };
}

function mapStateToProps(user) {
  if(user.user.user.basic != null) {
      const email = user.user.user.basic.email;
      const userId = user.user.user.basic.id;
      let pwd = "/";
      let link = "Generate Link";
      if(user.files.files != null ) {
        pwd = user.files.files.pwd;
        link = user.files.link;    
      }
      let ul = "http://localhost:3001/fileDownload/"+email+"/";
      return {email, pwd, link, ul, userId};
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (FileButton);