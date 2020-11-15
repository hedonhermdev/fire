// import * as loader from '../actionCreator/loader';
// import * as message from '../actionCreator/message';
import store from '../store';
const dispatch = store.dispatch;

const handleResponse = (error, response, body, cb) => {
  // dispatch(loader.hideLoader());
  if (error || !response) {
    // dispatch(message.updateMessage(error.message));
    alert(error.message);
  } else if (response.statusCode === 200) {
    try {
      cb();
    } catch (e) {
      // dispatch(message.updateMessage('UNKNOWN ERROR: Contact administrator'));
      alert('UNKNOWN ERROR: Contact administrator');
      console.log(e);
    }
  } else if (response.statusCode === 401) {
      dispatch({ type: 'LOGOUT_USER' });
  } else {
      body = JSON.parse(body)
      // dispatch(message.updateMessage(body.detail));
      alert(body.detail);
  }
}

export default handleResponse;