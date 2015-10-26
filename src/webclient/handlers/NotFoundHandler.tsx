import * as React from 'react';
import * as ReactRouter from 'react-router';

interface INotFoundHandlerProps {
}

export default class NotFoundHandler extends React.Component<INotFoundHandlerProps, {}> {

  render() {
    return <div>
      404 Not Found
    </div>;
  }

}
