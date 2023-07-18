import { initializeFlatfile } from '@flatfile/javascript'

const flatfileOptions = {
  publishableKey: '',
  environmentId: '',
  displayAsModal: false, //defaults to true for a modal
  //passing in a space is optional
  space: {
    id: '',
    accessToken: '',
  },
  // Additional parameters...
}

//if it opens on a button click

// const openIframeButton = document.getElementById('flatfile_openIframeButton')
// openIframeButton?.addEventListener('click', async () => {

//end if opens on a button click

initializeFlatfile(flatfileOptions)

//for button click

// })

//for button click
