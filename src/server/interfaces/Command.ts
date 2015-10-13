/// <reference path="../../../typings/node/node.d.ts" />

// abstract class Command<T> {
//
//   abstract internalExecute():T
//
//   execute(): T {
//     var startTime = global.process.hrtime();
//     var value = this.internalExecute();
//     var diff = global.process.hrtime(startTime);
//     console.log((diff[0] * 1000) + (diff[1] / 1000000) + 'ms')
//     return value;
//   }
//
// }
//
// export default Command;
