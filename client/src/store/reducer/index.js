import { combineReducers } from 'redux';

import nav from './nav'
import content from './content'
import auth from './auth'

export default combineReducers({
    content,
    nav,
    auth
});