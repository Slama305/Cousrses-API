const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const controller = require('../controllers/userCourses');
const controllerUser = require('../controllers/userController');

router.route('/')
    .post([
        body('course_id').isNumeric().withMessage('Course ID must be a number'),
        body('user_id').isNumeric().withMessage('User ID must be a number')
    ], controller.bookCourse)
    .delete(controller.deleteBook);
 
router.route('/:userId')
    .get(controllerUser.getUserCourses);

module.exports = router;
