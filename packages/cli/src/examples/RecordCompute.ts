import {
  Sheet,
  Workbook,
  TextField,
  BooleanField,
  NumberField,
  OptionField,
  DateField,
  Message,
} from '@flatfile/configure'

const Employees = new Sheet(
  'ValidateSalaryEmployees..',
  {
    firstName: TextField({
      required: true,
      description: 'Given name',
    }),
    lastName: TextField({}),
    fullName: TextField({}),
    stillEmployed: BooleanField(),
    department: OptionField({
      label: 'Department',
      options: {
        engineering: 'Engineering',
        hr: 'People Ops',
        sales: 'Revenue',
      },
    }),
    startDate: DateField('Start Date'),
    salary: NumberField({
      label: 'Salary',
      description: 'Annual Salary in USD',
      required: true,
      validate: (salary: number) => {
        const minSalary = 30_000
        if (salary < minSalary) {
          return [
            new Message(
              `${salary} is less than minimum wage ${minSalary}`,
              'warn',
              'validate'
            ),
          ]
        }
      },
    }),
  },
  {
    allowCustomFields: true,
    readOnly: true,
    recordCompute: (record) => {
      const fullName = `${record.get('firstName')} ${record.get('lastName')}`
      record.set('fullName', fullName)
      return record
    },
  }
)

export default new Workbook({
  name: 'README workbook2 ',
  namespace: 'onboarding',
  sheets: {
    Employees,
  },
})
