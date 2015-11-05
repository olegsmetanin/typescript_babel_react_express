import ICommand from '../../common/command/ICommand';
import IInvoke from '../../common/invoke/IInvoke';

async function invoke<T>(command: ICommand<T>) {
  const className = command.className
      , startTime = Date.now();
  try {
    return await command.execute();
  } catch (e) {
    console.log('(invoke) ', e)
  } finally {
    console.log(`${className}: ${Date.now() - startTime}ms`)
  }
}

export default invoke;
