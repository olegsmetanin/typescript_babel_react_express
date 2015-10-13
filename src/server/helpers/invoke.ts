import ICommand from './../../framework/server/interfaces/ICommand';

export default function invoke<T>(command: ICommand<T>) {

  var startTime = global.process.hrtime();
  var value = command.execute();
  var diff = global.process.hrtime(startTime);
  console.log((diff[0] * 1000) + (diff[1] / 1000000) + 'ms')
  return value;

}
