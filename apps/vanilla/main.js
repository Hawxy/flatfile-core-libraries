import { initializeFlatfile } from '@flatfile/javascript'
import { FlatfileClient } from '@flatfile/api'

// ---Get a space to reuse it, load automatically
/* const flatfile = new FlatfileClient({
  token: 'sk_1234',
  environment: 'https://platform.flatfile.com/api/v1',
})

function getSpace() {
  return flatfile.spaces.get('us_sp_b8n0VLxN')
}

getSpace()
  .then((space) => {
    const flatfileOptions = {
      publishableKey: 'pk_1234',
      environmentId: 'us_env_1234',
      space: {
        id: space?.data.id,
        accessToken: space?.data.accessToken,
      },
      // Additional parameters...
    }
    // Load automatically
    initializeFlatfile(flatfileOptions)
  })
  .catch((error) => {
    console.error('Error retrieving space:', error)
  }) */
//-- end

// ---create a new space each time, load with button click
window.initializeFlatfile = (publishableKey, environmentId) => {
  const flatfileOptions = {
    publishableKey,
    environmentId,
    // Additional parameters...
  }

  initializeFlatfile(flatfileOptions)
}
//-- end

//---load automatically with a new space each time
/* const flatfileOptions = {
  publishableKey: 'pk_1234',
  environmentId: 'us_env_1234',
  // Additional parameters...
}
initializeFlatfile(flatfileOptions) */
//-- end
