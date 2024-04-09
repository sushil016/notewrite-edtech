const section = require("../models/section");
const subSection = require("../models/subSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req,res)=>{
    try {
        const {sectionId , title , description, timeDuration, videoUrl} = req.body;

        const file = req.files.videoUrl

        if (!sectionId || !title || !description || !timeDuration || !file) {
            return res.status(500).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        const videoDetails = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);

        const subSectionDetails = await subSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl:videoDetails.secure_url
        })

        const sectionUpdated = await section.findByIdAndUpdate({_id:sectionId},
                                                                {
                                                                    $push:{
                                                                        subsection:subSectionDetails._id
                                                                    }
                                                                },
                                                                {new:true});

    } catch (error) {
        
    }
}