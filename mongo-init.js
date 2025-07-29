/* eslint-disable no-undef */
db.createUser({
  user: 'root',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'pregis',
    },
  ],
});
