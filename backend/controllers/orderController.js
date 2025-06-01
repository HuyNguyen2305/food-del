import { log } from "console";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from 'crypto';
import axios from 'axios';

const frontend_url = "http://localhost:5173";

// MoMo configuration
const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

const placeOrder = async (req, res) => {
    try {
        // Save order as usual
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // MoMo payment request (theo mẫu MoMo)
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        const orderInfo = 'pay with MoMo';
        const partnerCode = 'MOMO';
        const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        const requestType = "payWithMethod";
        // Convert USD to VND
        const amount = String(Math.max(1, Math.round(Number(req.body.amount) * 23000)));
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = '';
        const paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        const orderGroupId = '';
        const autoCapture = true;
        const lang = 'vi';

        // Create raw signature
        const rawSignature = "accessKey=" + accessKey +
            "&amount=" + amount +
            "&extraData=" + extraData +
            "&ipnUrl=" + ipnUrl +
            "&orderId=" + orderId +
            "&orderInfo=" + orderInfo +
            "&partnerCode=" + partnerCode +
            "&redirectUrl=" + redirectUrl +
            "&requestId=" + requestId +
            "&requestType=" + requestType;

        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
            paymentCode: paymentCode
        };

        // Send request to MoMo using axios
        let momoResponse;
        try {
            momoResponse = await axios.post(
                "https://test-payment.momo.vn/v2/gateway/api/create",
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (momoError) {
            console.log("MoMo error:", momoError.response ? momoError.response.data : momoError.message);
            return res.json({
                success: false,
                message: "MoMo API error",
                momo: momoError.response ? momoError.response.data : momoError.message
            });
        }

        // Return MoMo payment url
        if (momoResponse.data && momoResponse.data.payUrl) {
            res.json({
                success: true,
                payment_url: momoResponse.data.payUrl
            });
        } else {
            console.log("MoMo response error:", momoResponse.data);
            res.json({
                success: false,
                message: "MoMo payment failed",
                momo: momoResponse.data
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in placing order" });
    }
}

const verifyOrder = async (req, res) =>{
    const {orderId, success} = req.body;
    try {
        if (success == "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            res.json({success:true, message:"Payment successful"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Payment failed"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in verifying order"});
    }
}

// user orders for frontend
const userOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true, data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in fetching orders"});
    }
}

// Listing orders for admin
const listOrders = async(req, res) =>{
    try {
        const orders = await orderModel.find();
        res.json({success:true, data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in fetching orders"});
    }
}

//api for updating order status
const updateStatus = async (req, res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Order status updated"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in updating order status"});
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };