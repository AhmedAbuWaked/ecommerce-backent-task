const { Checkout } = require("checkout-sdk-node");
const ApiError = require("./apiError");

// const checkout = new Checkout(process.env.CHECKOUT_SECRET_KEY, {
//   environment: "sandbox",
// });

class CheckoutPayment {
  constructor() {
    this.checkout = new Checkout(process.env.CHECKOUT_SECRET_KEY, {
      pk: process.env.CHECKOUT_PUBLIC_KEY,
    });
  }

  async createPayment({ payment, user, req, next }) {
    try {
      const response = await this.checkout.payments.request({
        source: {
          type: "token",
          token: payment.token,
        },
        amount: payment.amount * 100,
        currency: "SAR",
        payment_type: "Recurring",
        reference: "ORD-5023-4E89",
        description: payment.description,
        capture: true,
        capture_on: new Date(),
        customer: {
          email: user.email,
          name: user.full_name,
          phone: {
            country_code: "+966",
            number: user.phone,
          },
        },
        billing_descriptor: {
          name: "The Book Store (New You)",
          city: "Makkah",
        },
        shipping: {
          address: {
            address_line1: "Checkout.com",
            address_line2: "90 Tottenham Court Road",
            city: "Makkah",
            state: "Makkah",
            zip: "W1T 4TJ",
            country: "SA",
          },
          phone: {
            country_code: "+966",
            number: "123456789",
          },
        },
        "3ds": {
          enabled: true,
          attempt_n3d: true,
          eci: "05",
          cryptogram: "AgAAAAAAAIR8CQrXcIhbQAAAAAA=",
          xid: "MDAwMDAwMDAwMDAwMDAwMzIyNzY=",
          version: "2.0.1",
        },
        previous_payment_id: "pay_fun26akvvjjerahhctaq2uzhu4",
        risk: {
          enabled: false,
        },
        success_url: `${req.protocol}://${req.get(
          "host"
        )}/api/v1/payment/success`,
        failure_url: `${req.protocol}://${req.get(
          "host"
        )}/api/v1/payment/failure`,
        payment_ip: `${req.ip}`,
        recipient: {
          dob: "1985-05-15",
          account_number: "5555554444",
          zip: "W1T",
          last_name: "Jones",
        },
        metadata: {
          coupon_code: "NY2018",
          partner_id: 123989,
        },
      });
      return response;
    } catch (error) {
      return next(new ApiError(error.body.error_codes[0], 500));
    }
  }
}

module.exports = CheckoutPayment;
