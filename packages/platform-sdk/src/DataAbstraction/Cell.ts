import { EMessageLevel, TPrimitive } from '../types'
import { Record } from './Record'
import {
  EPropertyType,
  IValidation,
  EAuthorType,
  IStorage,
  ICell,
  ISchemaProperty,
} from './SchemaPrime'

/**
 * @todo move this to a shared TPrimitive
 */

export class Cell implements ICell {
  /**
   * Temporary storage of new value if modified
   */
  private stagedValue?: TPrimitive

  public matchKeySub?: string

  constructor(
    public readonly property: ISchemaProperty,
    private readonly record: Record,
    private liveValue?: TPrimitive,
    public pending?: TPrimitive
  ) {}

  /**
   * Get either the saved value or the current pending value for the cell.
   *
   * @todo something to think about regarding value staging
   */
  get value(): TPrimitive {
    return this.stagedValue !== undefined
      ? this.stagedValue
      : this.liveValue !== undefined
      ? this.liveValue
      : null
  }

  get storedValue(): TPrimitive {
    return this.isPure() ? this.value : null
  }

  get key(): string {
    return this.property.key
  }

  /**
   * Set a new value for the cell (will simply stage for saving)
   *
   * @note will not stage a value that hasn't changed
   * @todo type casting should not be here
   * @todo track history
   */
  setValue(
    value: TPrimitive | undefined,
    _author?: [EAuthorType, string]
  ): void {
    switch (this.property.type) {
      case EPropertyType.NUMERIC:
        if (typeof value === 'string' && value.match(/^[0-9]+$/)) {
          value = parseInt(value, 10)
        }
        break
      case EPropertyType.BOOLEAN:
        if (typeof value === 'string') {
          // making sure we can extend the possible values to map easily
          const parseableLowercaseValuesMap: { [key: string]: boolean } = {
            true: true,
            false: false,
            '1': true,
            '0': false,
            yes: true,
            no: false,
            y: true,
            n: false,
            null: false,
          }
          const lowercaseValue = value.toLowerCase()
          if (
            Object.keys(parseableLowercaseValuesMap).includes(lowercaseValue)
          ) {
            value = parseableLowercaseValuesMap[lowercaseValue]
          }
        }
        break
      case EPropertyType.SCHEMA_REF:
        // sets up two stage deletion where first delete sets value to null
        // and second delete sets pending to null
        // see Cell.toStorage for actual deletion
        if (value === null && this.value === null) {
          this.pending = null
        }
        break
    }
    if (this.liveValue === value) {
      return
    }
    this.stagedValue = value
  }

  /**
   * Return a list of current messages for this cell
   *
   * @param level
   * @returns
   */
  messages(level?: EMessageLevel): IValidation[] {
    return this.record.validations.filter(
      (v) => v.key === this.key && (level === undefined || level === v.error)
    )
  }

  /**
   * If this cell has no error messages, we'll consider it valid
   */
  get isValid(): boolean {
    return !this.messages(EMessageLevel.ERROR).length
  }

  /**
   * Tells us if the value should be placed in pending or not
   *
   * @param val
   * @returns
   */
  public isPure(): boolean {
    const val = this.value
    if (val === null || typeof val === 'undefined') {
      return true
    }
    switch (this.property.type) {
      case EPropertyType.BOOLEAN:
        return typeof val === 'boolean'
      case EPropertyType.NUMERIC:
      case EPropertyType.SCHEMA_REF:
        // Probably need to have 2 types for integer numbers and decimal numbers in the future. For now, only integers
        return typeof val === 'number' && Number.isInteger(val)
      case EPropertyType.ENUM:
        return !!this.property.options.find((o) => o.value === val)
      default:
        return typeof val === 'string'
    }
  }

  /**
   * Prepare values for storage format
   *
   * @returns
   */
  public toStorage(): IStorage {
    const storage: IStorage = {
      value: this.storedValue,
    }
    if (this.property.type === EPropertyType.SCHEMA_REF) {
      if (typeof this.pending !== 'undefined') {
        // if pending is null or is not undefined, set it in storage
        // allowing null is what allows for two step deletion
        storage.pending = this.pending?.toString() ?? null
      }
    } else {
      storage.pending = !this.isPure() ? this.value?.toString() || null : null
    }
    if (this.matchKeySub) {
      storage.match_key_sub = this.matchKeySub
    }
    return storage
  }
}
