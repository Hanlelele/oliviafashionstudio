import customAxios from './customApi';

class CartApi {
    async addToCart(product) {
        try {
            const response = await customAxios.post(`/cart/add`, product);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }
}

export default new CartApi();
