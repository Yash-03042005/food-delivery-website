import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food items

const addFood = async (req, res) => {
    try {

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        // Extract request body
        const { name, description, price, category } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Store image filename
        const image_filename = req.file.filename;

        // Create new food item
        const food = new foodModel({
            name,
            description,
            price,
            category,
            image: image_filename
        });

        // Save to database
        await food.save();

        // Send success response
        res.status(201).json({ success: true, message: "Food Added Successfully" });
    } catch (err) {
        console.error("Error adding food:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//all food list

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({ success: true, data: foods });
    } catch (err) {
        console.error("Error fetching food items:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//remove food item

const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Remove the image file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error("Error deleting image file:", err);
            }
        });

        await foodModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Food Item Removed Successfully" });

    } catch (err) {
        console.error("Error removing food item:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// ================== Update Food ==================
const updateFood = async (req, res) => {
    try {
        const { id } = req.params; // food ID from URL
        const { name, description, price, category } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Build update object
        const updateData = {
            name,
            description,
            price,
            category,
        };

        // If a new image is uploaded, update it
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedFood) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        res.status(200).json({ success: true, message: "Food Updated Successfully", data: updatedFood });
    } catch (err) {
        console.error("Error updating food:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};






export {addFood,listFood,removeFood, updateFood}