import { FieldTester } from './WorkbookTester'
import { NumberField, Message } from '@flatfile/configure'

//const Constant = ({ rv }: { rv: number }) => {
const Constant = (rv:any) => {
  return (...args: any[]) => {
    return rv
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

const parseFinite = (v:any):any => {
  const val = parseInt(v)
  if(isFinite(val)){
    return val
  }
  //throw `${v} is not finite`
  return undefined
}

const BaseField = { type: 'number', label: 'a', required: true }
describe('Field Hook ->', () => {
    test('correctly calls onCast casts object to default number', async () => {
      const ft = new FieldTester(
	{...BaseField, onCast: C(1)})
      // verify that no matter what is passed in, `1` is the result of onCast
	await ft.checkFieldResult('a', 1)
	await ft.checkFieldResult('50', 1)

      const ft2 = new FieldTester(
	{...BaseField, onCast: C("a string")})
      // verify that no matter what is passed in, `1` is the result of onCast
	await ft2.checkFieldResult('a', "a string")
	await ft2.checkFieldResult('50', "a string")
    })

  test('correctly calls onCast casts object to default number', async () => {
      const ft = new FieldTester(
	{...BaseField, required: true, onCast: Null, onValidation: Throw("validation error")})
      // note that onValidation isn't called because the system errored after onEmpty
	//.testAnnotations(undefined, {'required': "missing"})
	await ft.checkFieldResult('b', null);
    })

  test('onValue correctly calls onCast casts object to default number', async () => {
    const ft = new FieldTester(
      {...BaseField, onCast: Null, onEmpty:C(2)})
      await ft.checkFieldResult('c', 2)
      await ft.checkFieldResult('40', 2)
  })

  test("processing stops after cast error and the result of the cell is null ", async () => {
    const ft = new FieldTester(
      {...BaseField, onCast: Throw("castError"), onEmpty:C(2)})
    // onEmpty should never be called becaust onCast through an error
    await ft.matchFieldMessage('z', {level:'error', stage:'onCast', message:'castError'});
    // counterintuitively this is the correct answer, going with z
    // allows the user to edit the value and see the original
    await ft.checkFieldResult('z', 'z');  
  })

  test("test that validation errors show up ", async () => {
    const ft = new FieldTester(
      { ...BaseField, onCast: C(1), onValidate: Throw("called")})
    await ft.checkFieldMessage('10', "called");
  })
/*
  test("show that onValue isn't called after an undefined onCast  ", async () => {
    const ft = new FieldTester(
      { ...BaseField, onCast: U, onValue: C(31)})
    // onValue will never be called in this scenario
    await ft.checkFieldResult('e', undefined)
    await ft.checkFieldResult('60', undefined)
  })
*/

  test("show that onValue isn't called after a null onCast  ", async () => {
    const ft = new FieldTester(
      { ...BaseField, onCast: Null, onValue: C(32)})
    // onValue will never be called in this scenario
    await ft.checkFieldResult('e', null)
    await ft.checkFieldResult('60', null)
  })


// const ft = new FieldTester(
//   {...BaseField, hooks: {onCast: U, onEmpty:C(2), onValue:C(3)}})
//   // onValue will never be called in this scenario
//   .testFullHooks('a', 3)
//   .testFullHooks(20, 3)

// const ft = new FieldTester(
//   {...BaseField, hooks: {onCast: U, onValue:C(3), onValidate:Throw("called")}})
//   // onValidate isn't called for a non existent value
//   .testValidateError('a', null)


  });



// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField, hooks: {onCast: C(1)}},
// 	    hooks: {onChange:C({a:5})}})
//   .rowResult({a:10},{a:5})

// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField, hooks: {onCast: C(1)}},
// 	    hooks: {onValidate: C({a:"rowValidate"})}})
//   .rowValidate({a:2},{a:["rowValidate"]})

// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField,
// 			     hooks: {onCast: C(1), onValidate:C("fieldValidate")}},
// 	    hooks: {onValidate: C({a:"rowValidate"})}})
//   .rowValidate({a:2},{a:["fieldValidate", "rowValidate"]})

// //below is psuedo code
// SchemaTest('a',
// 	   {'fields': 'a':  {...BaseField,
// 			     hooks: {onCast: C(1), onValidate:C("conditional to show that FieldOnValidate was called with 5")}},
// 	    hooks: {onChange:C({a:5}), onValidate: C({a:"rowValidate"})}})

