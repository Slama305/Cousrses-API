const pg = require('../data/CoursesDB');
const { validationResult } = require('express-validator');


const getCourses = async (req , res) => {
    try {
        const courses = await pg.query('SELECT * FROM courses');
        res.json(courses.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("server erorr");
    }
};


const getCourseById = async (req, res) => {
    try {
        const {id} = req.params;
        const course = await pg.query('SELECT * FROM courses WHERE id = $1', [id]);
        if(course.rows.length===0){
            return res.status(404).send('Course not found');
        }
        res.json(course.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("server erorr");
    }
}

const addCourse = async (req ,res)=>{
    const errors = validationResult(req);
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const {courseName, price} = req.body;
    try {
        const newCourse = await pg.query(
            'INSERT INTO courses (courseName , price) VALUES ($1, $2)',
            [courseName, price]
        ); 
    }catch (err){
        console.error(err.message);
        res.status(500).send("server error");
    }
}

const updateCourse = async (req , res)=>{
    const {courseID} = req.params;
    const errors = validationResult(req);
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const {courseName, price} = req.body;
    try {
        const newCourse= await pg.query(
            'UPDATE courses SET courseName = $1 , price = $2 WHERE id = $3',
            [courseName, price, courseID]
        );
        if(newCourse.rowCount===0){
            return res.status(404).send('Course not found');
        }
        res.json(newCourse.rows[0]);
    }catch(err){
        console.error(err.message);
        res.status(500).send("server error");
    }
};

const deleteCourse = async (req , res)=>{
    const {courseID} = req.params;
    try {
        const course = await pg.query(
            'DELETE FROM courses WHERE id = $1',
            [courseID]
        );
        if(course.rowCount===0){
            return res.status(404).send('Course not found');
        }
        res.json({message: 'Course deleted'});
    }catch(err){
        console.error(err.message);
        res.status(500).send("server error");
    }
};

module.exports = {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
}