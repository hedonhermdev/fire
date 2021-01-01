import { combineReducers } from 'redux';

import content from './content'
import auth from './auth'
import meta from './meta'

export default combineReducers({
    content,
    auth,
    meta
});