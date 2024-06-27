const category = require("../models/category");


exports.createCategory = async (req,res)=>{
    try {
        const {name , description} = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message:"please fill all the details of TAG"
            })
        }
        const categoryDetails = await category.create({
            name:name,
            description:description,
        })

        console.log(categoryDetails)

        return res.status(200).json({
            success:true,
            message:"category created successfully"
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


exports.showAllCategory = async(req, res) => {
    try {
        const getAllCategory = await category.find({},{name:true , description:true});
        console.log("alltags :-", getAllCategory)
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}