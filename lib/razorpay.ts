/**
 * Razorpay Checkout integration.
 * Loads the Razorpay script dynamically and opens the checkout modal.
 * Amount is always from backend order — user cannot edit.
 */

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (
        event: string,
        handler: (response: RazorpaySuccessResponse) => void,
      ) => void;
    };
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Razorpay can only be used in the browser"));
      return;
    }
    if (window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      if (window.Razorpay) resolve();
      else existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.head.appendChild(script);
  });
}

/**
 * Open Razorpay Checkout modal. Resolves with payment details on success, rejects on failure or modal close.
 * Amount is taken from the order (created server-side) — user cannot edit.
 */
export function openRazorpayCheckout(
  options: RazorpayCheckoutOptions,
): Promise<RazorpaySuccessResponse> {
  return loadScript().then(() => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error("Razorpay not available"));
        return;
      }
      const rzp = new window.Razorpay({
        key: options.key,
        order_id: options.order_id,
        name: options.name ?? "SkillScout",
        description: options.description ?? "Plan subscription",
        prefill: options.prefill,
        handler: (response: RazorpaySuccessResponse) => {
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled"));
          },
        },
      });
      rzp.open();
    });
  });
}
