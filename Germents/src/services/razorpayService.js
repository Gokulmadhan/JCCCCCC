const base_url = import.meta.env.VITE_BACKEND_URL;

// 1. Load Razorpay SDK
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// 2. Create Razorpay Order (amount in paisa, e.g. 50000 = ₹500.00)
export const createRazorpayOrder = async (amount) => {
  try {
    const response = await fetch(`${base_url}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Razorpay order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createRazorpayOrder:", error);
    throw error;
  }
};

// 3. Create Backend Order (store order + payment info in DB)
export const createBackendOrder = async (orderPayload) => {
  try {
    const response = await fetch(`${base_url}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error("Failed to create backend order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createBackendOrder:", error);
    throw error;
  }
};

// 4. Verify Payment Signature
export const verifyPayment = async (orderId, paymentResponse) => {
  try {
    const response = await fetch(`${base_url}/orders/${orderId}/verify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentResponse),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Verification failed:", errorData);
      throw new Error("Failed to verify payment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    throw error;
  }
};

// 5. Delete order if Razorpay modal is closed before payment
export const deleteOrderOnClose = async (orderId) => {
  try {
    const response = await fetch(`${base_url}/orders/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to delete order:", errorText);
    } else {
      console.log("Order deleted successfully after modal close");
    }
  } catch (error) {
    console.error("Error in deleteOrderOnClose:", error);
  }
};
