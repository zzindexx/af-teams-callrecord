const subscriptionPeriod = process.env.SUBSCRIPTION_PERIOD_MINUTES;
const subscriptionSecret = process.env.SUBSCRIPTION_SECRET;
const callBackUrl = process.env.CALLBACK_URL

const fetch = require('../helpers/fetch');
const auth = require('../helpers/auth');
const dateHelper = require('../helpers/date');


module.exports = async function (context, myTimer) {
    const subscriptionUrl = `${process.env.GRAPH_ENDPOINT}v1.0/subscriptions`;
    const subscriptionTill = dateHelper.addMinutes(new Date(), subscriptionPeriod);
    const subscriptionBody = JSON.stringify({
        changeType: "created",
        clientState: subscriptionSecret,
        expirationDateTime: subscriptionTill,
        latestSupportedTlsVersion: "v1_2",
        notificationUrl: callBackUrl,
        resource: "communications/callRecords"
    });
    const authResponse = await auth.getToken(auth.tokenRequest);
    const subscriptionResult = await fetch.post(subscriptionUrl, authResponse.accessToken, subscriptionBody);   
};