import { combineReducers } from 'redux';

import content from './content';
import auth from './auth';
import dialogBox from './dialogBox';

export default combineReducers({
    content,
    auth,
    dialogBox
});