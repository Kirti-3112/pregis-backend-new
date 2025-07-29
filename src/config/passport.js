const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById({ _id: payload.sub })
      .populate({
        path: 'roles',
        populate: {
          path: 'policies',
        },
      })
      .populate('policies');
    if (!user) {
      return done(null, false);
    }

    const rolePolicies =
      user && user.roles && user.roles.policies.length > 0
        ? user.roles.policies.map((policy) => policy.policyName)
        : [];
    const userPolicies =
      user && user.policies.length > 0
        ? user.policies.map((policy) => policy.policyName)
        : [];

    const authorizeAccess = [...new Set([...rolePolicies, ...userPolicies])];

    user.authorizeAccess = authorizeAccess;

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
