//since reduce-reducers does not have d.ts in DefinitelyTyped, add this manually

/// <reference path="../../typings/redux-actions/redux-actions.d.ts"/>

declare module 'reduce-reducers' {

  import {Reducer} from 'redux-actions';

  export default function reduceReducers<T>(...reducers: Reducer<T>[]): Reducer<T>;

}
