import { all, fork, put, takeLatest, call, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
  CN_DATA_LOAD_REQUEST,
  CN_DATA_LOAD_SUCCESS,
  CN_DATA_LOAD_FAILURE,
} from '../reducers/data';

function cnDataLoadAPI(data) {
  return axios.get(`post/${data}`);
}

function* cnDataLoad(action) {
  try {
    // const result = yield call(loadPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: CN_DATA_LOAD_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CN_DATA_LOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// Event Listener와 비슷한 역할
function* watchCnDataLoad() {
  yield takeLatest(CN_DATA_LOAD_REQUEST, cnDataLoad);
}

export default function* dataSaga() {
  yield all([fork(watchCnDataLoad)]);
}
