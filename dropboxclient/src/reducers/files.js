import {LIST_FILES, FILE_LINK, FILE_SHARE, FILE_SHARE_LIST, FOLDER_SHARE_LIST} from "../actions/files";
import {USER_SIGNOUT} from "../actions/useractions";

const initialState = {
       
        "files":{
            "files":[],
            "msg" :""
        }
};

const files = (state = initialState, action) => {


    switch (action.type) {
        case LIST_FILES :

            if(action.files && action.files.length > 0) {
                return {
                   ...state,
                   "files":{
                        "files" : action.files,
                        "pwd" : action.pwd,
                        "msg" : action.msg
                    }
                };

            }
            else {

                return {
                   ...state,                  
                    "files":{
                        "files" :[],
                        "pwd" : action.pwd,
                        "msg" :"No files available"
                    }
                };

            }

            break;   
         case USER_SIGNOUT :
                if(action.loggedOut) {

                    return {                       
                       "files":{"files":{}, "pwd" :"/"}           
                    };

                }
                else {
                    return {
                        ...state
                    }
                }               

                break;  
        
        case FILE_LINK :

       
            return {
               ...state,
                "link" : action.link                    
              
            };

            
            break;

            case FILE_SHARE :

       
            return {
                ...state,
                   "files":{
                        ...state.files,
                        "msg" : action.msg
                    }                
              
            };

            
            break;

            case FILE_SHARE_LIST :

       
            return {
              ...state,
                   "files":{
                        ...state.files,
                        "sharedfiles" : action.files,
                        "sharedfolders" : action.folders,
                        "sharedlinks" : action.links,
                        "sharedDir" : "/",
                        "sharedDirOwner" : ""
                    }               
            };
           
            break;

            case FOLDER_SHARE_LIST :
       
            return {
              ...state,
                   "files":{
                        ...state.files,
                        ...state.sharedfiles,
                        ...state.sharedlinks,
                        "sharedfolders" : action.folders,
                        "sharedDir" : action.sharedDir,
                        "sharedDirOwner" : action.sharedDirOwner
                    }               
            };
           
            break;
            

        default :
            return state;

    }
};

export default files;