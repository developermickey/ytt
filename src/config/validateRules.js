import { extend } from 'vee-validate';

export default () => {

    extend('isTrue', {
        validate: value => value === true,
        message: '{field} is required'
    });
};