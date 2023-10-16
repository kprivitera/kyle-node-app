import _ from "lodash";

const convertResultToCamelcaseArray = (array: any) =>
  _.map(array, function (obj) {
    return _.mapKeys(obj, function (value, key) {
      return _.camelCase(key);
    });
  });

export default convertResultToCamelcaseArray;
