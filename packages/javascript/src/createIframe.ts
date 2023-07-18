import { createModal } from './createModal'

export function createIframe(
  spaceId: string,
  token: string,
  displayAsModal: boolean,
  mountElement: string,
  exitTitle: string,
  exitText: string
): void {
  const baseURL = 'https://spaces.flatfile.com/space/'

  // Construct the URL with the space ID and the token
  const url = `${baseURL}${spaceId}?token=${encodeURIComponent(token)}`

  // Create the close button
  const closeButton = document.createElement('button')
  closeButton.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M18.364 5.636c-0.781-0.781-2.048-0.781-2.828 0l-5.536 5.536 -5.536-5.536c-0.781-0.781-2.048-0.781-2.828 0s-0.781 2.048 0 2.828l5.536 5.536 -5.536 5.536c-0.781 0.781-0.781 2.048 0 2.828s2.048 0.781 2.828 0l5.536-5.536 5.536 5.536c0.781 0.781 2.048 0.781 2.828 0s0.781-2.048 0-2.828l-5.536-5.536 5.536-5.536c0.781-0.781 0.781-2.048 0-2.828z"></path></svg>'
  closeButton.classList.add('flatfile_close-button')

  // Create the iframe
  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.id = 'flatfile_iframe'

  // Add an onload event to handle successful load
  iframe.onload = () => {
    console.log('Flatfile loaded successfully.')
  }

  // Add an onerror event to handle load errors
  iframe.onerror = () => {
    console.error('An error occurred while loading Flatfile.')
  }

  // Create the wrapper
  const wrapper = document.createElement('div')
  wrapper.classList.add('flatfile_iframe-wrapper')
  wrapper.style.display = 'block'

  // Append the iframe and close button to the wrapper
  if (displayAsModal) {
    wrapper.appendChild(closeButton)
    wrapper.classList.add('displayAsModal')
  }
  wrapper.appendChild(iframe)

  // Create the confirmation modal and hide it
  const confirmModal = createModal(
    () => {
      // If user chooses to exit
      wrapper.style.display = 'none'
      confirmModal.style.display = 'none'
    },
    () => {
      // If user chooses to stay, we simply hide the confirm modal
      confirmModal.style.display = 'none'
    },
    exitTitle, // pass exitTitle here
    exitText // pass exitText here
  )
  confirmModal.style.display = 'none'
  document.body.appendChild(confirmModal)

  // Add the onclick event to the button
  closeButton.onclick = () => {
    const outerShell = document.querySelector(
      '.flatfile_outer-shell'
    ) as HTMLElement
    if (outerShell) {
      outerShell.style.display = 'block'
    } else {
      // Show the confirm modal instead of creating a new one
      confirmModal.style.display = 'block'
    }
  }

  // Append the wrapper to the container
  const mountElementId = mountElement
  const mountPoint = document.getElementById(mountElementId)

  if (mountPoint) {
    mountPoint.appendChild(wrapper)
  } else {
    console.error('Mount element not found in the DOM.')
  }

  window.addEventListener(
    'message',
    (event) => {
      console.log('Received message:', event.data)
      if (event.data && event.data.topic === 'job:outcome-acknowledged') {
        wrapper.style.display = 'none'
      }
    },
    false
  )
}
