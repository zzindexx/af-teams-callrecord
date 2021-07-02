# Saving Microsoft Teams calls and meetings data (callRecord) to Azure Blob Storage
This silution allows to get callRecords data from Microsoft Teams and store them in Azure Blob Storage. Later those files could be used to analyze some security questions withing the organization or could be used in automation scenarios.

## How it works
Solution consists of 2 functions:
* Subscription - makes an HTTP call to Microsoft Graph API in order to create a subscription for callRecord entity
* ProcessCallRecord - an HTTP triggered function to process the subscription process and the actual callRecord creation (MS Graph API sends an HTTP request)

## Deployment process

### Register Azure AD application
You need to Register only one application in Azure AD, that will be used to create subscription and to parse the actual callRecords
1. Log in to the Azure Portal for your subscription, and go to the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) blade.
1. Click **New registration** to create an Azure AD application.
   * **Name**: specify any name for the application based on your organizationnaming convention
   * **Supported account types**: select "Accounts in this organizational directory"
1. Click **Register** to complete the registration.
1. When the app is registered, you'll be taken to the app's "Overview" page. Copy the Application (client) ID and Directory (tenant) ID; we will need it later
1. On the side rail in the Manage section, navigate to the "Certificates & secrets" section. In the Client secrets section, click on "+ New client secret". Add a description for the secret, and choose when the secret will expire. Click "Add".
1. Once the client secret is created, copy its Value; we will need it later.

### Deploy to Azure
1. Click on the Deploy to Azure button below.

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fzzindexx%2Faf-teams-callrecord%2Fmain%2Fazuredeploy.json)

1. When prompted, log in to your Azure subscription.
1. Azure will create a "Custom deployment" based on the Company Communicator ARM template and ask you to fill in the template parameters.
1. Select a subscription and a resource group.

   The resource group location MUST be in a datacenter that supports all the following:
   * Storage Accounts
   * Application Insights
   * Azure Functions

1. Enter an App Name, which the template uses to generate names for the other resources.
   * The **[App Name]** must be available. For example, if you select contosocallrecords as the base name, the name contosocallrecords must be available (not taken); otherwise, the deployment will fail with a Conflict error.
   * Remember the base resource name that you selected. We will need it later.

1. Update the following fields in the template: 
   * **Storage account type**: storage account type for Azure functions
   * **Location**: location of the resources
   * **App Insights Location**: location for Application Insights
   * **Aad Endpoint**: Azure Active Directory endpoint
   * **Graph API Endpoint**: Graph API endpopint
   * **Client Id**: Id of the Azure Application Registration 
   * **Client Secret**: Client Secret of the Azure Application Registration 
   * **Tenant Id**: Your tenant Id
   * **Blob Connection String**: connection string to your Azure Blob storage to save data about callRecords (must be created separately)
   * **Blob Container Name**: the naame of the container to store data
   * **Subscription Period In Minutes**: for how long should the Subscription function create an actual subscription to Graph API (by default 1440 minutes = 24 hours). Should be changed when the CRON expression is changed for Subscription function
   * **Subscription Secret**: a secret string to compare when a subscription is created and ProcessCallRecord function is triggered. Keep this value in secret.
   * **Git Repo Url**: if you have cloned the hole repo to another location, you should paste the actual git repository URL
   * **Git Branch**: if you have cloned the hole repo and have changed the name of the branch to another location, you should paste the actual name here


## Disabling data collection
In order to stop the collection of data:
1. Log in to the Azure Portal
1. Find the appropriate Function App resource
1. On the left menu select **Functions**
1. Open the **Subscription** function
1. Click **Disable** in the top menu

 When the subscription period elapses, no more data would be collected.

## Related articles
* [callRecord Reference](https://docs.microsoft.com/en-us/graph/api/resources/callrecords-api-overview?view=graph-rest-1.0)
* [Graph API change notification](https://docs.microsoft.com/en-us/graph/api/resources/webhooks?view=graph-rest-1.0)



