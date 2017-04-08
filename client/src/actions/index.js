import * as types from '../constants/actionTypes';

// Dispatch actions in batch to avoid update component too frequently.
// Idea and code from https://github.com/tshelburne/redux-batched-actions
// https://github.com/reactjs/redux/issues/911#issuecomment-149361073
export function batchActions(actions) {
    return {type: types.BATCH, payload: actions};
}
