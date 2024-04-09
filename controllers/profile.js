const profile = require("../models/profile");
const user = require("../models/user");

exports.updateProfile = async (req ,res) => {
    try {
        const {dateOfBirth ="", about="" ,gender} = req.body;

        const id = req.user.id;

        if (!gender || !id) {
            return res.status(500).json({
                success:false,
                message:"fields are required"
            })
        }

        const userDetails = await user.findById(id)
        const profileId = userDetails.profile;
        const profileDetails = await profile.findById(profileId)

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"profile updated successfully"
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"something went wrong while updating profile details"
        })
    }
}




exports.deleteAccount = async (req , res) => {
    try {
        
    } catch (error) {
        
    }
}



exports.showAllUserDetails = async (req , res) => {
    try {
         const id = req.user.id

         const userdetails = await user.findById(id).populate("profile").exec();

         return res.status(200).json({
            success:true,
            message: "all Details Fetched Successfully"
         })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}