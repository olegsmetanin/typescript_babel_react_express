import * as React from 'react';

interface OAuthPopupProps extends React.Props<any> {
  type: string;
}

export default class OAuthPopup extends React.Component<OAuthPopupProps, {}> {
  _oauthWindow: any;
  _oauthInterval: any;

  constructor () {
    super();
    this.openPopup = this.openPopup.bind(this);
  }

  /*componentDidMount() {
  }*/

  openPopup() {
    try {
      var that = this;
      that._oauthWindow = window.open('/auth/facebook', 'Login', 'location=0,status=0,width=800,height=400');
      that._oauthInterval = window.setInterval(function(){
          if (that._oauthWindow.closed) {
              window.clearInterval(that._oauthInterval);
              console.log('Logined!');
              //options.callback();
          }
      }, 1000);
    } catch (e) {

    }

  }

  render() {
    //var {type} = this.props;
    return <button onClick={this.openPopup}>{this.props.children}</button>;
  }

}
