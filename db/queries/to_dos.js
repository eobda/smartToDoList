const db = require('../connection');

// const getToDos = () => {
//   return db.query('SELECT * FROM to_dos;')
//     .then(data => {
//       return data.rows;
//     });
// };

const getToDosByCategory = (categoryId) => {
  const queryString = `SELECT *
  FROM to_dos
  JOIN categories ON categories.id = category_id
  WHERE category_id = $1;`;
  const queryParams = [categoryId];

  return db.query(queryString, queryParams)
    .then(data => {
      return data.rows;
    });
};

module.exports = { getToDosByCategory };
