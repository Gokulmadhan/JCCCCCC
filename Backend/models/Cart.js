const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: String,
            ref: 'Product',
            required: true
        },
        size: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
})
const Cart = mongoose.model('Cart', cartSchema);
module.exports=Cart;