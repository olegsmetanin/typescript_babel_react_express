export default () => {
  return `<!DOCTYPE html>
    <html>
      <body>
        <script>
          if (window.opener) {
              window.opener.focus();

            if(window.opener.loginCallBack) {
              window.opener.loginCallBack();
            }
          }
          window.close();
        </script>
      </body>
    </html>`
}
