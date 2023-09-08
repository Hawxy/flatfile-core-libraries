import { initializeFlatfile } from '@flatfile/javascript'
import { config } from './config'

/*
// ---Get a space to reuse it, load automatically
const flatfile = new FlatfileClient({
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
  })
//-- end
*/

// ---create a new space each time, load with button click
window.initializeFlatfile = (publishableKey) => {
  const flatfileOptions = {
    publishableKey,
    spaceBody: { name: 'Hello' },
    environmentId: "us_env_3f4Kgm7f",
    // Additional parameters...
    workbook: config,
    exitPrimaryButtonText: 'CLOSE!',
    exitSecondaryButtonText: 'KEEP IT!',
    document: {
      title: 'my title',
      body: 'my body'
    },
    themeConfig: {
      root: {
        primaryColor: '#090B2B',
        dangerColor: '#F44336',
        warningColor: '#FF9800',
      },
      document: {
        borderColor: '#CAD0DC',
      },
      sidebar: {
        logo: 'https://images.ctfassets.net/hjneo4qi4goj/5DNClD4reUBKoF7u01OgKF/2aa12c49c5ea97bac013a7546e453738/flatfile-white.svg',
        textColor: '#ECEEFF',
        titleColor: '#C4C9FF',
        focusBgColor: '#6673FF',
        focusTextColor: '#FFF',
        backgroundColor: '#090B2B',
        footerTextColor: '#C4C9FF',
        textUltralightColor: '#B9DDFF',
        borderColor: '#2E3168',
        activeTextColor: '#FFF',
      },
      table: {},
    },
    sidebarConfig: {
      showGuestInvite: true,
      showDataChecklist: true,
      showSidebar: true,
    }
  }

  initializeFlatfile(flatfileOptions)
}
//-- end

/* 
//---load automatically with a new space each time
const flatfileOptions = {
  publishableKey: 'pk_1234',
  // Additional parameters...
}
initializeFlatfile(flatfileOptions)
//-- end
 */
