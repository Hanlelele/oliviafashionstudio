import customAxios from './customApi';

class ProductApi {
    async getAllProductOfCategory(categoryId, page = 1, limit = 6, minPrice, maxPrice, order) {
        try {
            let url = `/product/category/${categoryId}?page=${page}&limit=${limit}`;

            if (minPrice !== null && maxPrice !== null) {
                url += `&minPrice=${minPrice}`;
                url += `&maxPrice=${maxPrice}`;
            }
            if (order !== null) {
                url += `&order=${order}`;
            }
            const response = await customAxios.get(url);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async getAllProduct(page = 1, limit = 8, search, minPrice, maxPrice, order) {
        try {
            let url = `/product?page=${page}&limit=${limit}`;
            if (minPrice !== null && maxPrice !== null && minPrice !== undefined && maxPrice !== undefined) {
                url += `&minPrice=${minPrice}`;
                url += `&maxPrice=${maxPrice}`;
            }
            if (order !== null && order !== undefined) {
                url += `&order=${order}`;
            }
            if (search !== null && search !== undefined) {
                url += `&search=${search}`;
            }
            const response = await customAxios.get(url);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async getRelatedProducts(productId) {
        try {
            const response = await customAxios.get(`product/similar/${productId}`);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async getProductByID(productId) {
        try {
            const response = await customAxios.get(`/product/${productId}`);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async addProduct(data) {
        try {
            const response = await customAxios.post(`admin/product/add`, data);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async updateProduct(productId, data) {
        try {
            const response = await customAxios.post(`admin/product/update/${productId}`, data);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async deleteProduct(productId) {
        try {
            const response = await customAxios.get(`admin/product/delete/${productId}`);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async getSaleProduct() {
        try {
            const response = await customAxios.get('product/sale');
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async getTopProduct() {
        try {
            const response = await customAxios.get('product/top');
            return response.data;
        } catch (error) {
            return error.response;
        }
    }
}

export default new ProductApi();
