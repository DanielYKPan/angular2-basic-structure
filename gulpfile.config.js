/**
 * gulpfile.config
 */

(function () {
    'use strict';

  var GulpConfig = (function () {
    function gulpConfig() {

      this.source = './';
      this.sourceApp = this.source + 'app/';

      this.tsOutputPath = this.source + '/dist';
      this.allJavaScript = [this.source + '/dist/**/*.js'];
      this.allTypeScript = this.sourceApp + '/**/*.ts';

      this.scssOutputPath = this.source + '/public/assets/css';
      this.allSass = [this.source + '/sass/**/*.scss', '!'+this.source+'/sass/vendor/**/*.scss'];
      this.mainSass = this.source + '/sass/main.scss';

    }
    return gulpConfig;
  })();
  module.exports = GulpConfig;

})();
