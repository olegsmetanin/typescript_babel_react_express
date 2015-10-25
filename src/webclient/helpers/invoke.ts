import ICommand from './../../framework/server/interfaces/ICommand';
import IInvoke from './../../framework/server/interfaces/IInvoke';

async function invoke<T>(command: ICommand<T>) {
  var className = command.className;
  var startTime = (new Date()).getTime();
  var value = await command.execute();
  var diff = (new Date()).getTime() - startTime;
  console.log(className + ': ' +diff + 'ms')
  return value;
}

export default invoke;
