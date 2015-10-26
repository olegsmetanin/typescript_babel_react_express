import ICommand from './../../framework/server/interfaces/ICommand';
import IInvoke from './../../framework/server/interfaces/IInvoke';

async function invoke<T>(command: ICommand<T>) {
  const className = command.className
      , startTime = Date.now();
  try {
    return await command.execute();
  } finally {
    console.log(`${className}: ${Date.now() - startTime}ms`)
  }
}

export default invoke;
