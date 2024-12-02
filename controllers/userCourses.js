const pg = require('../data/CoursesDB');
const { validationResult } = require('express-validator');


const bookCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { course_id, user_id } = req.body;  
    try {
        const checkCourse = await pg.query('SELECT * FROM UserCourses WHERE course_id = $1 AND user_id = $2', [course_id, user_id]);
        if (checkCourse.rowCount > 0) {
            return res.status(400).json({ message: 'Course already booked for this user' });
        }

        const result = await pg.query(
            `INSERT INTO UserCourses (course_id , user_id) VALUES ($1, $2) RETURNING *`,
            [course_id, user_id]
        );

        res.status(201).json({
            message: 'Course booked successfully',
            booking: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const deleteBook = async (req, res) => {
    const { course_id, user_id } = req.body;
    try {
        const result = await pg.query(
            `DELETE FROM UserCourses WHERE course_id = $1 AND user_id = $2 RETURNING *`,
            [course_id, user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No booking found to delete' });
        }

        res.json({
            message: 'Booking deleted successfully',
            deletedBooking: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    bookCourse,
    deleteBook
};
