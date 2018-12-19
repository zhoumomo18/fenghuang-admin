let {
    cacheClass
} = require('./tool/cacheClass');
let {
    request
} = require('./ajax');
let {
    ajax
} = require('./ajax');


let common = {
    request: request,
    ajax: ajax,
};

export {
    common,
    cacheClass,
};
