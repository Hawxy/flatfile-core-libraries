import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import type { ISpace } from '@flatfile/embedded-utils'
import { initializePubnub } from '@flatfile/embedded-utils'
import getSpace from '../../utils/getSpace'
import useInitializeSpace from '../../utils/useInitializeSpace'

import type { SpaceFramePropsType } from './space-frame/spaceFrame.component'

@Component({
  selector: 'flatfile-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
})
export class Space implements OnInit {
  @Input({ required: true }) spaceProps: ISpace = {} as ISpace

  title = 'Space'
  localSpaceData: Record<string, any> | undefined
  spaceFrameProps: SpaceFramePropsType | undefined
  error: { message: string } | undefined
  loading: boolean = true

  // constructor(private cd: ChangeDetectorRef){}

  initSpace = async (spaceProps: ISpace) => {
    const { space, initializeSpace } = useInitializeSpace(spaceProps)
    try {
      const { data } = this.spaceProps.publishableKey
        ? await initializeSpace()
        : await getSpace(spaceProps)
      const { id: spaceId, accessToken, guestLink } = data

      if (!spaceId || typeof spaceId !== 'string') {
        throw new Error('Missing spaceId from space response')
      }

      if (!guestLink || typeof guestLink !== 'string') {
        throw new Error('Missing guest link from space response')
      }

      if (!accessToken || typeof accessToken !== 'string') {
        throw new Error('Missing access token from space response')
      }
      const pubNubData = {
        spaceId,
        accessToken,
        apiUrl: spaceProps.apiUrl || 'https://platform.flatfile.com/api',
      }

      const initializedPubNub = await initializePubnub(pubNubData)

      this.localSpaceData = {
        spaceId,
        spaceUrl: guestLink,
        localAccessToken: accessToken,
        pubNub: initializedPubNub,
      }

      this.loading = false
      this.spaceFrameProps = {
        ...this.spaceProps,
        ...this.localSpaceData,
      } as SpaceFramePropsType
    } catch (error) {
      this.loading = false
      throw new Error(`An error has occurred: ${error}`)
    }
  }

  async ngOnInit() {
    if (!this.spaceProps) throw new Error('Please define the space props')
    await this.initSpace(this.spaceProps)
  }
}
