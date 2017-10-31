import {USER_SIGNUP, USER_SIGNIN, USER_SIGNOUT, USER_PINFO, USER_EDUINFO, USER_STAR_ACT, USER_INTINFO} from "../actions/useractions";

const initialState = {
       
        "user":{
            "signupmsg": "",
            "signinmsg" :""
        }
};

const user = (state = initialState, action) => {


    switch (action.type) {
        case USER_SIGNUP :
            if(action.user) {

                return {
                   ...state,
                   "user":{
                            "signupmsg" : "Sign Up sucessful. Please Login."
                        }
                };

            }
            else {

                return {
                   ...state,
                   "user":{                            
                            "signupmsg" : action.msg
                        }
                };

            }

            break;   

         case USER_SIGNIN :
                  if(action.user) {

                    return {
                       ...state,
                       "user":{
                                "basic": action.user,
                                "pinfo" : action.pinfo,
                                "eduinfo" : action.eduinfo,
                                "loggedin" : true,
                                "interests" : action.interests,
                                "starred" : action.starred,
                                "activity" : action.activity                                
                            }
                    };

                }
                else {
                    console.log(action.msg);
                    return {
                       ...state,
                       "user":{                            
                                "loggedin" : false,
                                "signinmsg" : action.msg
                            }
                    };

                }

                break;    


         case USER_SIGNOUT :
                if(action.loggedOut) {

                    return {                       
                       "user":{
                                "loggedin" : false                                
                            }                
                    };

                }
                else {
                    return {
                        ...state
                    }
                }               

                break;     

         case USER_PINFO :
                if(action.pinfo) {

                    return {
                       ...state,
                       "user":{
                                "basic":state.user.basic,
                                "loggedin":state.user.loggedin,
                                "eduinfo" : state.user.eduinfo,
                                "pinfo": action.pinfo,
                                 "interests" : state.user.interests,
                                "starred" : state.user.starred,
                                "activity" : state.user.activity

                            }
                    };

                }
                else {
                    return {
                        ...state
                    }
                }               

                break;
         case USER_EDUINFO :
                if(action.eduinfo) {

                    return {
                       ...state,
                       "user":{
                                "basic":state.user.basic,
                                "loggedin":state.user.loggedin,
                                "pinfo": state.user.pinfo,
                                 "interests" : state.user.interests,
                                "starred" : state.user.starred,
                                "activity" : state.user.activity,
                                "eduinfo" : action.eduinfo
                            }
                    };

                }
                else {
                    return {
                        ...state
                    }
                }               

                break;

             case USER_STAR_ACT :
                if(action.starred) {
              
                    return {
                       ...state,
                       "user":{
                                "basic": state.user.basic,
                                "loggedin" : state.user.loggedin,
                                "pinfo": state.user.pinfo,
                                "eduinfo" : state.user.eduinfo,
                                   "interests" : state.user.interests,
                                "starred" : action.starred,
                                "activity" : action.activity
                            }
                    };

                }
                else {
                    return {
                        ...state
                    }
                }               

                break;

                case USER_INTINFO :
                if(action.interests) {
              
                    return {
                       ...state,
                       "user":{
                                "basic": state.user.basic,
                                "loggedin" : state.user.loggedin,
                                "pinfo": state.user.pinfo,
                                "eduinfo" : state.user.eduinfo,
                                "starred" : state.user.starred,
                                "activity" : state.user.activity,
                                "interests" : action.interests
                            }
                    };

                }
                else {
                    return {
                        ...state
                    }
                }               

                break;
       
        default :
            return state;

    }
};

export default user;