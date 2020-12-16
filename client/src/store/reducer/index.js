import { combineReducers } from 'redux';

import nav from './nav'
import content from './content'

export default combineReducers({
    content,
    nav
});