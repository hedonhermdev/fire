import { combineReducers } from 'redux';

import content from './content'
import auth from './auth'
import meta from './meta'
import nav from './nav'

export default combineReducers({
    content,
    auth,
    meta,
    nav
});