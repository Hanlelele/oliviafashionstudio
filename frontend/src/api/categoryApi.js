import customAxios from './customApi';

class CategoryApi {
    async getAllCategories() {
        try {
            const response = await customAxios.get(`/category/`);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async getCategoryById(categoryId) {
        try {
            const response = await customAxios.get(`/category/${categoryId}`);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async addCategory(data) {
        try {
            const response = await customAxios.post(`admin/category/add`, data);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async updateCategory(categoryId, data) {
        try {
            const response = await customAxios.post(`admin/category/update/${categoryId}`, data);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async deleteCategory(categoryId) {
        try {
            const response = await customAxios.get(`admin/category/delete/${categoryId}`);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }
}

export default new CategoryApi();
