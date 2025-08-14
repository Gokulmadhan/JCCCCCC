import { loadRazorpayScript } from "./razorpayService";
import axios from "axios";

const handleRazorpay = async (
  amount,
  currency,
  razorpayOrderId,
  fullName,
  phone,
  paymentsuccess,
  paymentfailed,
  navigate
) => {
  try {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount,
      currency: currency,
      name: "AshThings Store",
      description: "Order Payment",
      order_id: razorpayOrderId, // FIXED: Now properly passed
      handler: async function (response) {
        try {
          await paymentsuccess(response); // Awaited for safety
          // toast.success("Payment successful! Your order has been placed.");
          // if (typeof navigate === "function") {
          //   navigate("/thank-you");
          // } else {
          //   window.location.href = "/thank-you";
          // }
        } catch (err) {
          console.error("Payment verification failed:", err);
          alert("Payment completed but order update failed. Please contact support.");
        }
      },
      prefill: {
        name: fullName || "",
        contact: phone || "",
      },
      theme: { color: "#4f46e5" },
      modal: {
        ondismiss: async function () {
          console.warn("Payment modal closed by user.");
          await paymentfailed(); // Awaited for proper flow
        },
      },
    };

    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      alert("Razorpay SDK failed to load. Please try again.");
      return;
    }

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.error("Error in payment process:", error);
    alert("There was an error processing your payment. Please try again.");
  }
};

// Example paymentsuccess function for Checkout.jsx
export const paymentsuccess = async (response) => {
  try {
    const res = await axios.post("/api/razorpay/verify", {
      ...response,
      items: cartItems,      // Your cart items
      amount: totalAmount,   // Your total amount
    });

    if (res.data.success) {
      navigate("/my-orders"); // Redirect on success
    } else {
      alert("Payment was successful but order not recorded.");
    }
  } catch (err) {
    console.error("Order saving failed:", err);
    alert("Something went wrong. Please contact support.");
  }
};

export default handleRazorpay;