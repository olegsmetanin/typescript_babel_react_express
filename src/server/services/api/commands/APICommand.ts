// !/ <reference path="../../../../../../typings/es6-promise/es6-promise.d.ts" />

import Command from './../../../interfaces/Command'

export default class APICommand extends Command<Promise<string>> {

  internalExecute() {
    return new Promise<string>(resolve => setTimeout(() => resolve('qwe'), 1000))
  }

}
