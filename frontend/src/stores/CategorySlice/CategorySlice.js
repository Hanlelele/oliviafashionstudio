import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils/status';
import customAxios from '../../api/customApi';

const initialState = {
    categories: [],
    categoriesStatus: STATUS.IDLE,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncCategories.pending, (state, action) => {
                state.categoriesStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data;
                state.categoriesStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncCategories.rejected, (state, action) => {
                state.categoriesStatus = STATUS.FAILED;
            })

            .addCase(addAsyncCategory.pending, (state, action) => {
                state.categoriesStatus = STATUS.LOADING;
            })

            .addCase(addAsyncCategory.fulfilled, (state, action) => {
                state.categoriesStatus = STATUS.SUCCEEDED;
            })

            .addCase(addAsyncCategory.rejected, (state, action) => {
                state.categoriesStatus = STATUS.FAILED;
            })

            .addCase(updateAsyncCategory.pending, (state, action) => {
                state.categoriesStatus = STATUS.LOADING;
            })

            .addCase(updateAsyncCategory.fulfilled, (state, action) => {
                state.categoriesStatus = STATUS.SUCCEEDED;
            })

            .addCase(updateAsyncCategory.rejected, (state, action) => {
                state.categoriesStatus = STATUS.FAILED;
            })

            .addCase(deleteAsyncCategory.pending, (state, action) => {
                state.categoriesStatus = STATUS.LOADING;
            })

            .addCase(deleteAsyncCategory.fulfilled, (state, action) => {
                state.categoriesStatus = STATUS.SUCCEEDED;
            })

            .addCase(deleteAsyncCategory.rejected, (state, action) => {
                state.categoriesStatus = STATUS.FAILED;
            });
    },
});

// getting the single product data also
export const fetchAsyncCategories = createAsyncThunk('category/fetch', async () => {
    const response = await customAxios.get(`/category`);
    return response.data;
});

//add category
export const addAsyncCategory = createAsyncThunk('category/add', async (data) => {
    const response = await customAxios.post(`admin/category/add`, data);
    return response.data;
});

//update category
export const updateAsyncCategory = createAsyncThunk('category/update', async ({ categoryId, data }) => {
    const response = await customAxios.post(`admin/category/update/${categoryId}`, data);
    return response.data;
});

//delete category
export const deleteAsyncCategory = createAsyncThunk('category/delete', async (categoryId) => {
    const response = await customAxios.get(`admin/category/delete/${categoryId}`);
    return response.data;
});

export const getAllCategory = (state) => state.category.categories;
export const getAllCategoryStatus = (state) => state.category.categoriesStatus;
export default categorySlice.reducer;
