import * as React from 'react';

interface INotFoundHandlerProps {
}

export default class NotFoundHandler extends React.Component<INotFoundHandlerProps, {}> {

  //Used is server side rendering, for 404 status code
  static isNotFound = true;

  render() {
    return <div>
      404 Not Found
    </div>;
  }

}
