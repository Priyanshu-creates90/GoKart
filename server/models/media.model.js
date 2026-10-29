import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        default: ""
    },
    mimeType: {
        type: String,
        default: "image/png"
    },
    size: {
        type: Number,
        default: 0
    },
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default MediaModel;

