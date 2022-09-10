import _ from 'lodash';

const convertResultToCamelcase = (object) => {
    return _.mapKeys(object, (v, k) => _.camelCase(k))
};

export default convertResultToCamelcase;
