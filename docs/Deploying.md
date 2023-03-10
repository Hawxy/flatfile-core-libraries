---
stoplight-id: k1ervz72jvbko
---

# Deploying to Flatfile

## Deploying a Workbook

### Ok, now we're working in your IDE.

Open the cloned `platform-sdk-starter` repo: the `index.ts` file is the source of truth for what configuration will be imported into the account + environment specified in the `.flatfilerc` file.

Reference [this page](https://docs.flatfile.com/docs/guides/workbooks/) for guidance on how to configure Fields in Sheets and Sheets in Workbooks. You can also configure recordCompute (record hooks) and batchRecordCompute (batched record hooks), which will get exported to your environment as part of a Sheet.

### Ok, now we're working in the terminal.
Once you have configured your Workbook according to the docs above, open the terminal in the root directory and run `npm run deploy`. This will deploy your Workbook to your account and Environment specified in `.flatfilerc`.

### Ok, now we're working in the Dashboard.

Now that your Workbook has been deployed, you’ll need to connect it to a Space to be able to see it in the dashboard.
1. From the dashboard, click the “Create new Space” button in the upper right corner.
2. Give your Space a name and then select the name of your newly deployed workbook from the “Config” dropdown.
3. Finally, click the “Create new Space” button again to add the new space to your dashboard.


## Deploying more than a Workbook

The XDK can be used to export a Workbook, but it is also designed to auto-create all of the related configuration if that isn’t necessary.

For example, if you are just going to export a Sheet, the XDK will automatically create a Workbook, Space Configuration, and Agent as necessary.

In this example, the XDK is being used to create a Space Configuration and a Workbook with three sheets.  We are able to name the Space Configuration and Workbook.  Additionally we are able to assign them slugs, which will allow us to make updates to Space Configurations and Workbooks instead of creating them new on each XDK deployment.

```typescript
export default new SpaceConfig({
 name: 'Colin Space Configuration',
 slug: 'Colin_Space_Configuration_sc',
 workbookConfigs: {
   basic: new Workbook({
     name: 'Colin Workbook',
     slug: 'Colin_Workbook_wb',
     namespace: 'Colin Workbook',
     sheets: {
       Partners,
       Portfolios,
       People,
     },
   }),
 },
})
```


## Deploying Multiple Objects
The XDK can be used to export an Agent which allows for multiple space configurations and workbooks to be deployed at a single time.

For example, if we are going to create multiple space configurations to be used across Spaces in Flatfile.

In this example, the XDK is being used to create an Agent with three Space Configurations (Colin Space Configuration, Colin Partner Space Configuration, and Colin Portfolio Space Configuration) each containing a Workbook and a varying number of sheets. 

```typescript
export default new Agent({
 spaceConfigs: {
   Both: new SpaceConfig({
     name: 'Colin Space Configuration',
     slug: 'Colin_Space_Configuration_sc',
     workbookConfigs: {
       basic: new Workbook({
         name: 'Colin Workbook',
         slug: 'Colin_Workbook_wb',
         namespace: 'Colin Workbook',
         sheets: {
 		Partners,
       	Portfolios,
       	People,
         },
       }),
     },
   }),


   Contact: new SpaceConfig({
     name: 'Colin Partner Space Configuration',
     slug: 'Colin_Partner_Space_Configuration_sc',
     workbookConfigs: {
       basic: new Workbook({
         name: 'Partners Workbook',
         slug: 'Partners_workbook_wb',
         namespace: 'Partners',
         sheets: {
           Partners,
         },
       }),
     },
   }),
   Matter: new SpaceConfig({
     name: 'Colin Portfolio Space Configuration',
     slug: 'Colin_Portfolio_Space_Configuration_sc',
     workbookConfigs: {
       basic: new Workbook({
         name: 'Portfolios Workbook',
         slug: 'Portfolios_workbook_wb',
         namespace: 'Portfolios',
         sheets: {
           Portfolios,
         },
       }),
     },
   }),
 },
})
```

## Deploying an Agent

When you deploy an Agent to an Environment, it automatically gets subscriptions to all Events in that Environment. Flatfile makes sure that it stays alive and sends all logs to the dashboard. Its main purpose is to make it easier to manage events.

An Agent consists of:

- Some Javascript code specifying some actions to be taken in response to an Event
- An environment whose Events you want to listen and respond to
- A list of topics

