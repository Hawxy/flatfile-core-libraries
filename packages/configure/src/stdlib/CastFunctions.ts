//import { isValid, parse } from "date-fns";
import { isValid, toDate } from "date-fns";

export const NumberCast = (raw:string|undefined|null|number): number|null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else {
    var num:number = Infinity; // hack to get around typing
    if (typeof raw === 'number') {
      num = raw;
    } else if (typeof raw === 'string') {
      if (raw === '') {
	return null
      }
      // I think I just want the error to propagate here, so no wrapping
      const strippedStr = raw.replace(",","")
      num = Number(strippedStr)
    }
    if (isFinite(num)) {
      return num;
    } else {
      throw new Error(`'${raw}' parsed to '${num}' which is non-finite`);
    }
  }
}

export const BooleanCast = (raw:string|undefined|null|boolean): boolean|null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else {
    if (typeof raw === 'boolean') {
      return raw;
    } else if (typeof raw === 'string') {
      if (raw === '') {
	return null
      }
      const normString = raw.toLowerCase();
      const trueStrings = ['yes', 'true', 'affirmative', '1']
      if (trueStrings.includes(normString)) {
	return true}
      const falseStrings = ['no', 'false', 'negative', '0', '-1']
      if (falseStrings.includes(normString)) {
	return false}
      throw new Error(`'${raw}' can't be converted to boolean`);
    }
    return null;
  }
}

export const StringCast = (raw:string|undefined|null): string|null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else {
    if (typeof raw === 'string') {
      if (raw === '') {
	return null
      }
    }
    return raw
  }
}

export const DateCast = (raw:string|undefined|null| number | Date ): Date|null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else if (raw instanceof Date) {
    return raw;
  }
  else if (typeof raw === 'number') {
    const numParsed =  toDate(raw);
    if (isValid(numParsed)){
      return numParsed;
    }
    else {
      throw new Error(`${raw} parsed to '${numParsed}' which is invalid`);
    }
  }

  else if (typeof raw === 'string') {
    if (raw === '') {
      return null
    }
    const parsedDate  = new Date(raw);
    if (isValid(parsedDate)){
      return parsedDate;
    }
    else {
      throw new Error(`'${raw}' parsed to '${parsedDate}' which is invalid`);
    }
  }
  return null;
}



