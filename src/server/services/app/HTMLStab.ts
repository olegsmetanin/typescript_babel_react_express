export default (options) => {
  const {head = '', content = '', cachedump = {}, state = {}} = options || {};
  const cachedumpJSON = JSON.stringify(cachedump);
  const stateJSON = JSON.stringify(state);

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"/>
        ${head}

        <link rel="icon" type="image/png" href="/favicon.png" />

        <link href="/static/css/app.css" rel="stylesheet" media="screen,projection"/>
      </head>
      <body>
        <!--  Scripts-->
        <script src="/static/js/lib.js"></script>
        <script src="/static/js/main.js"></script>
        <div id="app">${content}</div>
        <script>
          app({el:document.getElementById('app'), cachedump: ${cachedumpJSON}, state: ${stateJSON}});
        </script>

      </body>
    </html>`
}
