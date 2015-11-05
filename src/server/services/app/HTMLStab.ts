export default (options) => {
  let {head = '', content = '', cachedump = {}} = options || {};
  var cachedumpJSON = JSON.stringify(cachedump);

  return `<!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"/>
        ${head}

        <link rel="icon" type="image/png" href="/favicon.png" />

        <link href="/assets/css/app.css" rel="stylesheet" media="screen,projection"/>
      </head>
      <body>
        <!--  Scripts-->
        <script src="/assets/js/lib.js"></script>
        <script src="/assets/js/app.js"></script>
        <div id="app">${content}</div>
        <script>
          app({el:document.getElementById('app'), cachedump: ${cachedumpJSON}});
        </script>

      </body>
    </html>`
}
