import { createGlobalStyle } from 'styled-components'

import Proxima_Nova_Regular from './proxima-nova/Proxima-Nova_Regular.otf'
import Proxima_Nova_Semibold from './proxima-nova/Proxima-Nova_Semibold.otf'

const FontStyles = createGlobalStyle`
    @font-face {
        font-family: 'Proxima Nova';
        src: local("Proxima Nova"),
        url(${Proxima_Nova_Regular}) format("truetype");
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: 'Proxima Nova';
        src: local("Proxima Nova"),
        url(${Proxima_Nova_Semibold}) format("truetype");
        font-weight: 600;
        font-style: normal;
      }
`
export default FontStyles
