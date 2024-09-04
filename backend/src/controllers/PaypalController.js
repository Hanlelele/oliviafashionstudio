const dotenv = require("dotenv");
dotenv.config();

//const Order = require("../models/Order");

const base = "https://api-m.sandbox.paypal.com";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

const PaypalController = {
    generateAccessToken: async () => {
        try {
            if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
                throw new Error("MISSING_API_CREDENTIALS");
            }
            const auth = Buffer.from(
                PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
            ).toString("base64");
            const response = await fetch(`${base}/v1/oauth2/token`, {
                method: "POST",
                body: "grant_type=client_credentials",
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            });

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error("Failed to generate Access Token:", error);
        }
    },
    createOrder: async (data) => {
        const accessToken = await PaypalController.generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: data.totalPrice,
                    },
                },
            ],
        };

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        return PaypalController.handleResponse(response);
    },
    captureOrder: async (orderID) => {
        const accessToken = await PaypalController.generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return PaypalController.handleResponse(response);
    },
    handleResponse: async (response) => {
        try {
            const jsonResponse = await response.json();
            return {
                jsonResponse,
                httpStatusCode: response.status,
            };
        } catch (err) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    }
}

module.exports = PaypalController;