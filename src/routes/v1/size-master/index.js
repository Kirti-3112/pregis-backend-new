const jobsRoute = require('../job.route');

const senseAndDispenseRoutes = [
  {
    path: '/jobs',
    route: jobsRoute,
  },
];

module.exports = senseAndDispenseRoutes;
