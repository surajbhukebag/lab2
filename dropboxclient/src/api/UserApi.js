const api = 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const signup = (payload) =>  
    fetch(`${api}/signup`, {
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
            console.log("Sign up Falied with error : "+error);
            return error;
});


export const signin = (payload) =>  
    fetch(`${api}/signin`, {
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
            console.log("Sign in Falied with error : "+error);
            return error;
});

export const signout = () =>  
    fetch(`${api}/signout`, {
        method: 'POST',
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
            console.log("Sign in Falied with error : "+error);
            return error;
});


export const userPersonalInfo = (payload) =>  
    fetch(`${api}/userPersonalInfo`, {
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
            console.log("Updating user Personal info failed with error : "+error);
            return error;
});


export const userEduInfo = (payload) =>  
    fetch(`${api}/userEduInfo`, {
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
            console.log("Updating user Education info failed with error : "+error);
            return error;
});

export const userIntInfo = (payload) =>  
    fetch(`${api}/userIntInfo`, {
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
            console.log("Updating user Interest info failed with error : "+error);
            return error;
});