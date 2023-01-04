import produce from '../utils/produce';
export const initialState = {
  me: null,
  asan: [],
  cheonan: [],
  yesan: [],
  gongju: [],
  gyeryong: [],
  geumsan: [],
  nonsan: [],
  buyeo: [],
  dangjin: [],
  seosan: [],
  taean: [],
  hongseong: [],
  cheongyang: [],
  boryeong: [],
  seocheon: [],
  joinLoading: false,
  joinDone: false,
  joinError: null,
};

export const JOIN_REQUEST = 'JOIN_REQUEST';
export const JOIN_SUCCESS = 'JOIN_SUCCESS';
export const JOIN_FAILURE = 'JOIN_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case JOIN_REQUEST:
        draft.logInLoading = true;
        draft.logInDone = false;
        draft.logInError = null;
        break;
      case JOIN_SUCCESS:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.me = action.data;
        break;
      case JOIN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      default:
        break;
    }
  });
};
export default reducer;
