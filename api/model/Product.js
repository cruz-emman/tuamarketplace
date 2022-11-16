import  mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    seller_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    title: {type: String, required: true},
    description: {type: String, required: true },
    img: {type: String, required:true},
    status: {
        type: String, default: 'available',
    },
    sold_out: {type: Boolean, default: false},
    category: {type: String, required: true},
    price: {type: String, required:true}

}, {timestamps: true}
)

export default mongoose.model('Product', ProductSchema)