import { useThemeGenerator } from './useThemeGenerator'

describe('useThemeGenerator', () => {
  test('it only accepts valid colors', () => {
    expect(() => useThemeGenerator({ primary: 'hello' })).toThrow(
      'invalid primary color passed'
    )
    expect(() =>
      useThemeGenerator({ primary: '12abe', action: 'fake' })
    ).toThrow('invalid primary color passed')
  })
  test('sets root and sidebar primary color', () => {
    const theme = useThemeGenerator({ primary: 'blue' })
    expect(theme).toStrictEqual({
      root: { primaryColor: 'blue' },
      sidebar: {
        backgroundColor: 'blue',
        titleColor: '#9999ff',
        textColor: '#9999ff',
      },
      table: {
        inputs: { radio: { color: 'blue' }, checkbox: { color: '' } },
        filters: {
          color: '',
          active: { backgroundColor: '' },
          error: { activeBackgroundColor: '' },
        },
        column: {
          header: {
            fontSize: '',
            backgroundColor: 'blue',
            color: '',
            dragHandle: { idle: '', dragging: '' },
          },
        },
        indexColumn: {
          backgroundColor: 'blue',
          selected: { color: 'blue', backgroundColor: '#ffffff' },
        },
        cell: {
          selected: { backgroundColor: '#ffffff' },
          active: { borderColor: '', spinnerColor: '' },
        },
        boolean: { toggleChecked: 'blue' },
        loading: { color: 'blue' },
      },
    })
  })
  test('sets both table primary and action color', () => {
    const forestGreen = '#065535'
    const mustard = '#ffd700'
    const theme = useThemeGenerator({ primary: forestGreen, action: mustard })
    console.log(JSON.stringify(theme))

    expect(theme).toStrictEqual({
      root: { primaryColor: '#065535' },
      sidebar: {
        backgroundColor: '#065535',
        titleColor: '#10e48e',
        textColor: '#10e48e',
      },
      table: {
        inputs: { radio: { color: '#065535' }, checkbox: { color: '#ffd700' } },
        filters: {
          color: '',
          active: { backgroundColor: '#ffd700' },
          error: { activeBackgroundColor: '' },
        },
        column: {
          header: {
            fontSize: '',
            backgroundColor: '#065535',
            color: '',
            dragHandle: { idle: '#ffd700', dragging: '' },
          },
        },
        indexColumn: {
          backgroundColor: '#065535',
          selected: { color: '#065535', backgroundColor: '#c5fbe5' },
        },
        cell: {
          selected: { backgroundColor: '#c5fbe5' },
          active: { borderColor: '#ffd700', spinnerColor: '#ffd700' },
        },
        boolean: { toggleChecked: '#065535' },
        loading: { color: '#065535' },
      },
    })
  })
})
