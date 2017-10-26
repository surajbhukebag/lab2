const api = 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const listdir = (payload) =>  
    fetch(`${api}/listdir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("List Dir failed");
            return error;
});


export const fileupload = (payload) =>  
    fetch(`${api}/fileupload`, {
        method: 'POST',
        credentials:'include',
        body: payload        
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("File Upload failed");
            return error;
    });

export const uploadfileToSharedFolder = (payload) =>  
    fetch(`${api}/uploadfileToSharedFolder`, {
        method: 'POST',
        credentials:'include',
        body: payload        
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("File Upload failed");
            return error;
    });


export const createFolder = (payload) =>  
    fetch(`${api}/createFolder`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("Create Dir failed");
            return error;
    });


export const fileDelete = (payload) =>  
    fetch(`${api}/fileFolderDelete`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("File Deletion failed");
            return error;
    });


export const getStarredFiles = (payload) =>  
    fetch(`${api}/starredFiles/`+payload, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include'
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("Get starred files failed");
            return error;
    });

export const generateLink = (payload) =>  
    fetch(`${api}/generateLink`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("File Link creation failed");
            return error;
    });

export const fileShare = (payload) =>  
    fetch(`${api}/share`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("File Sharing failed");
            return error;
    });

        
export const sharedFiles = (payload) =>  
    fetch(`${api}/sharedFiles`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("Get File Sharing data failed");
            return error;
    });

export const sharedFileLinks = (payload) =>  
    fetch(`${api}/sharedFileLinks`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("Get File Sharing data failed");
            return error;
    });


export const starFile = (payload) =>  
    fetch(`${api}/starFile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("Star a file failed");
            return error;
    });



export const getUserActivity = (payload) =>  
    fetch(`${api}/userActivity/`+payload, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include'
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("Get userActivity failed");
            return error;
    });

export const listSharedDir = (payload) =>  
    fetch(`${api}/listSharedDir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then((response) => response.json())

    .then((responseJson) => {
        return responseJson;
    })
        .catch(error => {
            console.log("List shared file failed");
            return error;
    });