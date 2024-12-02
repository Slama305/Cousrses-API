const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const controller = require('../controllers/Controller');

router.route('/')
    .get(controller.getCourses)
    .post([
        body('courseName').isLength({ min: 3 }).withMessage('Course name must be at least 3 characters long'),
        body('price').isNumeric().withMessage('Price must be a number')
    ], controller.addCourse);


router.route('/:courseId')
    .get([param('courseId').isNumeric().withMessage('Course ID must be a number')], controller.getCourseById)
    .patch([
        param('courseId').isNumeric().withMessage('Course ID must be a number'),
        body('courseName').isLength({ min: 3 }).withMessage('Course name must be at least 3 characters long'),
        body('price').isNumeric().withMessage('Price must be a number')
    ], controller.updateCourse)
    .delete([param('courseId').isNumeric().withMessage('Course ID must be a number')], controller.deleteCourse);

module.exports = router;
