const pg = require('../data/CoursesDB');
const { validationResult } = require('express-validator');

const getUsers = async (req, res) => {
  try {
    const users = await pg.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pg.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!user.rows[0]) {
      return res.status(404).send('User not found');
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const newUser = await pg.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const updatedUser = await pg.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [username, email, password, id]
    );
    if (updatedUser.rowCount === 0) {
      return res.status(404).send('User not found');
    }
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteUser = async (req, res) => {
  const { id} = req.params;
  try {
    const deletedUser = await pg.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (deletedUser.rowCount === 0) {
      return res.status(404).send('User not found');
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// const bookCourses =async (req, res) => {
//     const { userId, courseId } = req.params;
//     try {
//       const bookedCourse = await pg.query(
//         'INSERT INTO UserCourses (user_id, course_id) VALUES ($1, $2) RETURNING *',
//         [userId, courseId]
//       );
//       res.json(bookedCourse.rows[0]);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   };
const getUserCourses = async (req, res) => {
    const { userId } = req.params;
    try {
        const userCourses = await pg.query(
            `
            SELECT courses.coursename, courses.price 
            FROM courses
            INNER JOIN UserCourses ON courses.id = UserCourses.course_id
            WHERE UserCourses.user_id = $1
            `,
            [userId]
        );
        res.json(userCourses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserCourses,
  
};
