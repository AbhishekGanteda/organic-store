import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
export default mongoose.model('Category', categorySchema);
//# sourceMappingURL=Category.js.map