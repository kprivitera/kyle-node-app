import _ from "lodash";

const convertResultToCamelcase = (object: any): any => {
  if (_.isArray(object)) {
    return object.map(convertResultToCamelcase);
  } else if (_.isDate(object)) {
    return object.toISOString().replace("Z", ""); // convert Date objects to strings in the format '2023-10-28T08:18:19.104476'
  } else if (_.isObject(object)) {
    const newObj: any = _.mapKeys(object, (v, k) => _.camelCase(k));
    _.forEach(newObj, (v, k) => {
      if (_.isObject(v)) {
        newObj[k] = convertResultToCamelcase(v);
      }
    });
    return newObj;
  }
  return object;
};

export default convertResultToCamelcase;
