const fetch = require('../helpers/fetch');
const auth = require('../helpers/auth');
const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    
    if (req.query && req.query.validationToken) {
        context.res = {
            body: req.query.validationToken
        };
    } else {
        if (req.body.value && req.body.value.length > 0) {
            const authResponse = await auth.getToken(auth.tokenRequest);
            req.body.value.forEach(async (callNotification) => {
                if (callNotification.clientState === process.env.SUBSCRIPTION_SECRET) {
                    if (callNotification.resourceData && callNotification.resourceData.id) {
                        let callDetailsJSON = null;
                        let allSessions = new Array();
                        callDetailsJSON = await fetch.get(`${process.env.GRAPH_ENDPOINT}v1.0/communications/callRecords/${callNotification.resourceData.id}`, authResponse.accessToken);
                        const sessions = await fetch.get(`${process.env.GRAPH_ENDPOINT}v1.0/communications/callRecords/${callNotification.resourceData.id}/sessions?$expand=segments`, authResponse.accessToken);
                        allSessions.push(sessions.value);
                        while (sessions["@odata.nextLink"]) {
                            sessions = await fetch.get(sessions["@odata.nextLink"], authResponse.accessToken);
                            allSessions.push(sessions.value);
                        }
                        callDetailsJSON.sessions = allSessions;
                        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNECTION_STRING);
                        const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);
                        const blobName = `${callNotification.resourceData.id}.json`;
                        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                        const uploadBlobResponse = await blockBlobClient.upload(JSON.stringify(callDetailsJSON), JSON.stringify(callDetailsJSON).length);
                    }
                }
            });

            context.res = {
                status: 202
            };
        }
    }

    context.res = {
        status: 500
    };
}