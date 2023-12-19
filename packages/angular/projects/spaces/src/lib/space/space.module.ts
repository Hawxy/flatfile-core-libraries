import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SpaceCloseModal } from './space-close-modal/spaceCloseModal.component'
import { SafePipe } from './space-frame/iframeSafePipe'
import { SpaceFrame } from './space-frame/spaceFrame.component'
import { Space } from './space.component'
import { Spinner } from './spinner/spinner.component'

@NgModule({
  declarations: [Space, SpaceFrame, SpaceCloseModal, SafePipe, Spinner],
  imports: [CommonModule],
  exports: [Space],
})
export class SpaceModule {}
