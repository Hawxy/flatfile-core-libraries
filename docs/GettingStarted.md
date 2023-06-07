---
stoplight-id: qes765em7e7fl
---

# Getting Started

**The most up to date getting started are at [flatfile.com/docs](https://flatfile.com/docs). Head over there!**

## Technical requirements:

- Node version 16 or higher installed. (Note: if you don’t have node.js on your machine, download it [here](https://nodejs.org/en/download/))
- IDE: typically VSCode or IntelliJ

## Installation

### Sign up and get your keys in the Dashboard

1. [Sign up](https://dashboard.flatfile.com/account/sign-up) for a new Flatfile account
2. Go to your Flatfile dashboard and create an API access key and secret in the Developer area.
3. Once you create an access key, copy the terminal command at the bottom of the dialog. (Save this command to a Notepad, you'll need the values in it later)

### Ok, now we're working in terminal

1. Using terminal commands, navigate to your preferred working directory.
2. Copy and run the terminal command you copied in the preview step.
3. Replace `flatfile-workbook` with your desired project name:

```cli
npx flatfile init --team 2668 --key <access key>  --secret <secret>  --environment test --name "flatfile-workbook"
```

### Head back to the Dashboard

1. Login to the dashboard.
2. Click the “Generate sample space” button to generate a sample space and environment.

### Ok, now we're working in your IDE.

Rename `.flatfilerc.example` to `.flatfilerc`. Make sure that “`.flatfilerc`” is named exactly like this, or else your deploys will fail. This file should look like this:

```json
{
  "endpoint": "https://platform.flatfile.com/api/v1", //always this
  "env": "us_env_6fXBNCpi", //`environment_id` presented at the welcome screen
  "version": "10", //always this
  "team": "1", //always this
  "clientId": "", //`Client Id` from your quick command
  "secret": "" //`Secret` from your quick command

  //Generate new from the Developer page at any time
}
```

### Head back to terminal

At the root directory, run the following commands:

1. `npm install`
2. `npm update flatfile`

### Up Next

[Learn about Spaces & Workbooks](Workbooks.md)
