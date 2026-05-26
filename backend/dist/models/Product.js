import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: '',
    },
    isSale: {
        type: Boolean,
        default: false,
    },
    tags: [String],
    isTrending: {
        type: Boolean,
        default: false,
    },
    isBestSeller: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
export default mongoose.model('Product', productSchema);
//# sourceMappingURL=Product.js.map