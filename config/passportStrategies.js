const { Strategy: JwtStrategy } = require("passport-jwt");

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: (request) => request.cookies.jwt,
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  },
  (payload, done) => {
    done(null, payload.sub);
  }
);

module.exports = {jwtStrategy}