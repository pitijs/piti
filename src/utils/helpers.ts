import isPromise from "is-promise";
import isPlainObject from "lodash.isplainobject";

export const extractDefaultModule = (module: any): any => {
  // if (isPromise(module)) module = await module;
  if (isPlainObject(module) && module.default) module = module.default;
  return module;
};
