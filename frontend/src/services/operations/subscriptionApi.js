import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { PAYMENT_ENDPOINTS } from "../api";

const {
    FETCH_SUBSCRIPTIONS,
    INITIATE_PAYMENT,
    VERIFY_PAYMENT,
} = PAYMENT_ENDPOINTS;

export async function fetchSubscriptions(token) {
    try {
        const response = await apiConnector("GET", FETCH_SUBSCRIPTIONS, null, {
            Authorization: `Bearer ${token}`,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Could not fetch subscriptions.");
        return null;
    }
}

export async function createSubscriptionOrder(token, amount, subscriptionId) {
    console.log('idd',subscriptionId)
    const toastId = toast.loading("Creating order...");
    try {
        const response = await apiConnector(
            "POST",
            INITIATE_PAYMENT,
            { amount, subscriptionId },
            { Authorization: `Bearer ${token}` }
        );

        toast.dismiss(toastId);
        return response.data; 
    } catch (error) {
        console.error("Error creating order:", error);
        toast.dismiss(toastId);
        toast.error("Failed to create order.");
        return null;
    }
}



function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function handleSubscriptionPayment(
    token,
    amount,
    subscriptionId,
    currUser,
    navigate
) {
    // const toastId = toast.loading("Loading...");
    console.log('loggers',token,
        amount,
        subscriptionId,
        currUser)
    try {
        const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!sdkLoaded) {
            // toast.dismiss(toastId);
            toast.error("Failed to load Razorpay SDK. Check your internet connection.");
            return;
        }

        const order = await createSubscriptionOrder(token, amount, subscriptionId);
        if (!order) return;

        const { id: orderId, amount: orderAmount, currency } = order;

        const razorpayKey = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID;
        const options = {
            key: razorpayKey,
            amount: orderAmount,
            currency: currency,
            order_id: orderId,
            handler: async function (response) {
                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                await verifySubscriptionPayment(
                    token,
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    subscriptionId,
                    navigate
                );
            },
            prefill: {
                name: currUser?.name || currUser?.username,
                email: currUser?.email,
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment failed. Please try again.");
            console.error("Payment failed:", response.error);
        });
        // toast.dismiss(toastId);
    } catch (error) {
        console.error("Payment process error:", error);
        // toast.dismiss(toastId);
        toast.error("Could not process payment.");
    }
    
}

// Verify payment on the server
export async function verifySubscriptionPayment(
    token,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    subscriptionId,
    navigate
) {
    const toastId = toast.loading("Verifying payment...");
    try {
        const response = await apiConnector(
            "POST",
            VERIFY_PAYMENT,
            {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                subscriptionId,
            },
            { Authorization: `Bearer ${token}` }
        );

        if (response.status === 200) {
            toast.success("Payment verified successfully!");
            navigate("/dashboard");
        } else {
            toast.error("Payment verification failed.");
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Error during payment verification.");
    }
    toast.dismiss(toastId);
}
