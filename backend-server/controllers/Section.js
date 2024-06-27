const section = require("../models/section");
const course = require("../models/course");

exports.createSection = async (req , res) =>{
    try {
        const {sectionName, courseId} = req.body;

        if (!sectionName||!courseId) {
            return res.status(500).json({
                message:"missing props",
                success:false
            })
        }

        const newSection = await section.create({sectionName});

        const courseUpdated = await course.findByAndUpdate(courseId,
                                                            {
                                                                $push:{
                                                                    courseContent:newSection._id
                                                                }
                                                            },
                                                            {new:true});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"something went wrong while creating section"
        })
    }
}



exports.updateSection = async (req, res) =>{
    try {
        const {sectionName, sectionId} = req.body;

        if (!sectionName || !sectionId) {
            return res.status(500).json({
                success:false,
                message:"missing props"
            })
        }

        await section.findByAndUpdate(sectionId , {sectionName}, {new:true});

        return res.status(200).json({
            success:true,
            message:"section Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"something went wrong while updating section"
        })
    }
}




exports.deleteSection = async (req,res)=>{
    try {
        const sectionId = req.params;

        await section.findByIdAndDelete(sectionId, )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"something went wrong while deleting section"
        })
    }
}