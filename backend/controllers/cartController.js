import userModel from "../models/userModel.js";

// Add to cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({ success: true, message: "Item added to cart"});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in adding to cart"});
    }
}

//remove from cart
const removeFromCart = async (req, res) => {
    try{
        let userData = await userModel.findById({ _id: req.body.userId });
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({ success: true, message: "Item removed from cart"});
    } catch (error) {
        console.log(error);
        res.json({ success:false, message: "Error in removing from cart"});
    }
}

//fetch cart items
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById({ _id: req.body.userId });
        let cartData = await userData.cartData;
        res.json({ success: true, cartData});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in fetching cart items"});
    }
}

export { addToCart, removeFromCart, getCart };