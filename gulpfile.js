const gulp = require('gulp');

const sonarqubeScanner = require('sonarqube-scanner');

const sonarProjectName = 'pregis_backend';

gulp.task('sonar', async (callback) => {
  sonarqubeScanner(
    {
      serverUrl: 'http://localhost:9000',
      options: {
        'sonar.projectKey': sonarProjectName,
        'sonar.projectName': sonarProjectName,
        // 'sonar.login': 'admin',
        // 'sonar.password': 'pregis@123',
        'sonar.token': 'sqp_d838842b3435d2e1a9849e4335fb48d866dc7deb',
        'sonar.language': 'js',
        'sonar.sourceEncoding': 'UTF-8',
        'sonar.sources': 'src/',
        'sonar.tests': 'tests/',
        'sonar.tests.inclusions': 'tests/',
        'sonar.exclusions':
          'node_modules/**, src/config/**,src/docs/**,src/middlewares/**,src/routes/**,src/utils/ApiError.js,src/utils/catchAsync.js,src/validations/**,src/models/**,src/app.js, src/index.js',
        'sonar.javascript.jstest.reportsPath': 'coverage',
        'sonar.javascript.coveragePlugin': 'lcov',
        'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
        'sonar.scm.disabled': 'true',
      },
    },
    callback
  );
});
