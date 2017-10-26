import React from 'react';
import {connect} from 'react-redux';
import {userInterestInfo} from "../actions/useractions";
import { Table, Dropdown,DropdownToggle, DropdownItem, DropdownMenu, Alert, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class UserInterest extends React.Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      "interest":"",
      "comment":"",
      "userId" : ""
    }
  }

    toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }


  render() {

    return (     
      <div>
      <Form>
      
        {this.props.msg ? <Alert color="success">{this.props.msg}</Alert> : ''}
        <br/>

        <FormGroup row>
          <Label for="college" sm={2}>Select Interest</Label>
          <Col sm={3}>
            <select onChange={(event) => {
                                    this.setState({
                                        interest: event.target.value
                                    });
                                }}>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Arts">Arts</option>
              <option value="Family & Education">Family & Education</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Music">Music</option>
                    <option value="Science & Tech Community">Science & Tech Community</option>
            </select>

          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="college" sm={2}>Comment</Label>
          <Col sm={10}>
            <Input type="text" name="college" id="college" defaultValue={this.props.edu ? this.props.edu.college : ''} placeholder="Comment" onChange={(event) => {
                                    this.setState({
                                        comment: event.target.value
                                    });
                                }} required />
          </Col>
        </FormGroup>


        <Button className="btn btn-primary" onClick={() => {this.props.userInterestInfo(this.state, this.props.userId)}}>Update</Button>
      </Form>
      <br /><br />
      <div>
      <Table>
      <tr>           
            <td><h5>Interest</h5></td>
            <td><h5>Comment</h5></td>
      </tr>
    
  
     
      {this.props.interests !== undefined && this.props.interests.length > 0 ? 
          
           this.props.interests.map((file) => { 
              return (
                  <tr>
                    <td>{file.name}</td>
                    <td>{file.comment}</td>
                  </tr>);
           })
                     
        : '' }
        
        </Table>
        </div>
     
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        userInterestInfo : (data, userId) => dispatch(userInterestInfo(data, userId))
    };
}

function mapStateToProps(user) {
  if(user.user.user.basic != null) {
      const userId = user.user.user.basic.id;
      let msg="";
      const interests = user.user.user.interests;
      return {userId, msg, interests};
  }
    
}



export default connect(mapStateToProps, mapDispatchToProps) (UserInterest);