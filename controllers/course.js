const user = require("../models/user");
const course = require("../models/course");
const tags = require("../models/category")
const {imageFileToCloudinary} = require("../utils/imageUploader")



exports.createCourse = async (req, res) => {
    try {
        const {courseName,courseDescriptin, whatYouWillLearn , tag } = req.body;

        if (!courseName || !courseDescriptin || !whatYouWillLearn || !tags) {
            return res.status(500).json({
                success:false,
                message:"all Fields are required"
            })
        }

        const UserId = req.user.id;
        const teacherDetails = await user.findById(UserId)

        if (!teacherDetails) {
            return res.status(500).json({
                success:false,
                message:"Teacher Not found"
            })
        }

        const tagDetails = await tags.findById(tag);
        if (!tagDetails) {
            return res.status(500).json({
                success:false,
                message:"tag Details Not found"
            })
        }

        const newCourse = await course.create({
            courseName:courseName,
            courseDescriptin:courseDescriptin,
            teacher:teacherDetails._id,
            tag:tagDetails._id,
            whatYouWillLearn:whatYouWillLearn
        })

         await user.findByIdAndUpdate({_id:teacherDetails._id},
                                       {
                                        $push:{
                                            course:newCourse._id,
                                        }
                                       },
                                       {new:true}
        )

        return res.status(200).json({
            message:"course created successfully",
            success:true,
            data:newCourse
        })
        // pending..... updation of tag Schema
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"something went wrong while creating course"
        })
    }
}