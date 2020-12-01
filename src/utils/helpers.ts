import isPlainObject from "lodash.isplainobject";

export const createClass = (constructor: Function, args: any[]) => {
  const newObject = Object.create(constructor.prototype);
  const result = constructor.apply(newObject, args);
  return isPlainObject(result) ? result : newObject;
}
