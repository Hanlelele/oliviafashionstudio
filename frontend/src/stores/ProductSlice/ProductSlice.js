import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils/status';
import customAxios from '../../api/customApi';

const initialState = {
    productsAll: [],
    productsAllStatus: STATUS.IDLE,
    productSingle: [],
    productSingleStatus: STATUS.IDLE,
    relatedProducts: [],
    relatedProductsStatus: STATUS.IDLE,
    productCategoryResponse: {},
    productCategory: [],
    productCategoryStatus: STATUS.IDLE,
    totalProducts: 0,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncAllProduct.pending, (state, action) => {
                state.productsAllStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncAllProduct.fulfilled, (state, action) => {
                state.productsAll = action.payload;
                state.totalProducts = action.payload.totalProducts;
                state.productsAllStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncAllProduct.rejected, (state, action) => {
                state.productsAllStatus = STATUS.FAILED;
            })

            .addCase(fetchAsyncProductSingle.pending, (state, action) => {
                state.productSingleStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncProductSingle.fulfilled, (state, action) => {
                state.productSingle = action.payload.data;
                state.productSingleStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncProductSingle.rejected, (state, action) => {
                state.productSingleStatus = STATUS.FAILED;
            })

            .addCase(fetchAsyncRelatedProducts.pending, (state, action) => {
                state.relatedProductsStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncRelatedProducts.fulfilled, (state, action) => {
                state.relatedProducts = action.payload.data;
                state.relatedProductsStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncRelatedProducts.rejected, (state, action) => {
                state.relatedProductsStatus = STATUS.FAILED;
            })

            .addCase(fetchAsyncProductCategory.pending, (state, action) => {
                state.productCategoryStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncProductCategory.fulfilled, (state, action) => {
                state.productCategoryResponse = action.payload.data;
                state.productCategory = action.payload.data;
                state.productCategoryStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncProductCategory.rejected, (state, action) => {
                state.productCategoryStatus = STATUS.FAILED;
            })

            .addCase(addAsyncProduct.pending, (state, action) => {
                state.productsAllStatus = STATUS.LOADING;
            })

            .addCase(addAsyncProduct.fulfilled, (state, action) => {
                state.productsAllStatus = STATUS.SUCCEEDED;
            })

            .addCase(addAsyncProduct.rejected, (state, action) => {
                state.productsAllStatus = STATUS.FAILED;
            })

            .addCase(updateAsyncProduct.pending, (state, action) => {
                state.productsAllStatus = STATUS.LOADING;
            })

            .addCase(updateAsyncProduct.fulfilled, (state, action) => {
                state.productsAllStatus = STATUS.SUCCEEDED;
            })

            .addCase(updateAsyncProduct.rejected, (state, action) => {
                state.productsAllStatus = STATUS.FAILED;
            })

            .addCase(deleteAsyncProduct.pending, (state, action) => {
                state.productsAllStatus = STATUS.LOADING;
            })

            .addCase(deleteAsyncProduct.fulfilled, (state, action) => {
                state.productsAllStatus = STATUS.SUCCEEDED;
            })

            .addCase(deleteAsyncProduct.rejected, (state, action) => {
                state.productsAllStatus = STATUS.FAILED;
            });
    },
});

export const fetchAsyncAllProduct = createAsyncThunk(
    'product-all/fetch',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await customAxios.get(`/admin/product?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    },
);
// getting the single product data also
export const fetchAsyncProductSingle = createAsyncThunk('product-single/fetch', async (id) => {
    const response = await customAxios.get(`/product/${id}`);
    return response.data;
});

export const fetchAsyncProductCategory = createAsyncThunk('product-category/fetch', async (id, limit = 6, page = 1) => {
    const response = await customAxios.get(`/product/category/${id}?page=${page}&limit=${limit}`);
    return response.data;
});
//Fetch all similar products : to do
export const fetchAsyncRelatedProducts = createAsyncThunk('product-related/fetch', async (id) => {
    const response = await customAxios.get(`product/similar/${id}`);
    return response.data;
});

//add category
export const addAsyncProduct = createAsyncThunk('product/add', async (data) => {
    const response = await customAxios.post(`admin/product/add`, data);
    return response.data;
});

//update category
export const updateAsyncProduct = createAsyncThunk('product/update', async ({ productId, data }) => {
    const response = await customAxios.post(`admin/product/update/${productId}`, data);
    return response.data;
});

//delete category
export const deleteAsyncProduct = createAsyncThunk('product/delete', async (productId) => {
    const response = await customAxios.get(`admin/product/delete/${productId}`);
    return response.data;
});

export const getAllProduct = (state) => state.product.productsAll;
export const getAllProductNumber = (state) => state.product.totalProducts;
export const getAllProductStatus = (state) => state.product.productsAllStatus;
export const getProductSingle = (state) => state.product.productSingle;
export const getSingleProductStatus = (state) => state.product.productSingleStatus;
export const getRelatedProducts = (state) => state.product.relatedProducts;
export const getRelatedProductsStatus = (state) => state.product.relatedProductsStatus;
export const getProductCategoryResponse = (state) => state.product.productCategoryResponse;
export const getProductCategory = (state) => state.product.productCategory;
export const getProductCategoryStatus = (state) => state.product.productCategoryStatus;
export default productSlice.reducer;
