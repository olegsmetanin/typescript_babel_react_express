import ICommand from './../../framework/server/interfaces/ICommand';

export default async function invoke<T>(command: ICommand<T>) {

  var name = command.name();
  var startTime = global.process.hrtime();
  var value = await command.execute();
  var diff = global.process.hrtime(startTime);
  console.log(name + ': ' +((diff[0] * 1000) + (diff[1] / 1000000)) + 'ms')
  return value;

}
