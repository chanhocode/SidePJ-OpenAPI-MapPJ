import { all, fork, put, takeLatest, call, delay } from 'redux-saga/effects';
import axios from 'axios';

// LoadPost
// function loadPostAPI(data) {
//   return axios.get(`post/${data}`);
// }

// function* loadPost(action) {
//   try {
//     // const result = yield call(loadPostAPI, action.data);
//     yield delay(1000);
//     yield put({
//       type: LOAD_POST_SUCCESS,
//       data: dummyPost,
//     });
//   } catch (err) {
//     console.error(err);
//     yield put({
//       type: LOAD_POST_FAILURE,
//       error: err.response.data,
//     });
//   }
// }

// Event Listener와 비슷한 역할
// function* watchAddPost() {
//   yield takeLatest(ADD_POST_REQUEST, addPost);
// }

export default function* dataSaga() {
  // yield all([fork(watchLoadPost)]);
}
