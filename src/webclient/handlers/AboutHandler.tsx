import * as React from 'react';
var ReactRouter = require('react-router');

interface IAboutHandlerProps {
}

export default class AboutHandler extends React.Component<IAboutHandlerProps, {}> {

static async fillCache(cache) {
  cache.set('about', 'about');
}

  render() {
    return <div>
      About content
    </div>;
  }

}
