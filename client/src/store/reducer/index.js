import { combineReducers } from 'redux';

import content from './content';
import auth from './auth';
import dialogBox from './dialogBox';
import nav from './nav'

export default combineReducers({
    content,
    auth,
    dialogBox,
    nav
});