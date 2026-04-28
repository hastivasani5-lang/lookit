# Razorpay Payment Integration Setup

## Overview
The payment system has been updated to use Razorpay's official checkout integration. When users click "Pay Now", they will see the Razorpay payment modal with the correct cart total amount.

## Setup Instructions

### 1. Get Razorpay Credentials
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or log in to your account
3. Navigate to Settings → API Keys
4. Copy your **Key ID** and **Key Secret**

### 2. Update Environment Variables
Add your Razorpay credentials to `.env`:

```env
RAZORPAY_KEY_ID=your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_key_secret_here
```

### 3. How It Works

**Payment Flow:**
1. User fills in card details and clicks "Pay Now"
2. Frontend creates a Razorpay order via `/api/payments/razorpay-order`
3. Razorpay checkout modal opens with the correct amount
4. User completes payment in the modal
5. Payment is verified and saved to database
6. Cart is cleared and user sees success message

**Key Files:**
- `src/app/cart/CartPageClient.tsx` - Frontend payment form
- `src/app/api/payments/razorpay-order/route.ts` - Creates Razorpay orders
- `src/app/api/payments/checkout/route.ts` - Verifies and saves payments

### 4. Testing

**Test Cards (Razorpay provides):**
- Success: 4111 1111 1111 1111
- Failure: 4222 2222 2222 2222

Use any future expiry date and any 3-digit CVV.

### 5. Important Notes

- The amount is automatically calculated from cart items
- All amounts are in INR (Indian Rupees)
- Razorpay handles all payment security
- Payments are verified server-side before saving
- Card details are sent to Razorpay, not stored locally

## Troubleshooting

**"Something went wrong" error:**
- Check that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set correctly
- Verify the keys are from the correct Razorpay account
- Check browser console for detailed error messages

**Amount shows as 0:**
- This should no longer happen with the new integration
- If it does, check that cart items have valid prices

**Payment modal doesn't open:**
- Ensure Razorpay script is loaded (check Network tab in DevTools)
- Verify `RAZORPAY_KEY_ID` is correct
