const express = require("express");
const router = express.Router();

const {sendOTP , signup , login , changePassword} = require("../controllers/Auth");
const {createCategory, showAllCategory } = require("../controllers/Category");
const {createCourse} = require("../controllers/course");
const {updateProfile , deleteAccount , showAllUserDetails } = require("../controllers/profile")
const {resetPasswordtoken, resetPassword} = require("../controllers/resetpassword");
const {createSection , updateSection ,deleteSection} = require("../controllers/Section")
const {createSubSection} = require("../controllers/subSection")
const {auth , isAdmin , isStudent , isTeacher} = require("../middlewares/authMiddleware")

router.post('/signup',signup);
router.post('/login',auth , login);
router.post('/changePassword', changePassword);
router.get('/getOTP',sendOTP);

router.post('/createCategory',createCategory);
router.post('/showAllCategory',showAllCategory);

router.post('/creatingCourse', createCourse);

router.put('/updateProfile', updateProfile);
router.post('/showAllUserDetails', showAllUserDetails);

router.get('/resetPasswordtoken',resetPasswordtoken);
router.post('/resetPassword',resetPassword);

router.post('/createSection', createSection);
router.put('/updateSection', updateSection);
router.delete('/deleteSection',deleteSection)

router.post('/createSubSection',createSubSection)


module.exports = router

