import ICommand from '../../common/command/ICommand';

export default async function invoke<T>(command: ICommand<T>) {

  var className = command.className;
  var startTime = global.process.hrtime();
  var value = await command.execute();
  var diff = global.process.hrtime(startTime);
  console.log(className + ': ' +((diff[0] * 1000) + (diff[1] / 1000000)) + 'ms')
  return value;

}
