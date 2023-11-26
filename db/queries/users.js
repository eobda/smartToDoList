const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then((data) => {
      return data.rows;
    });
};

// Get user by specific ID
const getUserById = (userId) => {
  const queryString = `SELECT *
  FROM users
  WHERE id = $1;`;
  const queryParams = [userId];

  return db.query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Get user by email
const getUserByEmail = (email) => {
  const queryString = `SELECT *
  FROM users
  WHERE email = $1;`;
  const queryParams = [email];

  return db.query(queryString, queryParams)
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Add user
const addUser = (user) => {
  const queryString = `INSERT INTO users (name, email, avatar_url, password)
  VALUES ('newuser', $1, NULL, $2)
  RETURNING id;`;
  const queryParams = (user.email, user.password);

  return db.query(queryString, queryParams)
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser
};
