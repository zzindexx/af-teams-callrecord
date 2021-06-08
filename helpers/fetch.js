const axios = require('axios');

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
async function get(endpoint, accessToken) {
    console.log('Start get');
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.get(endpoint, options);
        return response.data;
    } catch (error) {
        console.log(error)
        return error;
    }
};

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 * @param {object} body
 */
 async function post(endpoint, accessToken, body) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.post(endpoint, body, options);
        return response.data;
    } catch (error) {
        console.log(error.response.data)
        return error;
    }
};

module.exports = {
    get: get,
    post: post
};