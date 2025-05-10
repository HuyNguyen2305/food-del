import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from 'crypto';

const frontend_url = "http://localhost:5173";

// MoMo configuration
const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});

        // Create MoMo payment request
        const requestId = newOrder._id.toString();
        const orderId = `${Date.now()}_${requestId}`;
        const orderInfo = "Pay with MoMo";
        const redirectUrl = `${frontend_url}/verify?orderId=${requestId}`;
        const ipnUrl = `${process.env.BACKEND_URL}/api/momo-ipn`;
        const amount = Math.round(req.body.amount * 23000); // Convert USD to VND

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData: "",
            requestType: "captureWallet",
            signature,
            lang: "vi"
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        res.json({
            success: true,
            payment_url: responseData.payUrl
        });

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in placing order"})
    }
}

export { placeOrder };