const pg = require('../data/CoursesDB');
const { validationResult } = require('express-validator');

const getCourses = async (req, res) => {
    try {
        const courses = await pg.query('SELECT * FROM courses');
        res.json(courses.rows);
    }
    catch (err) {
        console.error("Error in getCourses:", err.message);
        res.status(500).send("Server error");
    }
};

const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await pg.query('SELECT * FROM courses WHERE id = $1', [courseId]);
        if (course.rowCount === 0) {
            return res.status(404).send('Course not found');
        }
        res.json(course.rows[0]);
    } catch (err) {
        console.error("Error in getCourseById:", err.message);
        res.status(500).send("Server error");
    }
};

const addCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());  
    }
    const { courseName, price } = req.body;
    try {
        const newCourse = await pg.query(
            'INSERT INTO courses (courseName, price) VALUES ($1, $2) RETURNING *',
            [courseName, price]
        );
        res.status(201).json(newCourse.rows[0]);  
    } catch (err) {
        console.error("Error in addCourse:", err.message);
        res.status(500).send("Server error");
    }
};

const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());  
    }
    const { courseName, price } = req.body;
    try {
        const updatedCourse = await pg.query(
            'UPDATE courses SET courseName = $1, price = $2 WHERE id = $3 RETURNING *',
            [courseName, price, courseId]
        );
        if (updatedCourse.rowCount === 0) {
            return res.status(404).send('Course not found');
        }
        res.json(updatedCourse.rows[0]);  
    } catch (err) {
        console.error("Error in updateCourse:", err.message);
        res.status(500).send("Server error");
    }
};

const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await pg.query(
            'DELETE FROM courses WHERE id = $1',
            [courseId]
        );
        if (course.rowCount === 0) {
            return res.status(404).send('Course not found');
        }
        res.json({ message: 'Course deleted' });
    } catch (err) {
        console.error("Error in deleteCourse:", err.message);
        res.status(500).send("Server error");
    }
};

module.exports = {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
};
