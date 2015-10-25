import * as React from 'react';
import * as ReactRouter from 'react-router';

interface IAboutHandlerProps {
}

export default class AboutHandler extends React.Component<IAboutHandlerProps, {}> {

static async fillCache(state, cache) {
  console.log('AboutHandler fillCache');
  cache.set('about', 'about');
}

  render() {
    return <div>
      About content
    </div>;
  }

}
