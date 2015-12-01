import {handleActions} from 'redux-actions';
import {PONG_RECIEVED} from './actionTypes';
import {IModuleState, ServerMessage} from './model';

const initialState: IModuleState = {
  messages: []
};

const pongRecieved = handleActions({
  [PONG_RECIEVED]: (state, action) => {
    const msg: ServerMessage = action.payload;
    msg.numpp = state.messages.reduce((accum: number, current: ServerMessage) => Math.max(accum, current.numpp + 1), 1);

    return Object.assign({}, state, { messages: [msg, ...state.messages] });
  }
}, initialState);

export default pongRecieved;
