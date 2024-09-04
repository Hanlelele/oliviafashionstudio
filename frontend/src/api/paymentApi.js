import customAxios from './customApi';

class PaymentApi {
    async getConfig() {
        try {
            const response = await customAxios.get(`/payment/config`);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }
}

export default new PaymentApi();
