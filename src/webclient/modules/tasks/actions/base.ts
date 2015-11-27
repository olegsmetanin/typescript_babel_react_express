import {Action as FSAAction} from 'redux-actions';

//TODO to framework
export abstract class Action<T> {

  type: string;

  defaultState: T;

  constructor(type: string, defaultState: T) {
    this.type = type;
    this.defaultState = defaultState;
  }

  send: (...args) => FSAAction;

  protected _isMyAction(action: FSAAction): boolean {
    return action && action.type === this.type;
  }

  reducer = (state: T, action: FSAAction): T => {
    if (!this._isMyAction(action)) return state || this.defaultState;

    return this._reduce(state || this.defaultState, action);
  };

  protected abstract _reduce(state: T, action: FSAAction): T;
}

export abstract class AsyncAction<T> extends Action<T> {

  asyncActionTypes: string[];

  constructor(type: string, defaultState: T) {
    super(type, defaultState);

    this.asyncActionTypes = [`${type}_BEGIN`, `${type}_SUCCESS`, `${type}_FAILURE`];
  }

  protected _isMyAction(action: FSAAction): boolean {
    return super._isMyAction(action) || (action && this.asyncActionTypes.some(t => t === action.type));
  }

}
