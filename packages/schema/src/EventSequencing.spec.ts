import { FieldTester, WorkbookTester } from './WorkbookTester'
import { NumberField, Message, TextField } from '@flatfile/configure'

//const Constant = ({ rv }: { rv: number }) => {
const Constant = (rv: any) => {
  return (...args: any[]) => {
    return rv
  }
}

const AConstant = (rv: any) => {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      resolve(rv);
    });
  }
}


const Undefined = Constant(undefined)
const Null = Constant(null)

const Throw = (errType: string) => {
  return (...args: any[]) => {
    throw errType
  }
}

const C = Constant
const U = Undefined

const parseFinite = (v: any): any => {
  const val = parseInt(v)
  if (isFinite(val)) {
    return val
  }
  //throw `${v} is not finite`
  return undefined
}

/*
  These throw errors because they return an async function

NumberField({required:false, cast:AConstant(1)})
NumberField({required:false, validate:AConstant(1)})
*/


NumberField({required:false, cast:Constant(1)})
NumberField({required:false, empty:():number => {return 1}})
NumberField({required:false, compute:(val:number):number => {return 1}});
NumberField({required:false, validate:Constant(1)})

const BaseField = { type: 'number', label: 'a', required: true }
describe('Field Hook ->', () => {
    test('correctly calls cast casts object to default number', async () => {
      const ft = new FieldTester({ ...BaseField, cast: C(1) })
      // verify that no matter what is passed in, `1` is the result of cast
      await ft.checkFieldResult('a', 1)
      await ft.checkFieldResult('50', 1)

      const ft2 = new FieldTester({ ...BaseField, cast: C('a string') })
      // verify that no matter what is passed in, `1` is the result of cast
      await ft2.checkFieldResult('a', 'a string')
      await ft2.checkFieldResult('50', 'a string')
    })

    test('correctly calls cast casts object to default number', async () => {
      const ft = new FieldTester({
        ...BaseField,
        required: true,
        cast: Null,
        onValidation: Throw('validation error'),
      })
      // note that onValidation isn't called because the system errored after empty
      //.testAnnotations(undefined, {'required': "missing"})
      await ft.checkFieldResult('b', null)
    })

    test('compute correctly calls cast casts object to default number', async () => {
      const ft = new FieldTester({ ...BaseField, cast: Null, empty: C(2) })
      await ft.checkFieldResult('c', 2)
      await ft.checkFieldResult('40', 2)
    })

    test('processing stops after cast error and the result of the cell is null ', async () => {
      const ft = new FieldTester({
        ...BaseField,
        cast: Throw('castError'),
        empty: C(2),
      })
      // empty should never be called becaust cast through an error
      await ft.matchFieldMessage('z', {
        level: 'error',
        stage: 'cast',
        message: 'castError',
      })
      // counterintuitively this is the correct answer, going with z
      // allows the user to edit the value and see the original
      await ft.checkFieldResult('z', 'z')
    })

    test('test that validation errors show up ', async () => {
      const ft = new FieldTester({
        ...BaseField,
        cast: C(1),
        validate: Throw('called'),
      })
      await ft.checkFieldMessage('10', 'called')
    })
    /*
    test("show that compute isn't called after an undefined cast  ", async () => {
      const ft = new FieldTester(
        { ...BaseField, cast: U, compute: C(31)})
      // compute will never be called in this scenario
      await ft.checkFieldResult('e', undefined)
      await ft.checkFieldResult('60', undefined)
    })
  */

    test("show that compute isn't called after a null cast  ", async () => {
      const ft = new FieldTester({ ...BaseField, cast: Null, compute: C(32) })
      // compute will never be called in this scenario
      await ft.checkFieldResult('e', null)
      await ft.checkFieldResult('60', null)
    })

  test('test that validation errors show up after record onChange', async () => {
    const rawData = { a: '10', b: '' }
    const message = 'called'
    const workbookTest = new WorkbookTester(
      {
        a: NumberField({
          ...BaseField,
          cast: C(1),
          compute: (v) => {
            return v * 2
          },
          validate: (v) => {
            if (v === 7) {
              throw 'called'
            }
          },
        }),
        b: TextField(),
      },
      {
        onChange: (record: any) => {
          if (record.get('a') === 2) {
            record.set('a', 7)
          }
        },
      }
    )
    await workbookTest.checkRowResult({ rawData, message })
  })

  // const ft = new FieldTester(
  //   {...BaseField, hooks: {cast: U, empty:C(2), compute:C(3)}})
  //   // compute will never be called in this scenario
  //   .testFullHooks('a', 3)
  //   .testFullHooks(20, 3)

  // const ft = new FieldTester(
  //   {...BaseField, hooks: {cast: U, compute:C(3), validate:Throw("called")}})
  //   // validate isn't called for a non existent value
  //   .testValidateError('a', null)
})

// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField, hooks: {cast: C(1)}},
// 	    hooks: {onChange:C({a:5})}})
//   .rowResult({a:10},{a:5})

// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField, hooks: {cast: C(1)}},
// 	    hooks: {validate: C({a:"rowValidate"})}})
//   .rowValidate({a:2},{a:["rowValidate"]})

// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField,
// 			     hooks: {cast: C(1), validate:C("fieldValidate")}},
// 	    hooks: {validate: C({a:"rowValidate"})}})
//   .rowValidate({a:2},{a:["fieldValidate", "rowValidate"]})

// //below is psuedo code
// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField,
// 			     hooks: {cast: C(1), validate:C("conditional to show that FieldOnValidate was called with 5")}},
// 	    hooks: {onChange:C({a:5}), validate: C({a:"rowValidate"})}})
