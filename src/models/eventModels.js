import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            minLength: 3,
        },

        description: {
            type: String,
            trim: true,
            required: true,
        },

        category: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
        },

        date: {
            type: Date,
            required: true,
        },

        location: {
            type: String,
            trim: true,
            required: true,
        },

        capacity: {
            type: Number,
            required: true,
            min: [0, "Capacity should be greater or greater than 0"],
            validate: {
                validator: Number.isInteger,
                message: "Capacity is an integer number",
            },
        },

        price: {
            type: Number,
            required: true,
            min: [0, "Price should be greater or equal than 0"],
        },

        status: {
            type: String,
            required: true,
            enum: ["draft", "published", "closed", "cancelled"],
            default: "draft",
        },

        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const eventModel = mongoose.model("events", eventSchema);
