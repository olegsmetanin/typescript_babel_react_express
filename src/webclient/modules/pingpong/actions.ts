import {createAction} from 'redux-actions';
import PongEvent from '../../../common/events/PongEvent';
import {PONG_RECIEVED} from './actionTypes';

export const pongRecieved = createAction<{msg: string, recieved: Date}>(PONG_RECIEVED, (e: PongEvent) => e.data);
