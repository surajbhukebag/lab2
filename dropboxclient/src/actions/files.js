import * as API from '../api/FilesApi';
import {USER_SIGNOUT} from './useractions';
export const LIST_FILES = 'LIST_FILES';
export const FILE_UPLOAD = 'FILE_UPLOAD';
export const FILE_DELETE = 'FILE_DELETE';
export const FILE_LINK = "FILE_LINK";
export const FILE_SHARE = "FILE_SHARE";
export const FILE_SHARE_LIST = "FILE_SHARE_LIST";
export const FILE_STAR = "FILE_STAR";
export const FOLDER_SHARE_LIST = "FOLDER_SHARE_LIST";
export const USER_GROUPS = "USER_GROUPS";


export function listfiles(dir, email, msg) {

	let req = {dir:dir, id:email};

	return function(dispatch) {
		return  API.listdir(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
			    			dispatch(updateListFiles(resData, dir, msg)); 	
			    		}
				        
	      		});
	  	};
}

function invalidSession() {

		return {
			type: USER_SIGNOUT,
			loggedOut: true
		}

}

export function updateListFiles(resData, dir, msg) {

	return {
		type: LIST_FILES,
		files : resData.files,
		pwd : dir,
		msg : msg
	}
	
}

export function fileUpload(data, email, pwd, userId) {
	
	return function(dispatch) {
		return  API.fileupload(data)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
			    			console.log("userd id : "+ userId);
				        	dispatch(listfiles(pwd,userId, resData.msg)); 
				    	}
	      		});
	  	};
}


export function createFolder(data, userId) {
	console.log("email "+data.path);
	let req = {email:data.email, path:data.path, folderName:data.foldername};

	return function(dispatch) {
		return  API.createFolder(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
				        	dispatch(listfiles(data.path, userId, resData.msg)); 
				    	}
	      		});
	  	};
}

export function fileDelete(file, email, pwd, userId) {
	let req = {email:email, path:file.path, isDirectory:file.isDirectory, id:userId};
	
	return function(dispatch) {
		return  API.fileDelete(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
				        	dispatch(listfiles(pwd,userId, resData.msg)); 
				    	}
	      		});
	  	};

}

export function generateLink(data, email) {
	let req = {email:email, path:data.path};


	return function(dispatch) {
		return  API.generateLink(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
				        	dispatch(getLinkData(resData)); 
				    	}
	      		});
	  	};

}

function getLinkData(resData) {
	if(resData.code === 200) {
		return {
			type: FILE_LINK,
			link: resData.link
		};
	}
	else {
	return {
			type: FILE_LINK
		};	
	}

}

export function sharewithPpl(sharedwith, email, path) {

	let req = {email:email, path:path, sharedWith:sharedwith};

	return function(dispatch) {
		return  API.fileShare(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
				        	dispatch(getFileShareData(resData)); 
				    	}
	      		});
	  	};
}

function getFileShareData(resData) {
	
	return {
			type: FILE_SHARE,
			msg: resData.msg
	};
}

export function getSharedfiles(email) {
	
let req = {email:email};

	return function(dispatch) {
		return  API.sharedFiles(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
				        	
				        	API.sharedFileLinks(req)
						    	.then((rsData) => {
						    		if(resData.code === 502) {
						    			dispatch(invalidSession()); 
						    		}
						    		else {
							        	dispatch(getSharedFileData(resData, rsData));
							    	}
				      		});
				    	}
	      		});
	  	};

}

function getSharedFileData(resData, rsData) {
	return {
		type: FILE_SHARE_LIST,
		files: resData.files,
		folders: resData.folders,
		links: rsData.links
	}
}

export function starAFile(fileId, path, pwd, userId, star) {
	let req = {id:userId, path:path, star:star};

	return function(dispatch) {
		return  API.starFile(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
				        	dispatch(listfiles(pwd,userId, resData.msg)); 
				    	}
	      		});
	  	};

}

export function listSharedfiles(dir, email, owner) {

	let req = {dir:dir, id:owner, user:email};

	return function(dispatch) {
		return  API.listSharedDir(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
			    			console.log("Files : "+resData.files.length);
			    			dispatch(updateSharedFolders(resData, dir, owner)); 	
			    		}
				        
	      		});
	  	};

}


function updateSharedFolders(resData, dir, owner) {
	console.log("shared files "+resData.files.length);
	return {
		type: FOLDER_SHARE_LIST,
		folders: resData.files,
		sharedDir : dir,
		sharedDirOwner : owner
	}
}

export function uploadToSharedFolder(data, sharedDir, sharedDirOwner, userId) {

	return function(dispatch) {
		return  API.uploadfileToSharedFolder(data)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {
			    			console.log("dir : "+sharedDir);
			    			console.log("User : "+userId);
			    			console.log("owner :"+sharedDirOwner);
				        	dispatch(listSharedfiles(sharedDir, userId, sharedDirOwner)); 
				    	}
	      		});
	  	};	

}

export function getGroups(email) {

	let data = {email: email}

	return function(dispatch) {
		return  API.userGroups(data)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {			    			
				        	dispatch(userGroupData(resData)); 
				    	}
	      		});
	  	};	

	
}

function userGroupData(resData) {
	return {
		type: USER_GROUPS,
		groups: resData.groups
	}
}

export function createGroup(data, userId) {

	let req = {userId: userId, name: data.groupName, members: data.members};

	return function(dispatch) {
		return  API.group(req)
			    	.then((resData) => {
			    		if(resData.code === 502) {
			    			dispatch(invalidSession()); 
			    		}
			    		else {			    			
				        	dispatch(getGroups(data.email)); 
				    	}
	      		});
	  	};	



}