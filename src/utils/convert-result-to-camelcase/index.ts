import _ from 'lodash';

const convertResultToCamelcase = (object: Record<string, any>) => {
    return _.mapKeys(object, (v, k) => _.camelCase(k))
};

export default convertResultToCamelcase;
