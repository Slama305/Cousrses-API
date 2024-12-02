const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const controller = require('../controllers/Controller');

router.route('/')
    .get(controller.getCourses)
    .post([
        body('courseName').isLength({min: 3}),
        body('price').isNumeric()
    ], controller.addCourse);
    
router.route('/:courseId')
    .get(controller.getCourseById)
    .patch([
        body('courseName').isLength({min: 3}),
        body('price').isNumeric()
    ], controller.updateCourse)
    .delete(controller.deleteCourse);
    
module.exports = router;