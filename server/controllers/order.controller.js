import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId; // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        if (!list_items || !list_items.length) {
            return response.status(400).json({
                message: "Cart is empty",
                error: true,
                success: false
            });
        }

        const payload = list_items.map(el => {
            const pId = el.productId?._id || el.productId;
            return {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: pId,
                product_details: {
                    name: el.productId?.name || "Product",
                    image: el.productId?.image || []
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                delivery_address: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt,
            };
        });

        const generatedOrder = await OrderModel.insertMany(payload);

        // Decrement product stock for each ordered item
        for (const el of list_items) {
            const pId = el.productId?._id || el.productId;
            const qty = Number(el.quantity) || 1;
            if (pId) {
                await ProductModel.updateOne(
                    { _id: pId },
                    { $inc: { stock: -qty } }
                );
            }
        }

        // Remove from cart
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        return response.json({
            message: "Order placed successfully",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export const pricewithDiscount = (price, dis = 0) => {
    const discountAmount = Math.ceil((Number(price || 0) * Number(dis || 0)) / 100);
    const actualPrice = Number(price || 0) - Number(discountAmount);
    return Math.max(1, actualPrice);
};

export async function paymentController(request, response) {
    try {
        const userId = request.userId; // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
            return response.status(400).json({
                message: "Stripe payments are not configured on the server. Please provide a valid STRIPE_SECRET_KEY.",
                error: true,
                success: false
            });
        }

        if (!list_items || !list_items.length) {
            return response.status(400).json({
                message: "No items in cart to checkout",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId);

        const line_items = list_items.map(item => {
            const p = item.productId || {};
            const rawImages = p.image || [];
            const validImages = (Array.isArray(rawImages) ? rawImages : [rawImages])
                .filter(img => typeof img === 'string' && img.startsWith('http'));

            const productData = {
                name: p.name || "Product",
                metadata: {
                    productId: String(p._id || "")
                }
            };

            if (validImages.length > 0) {
                productData.images = validImages.slice(0, 8);
            }

            const unitAmount = Math.max(100, Math.round(pricewithDiscount(p.price, p.discount) * 100));

            return {
                price_data: {
                    currency: 'inr',
                    product_data: productData,
                    unit_amount: unitAmount
                },
                adjustable_quantity: {
                    enabled: false
                },
                quantity: Number(item.quantity) || 1
            };
        });

        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user?.email,
            metadata: {
                userId: String(userId),
                addressId: String(addressId || ""),
                subTotalAmt: String(subTotalAmt || 0),
                totalAmt: String(totalAmt || 0),
            },
            line_items: line_items,
            success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/cancel`
        };

        const session = await Stripe.checkout.sessions.create(params);

        return response.status(200).json({
            success: true,
            error: false,
            id: session.id,
            url: session.url
        });

    } catch (error) {
        console.error("Stripe payment error:", error.message);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyPaymentController(request, response) {
    try {
        const userId = request.userId;
        const { sessionId } = request.body;

        if (!sessionId) {
            return response.status(400).json({
                message: "Stripe session ID is required",
                error: true,
                success: false
            });
        }

        const session = await Stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return response.status(404).json({
                message: "Stripe session not found",
                error: true,
                success: false
            });
        }

        if (session.payment_status === "paid") {
            const paymentIdentifier = session.payment_intent || session.id;

            // Idempotent check: if orders already created for this payment ID, return success immediately
            const existingOrder = await OrderModel.findOne({ paymentId: paymentIdentifier });

            if (!existingOrder) {
                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
                const addressId = session.metadata?.addressId;

                const orderProducts = [];
                for (const item of (lineItems?.data || [])) {
                    let productName = item.description || "Product";
                    let productImage = [];
                    let productId = null;

                    if (item.price?.product) {
                        try {
                            const prod = await Stripe.products.retrieve(item.price.product);
                            productName = prod.name;
                            productImage = prod.images || [];
                            productId = prod.metadata?.productId;
                        } catch (err) {
                            console.error("Error retrieving Stripe product:", err.message);
                        }
                    }

                    const payload = {
                        userId: userId,
                        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                        productId: productId,
                        product_details: {
                            name: productName,
                            image: productImage
                        },
                        paymentId: paymentIdentifier,
                        payment_status: "PAID",
                        delivery_address: addressId,
                        subTotalAmt: Number(item.amount_total / 100),
                        totalAmt: Number(item.amount_total / 100),
                    };
                    orderProducts.push(payload);

                    // Decrement stock
                    if (productId) {
                        const qty = Number(item.quantity) || 1;
                        await ProductModel.updateOne(
                            { _id: productId },
                            { $inc: { stock: -qty } }
                        );
                    }
                }

                if (orderProducts.length > 0) {
                    await OrderModel.insertMany(orderProducts);
                }

                // Clear user cart
                await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                await CartProductModel.deleteMany({ userId: userId });
            }

            return response.json({
                message: "Payment verified and order confirmed",
                success: true,
                error: false
            });
        } else {
            return response.status(400).json({
                message: "Payment is pending or not completed",
                error: true,
                success: false
            });
        }
    } catch (error) {
        console.error("Verify payment error:", error.message);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            let productName = item.description || "Product";
            let productImages = [];
            let productId = null;

            if (item.price?.product) {
                try {
                    const product = await Stripe.products.retrieve(item.price.product);
                    productName = product.name;
                    productImages = product.images || [];
                    productId = product.metadata?.productId;
                } catch (err) {
                    console.error("Error retrieving product:", err.message);
                }
            }

            const payload = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: productId,
                product_details: {
                    name: productName,
                    image: productImages
                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            };

            productList.push(payload);

            if (productId) {
                const qty = Number(item.quantity) || 1;
                await ProductModel.updateOne(
                    { _id: productId },
                    { $inc: { stock: -qty } }
                );
            }
        }
    }

    return productList;
};

// http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
    const event = request.body;
    console.log("Stripe webhook event:", event?.type);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const paymentId = session.payment_intent || session.id;

                const existingOrder = await OrderModel.findOne({ paymentId });
                if (!existingOrder) {
                    const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
                    const userId = session.metadata?.userId;
                    const orderProduct = await getOrderProductItems({
                        lineItems: lineItems,
                        userId: userId,
                        addressId: session.metadata?.addressId,
                        paymentId: paymentId,
                        payment_status: session.payment_status,
                    });

                    if (orderProduct.length > 0) {
                        await OrderModel.insertMany(orderProduct);
                    }

                    if (userId) {
                        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                        await CartProductModel.deleteMany({ userId: userId });
                    }
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return response.json({ received: true });
    } catch (err) {
        console.error("Webhook processing error:", err.message);
        return response.status(500).json({ error: err.message });
    }
}

export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId; // user id

        const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address');

        return response.json({
            message: "order list",
            data: orderlist,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
