const getUserRawData = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
];

const getUserData = {
  users: [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' },
  ],
  rowsPerPage: 1,
  totalPages: 2,
  currentPage: 1,
};
module.exports = {
  getUserData,
  getUserRawData,
};
