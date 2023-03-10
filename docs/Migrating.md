---
stoplight-id: 0vxh0n5sc36mf
---

# Migrating to v10

If you are moving your current configuration over to Platform, you should be able to migrate over pretty quickly! 

We’d recommend creating a new branch of your current Platform SDK repo for this, or setting up a clone of your current repository so you can retain your working Workspaces config. Once that is done, set up your `.flatfilerc` file ([learn more](/GettingStarted)) in place of the V3 .env file, and then you can pick up at [Deploying a Workbook](Deploying.md). 

Please note that it is possible to deploy your current configuration without specifying a new `SpaceConfig`, and the `SpaceConfig` will still be created automatically if one does not yet exist. 

You should be able to deploy the same Sheet configs that you have been using with Workspaces to Platform, with a few limitations - `allowCustomFields` is not yet a valid option in Platform Sheets, and LinkedFields are currently being developed. 