const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const controller = require('../controllers/userController');

router.route('/')
    .get(controller.getUsers)
    .post([
        body('username').isLength({min: 3}),
        body('email').isEmail(),
        body('password').isLength({min: 8})
    ], controller.createUser);
    
router.route('/:id')
    .get(controller.getUserById)
    .patch([
        body('username').isLength({min: 3}),
        body('email').isEmail()
    ], controller.updateUser)
    .delete(controller.deleteUser);
    // .get(controller.getUserCourses);

    
module.exports = router;
