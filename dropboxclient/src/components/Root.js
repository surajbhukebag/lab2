import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import Sigin from './Signin'
import Signup from './Signup'
import NavHeader from './Nav'
import Home from './Home'
import FilesHome from './FilesHome'
import SharingHome from './SharingHome'
import UserSettings from './UserSettings'
import text from './../images/1.svg';
import logo from './../images/2.svg';
import dropbox from './../images/dropbox.jpg';
import { Button } from 'reactstrap';

class Root extends Component {

	render() {


		return(

			<div>
				
	                <Route exact path="/" render={() => (  
	                	
							<div className="container-fluid mt-5">
			
								<div className="row">
									<NavHeader />

								</div>		                    
								<br/><br/><br/>
			                    <div className="row">
				                    <div className="col-md-6">
				                        <div><img  src={dropbox} alt="dropbox"/></div>				                        
				                    </div>

				                     <div className="col-md-6">
				                     	<p className="text-left"><h3>Sign up for new account </h3></p> 
				                     	<br/>
				                        <Signup />
				                        
				                    </div>
			                    </div>                

		                   	</div>
		                  
	                )}/>

					<Route exact path="/home" render={() => (
	                    <div>
	                       <Home />
	                    </div>
	                )} />    

	                <Route exact path="/files" render={() => (
	                    <div>
	                       <FilesHome />
	                    </div>
	                )} />

              		<Route exact path="/sharing" render={() => (
	                    <div>
	                       <SharingHome />
	                    </div>
	                )} />

	                <Route exact path="/settings" render={() => (
	                    <div>
	                       <UserSettings />
	                    </div>
	                )} />                  
            

	            </div>

           
          
			)
	}

}

export default withRouter(Root);