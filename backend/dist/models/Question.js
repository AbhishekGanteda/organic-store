import mongoose from 'mongoose';
const questionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
export default mongoose.model('Question', questionSchema);
//# sourceMappingURL=Question.js.map