import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils/status';
import customAxios from '../../api/customApi';

const initialState = {
    totalOrder: 0,
    totalRevenue: 0,
    totalProduct: 0,
};

const analysisSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncTotalOrder.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncTotalOrder.fulfilled, (state, action) => {
                state.totalOrder = action.payload.data;
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncTotalOrder.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            })

            .addCase(fetchAsyncTotalRevenue.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncTotalRevenue.fulfilled, (state, action) => {
                state.totalRevenue = action.payload.data;
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncTotalRevenue.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            })

            .addCase(fetchAsyncTotalProduct.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncTotalProduct.fulfilled, (state, action) => {
                state.totalProduct = action.payload.data;
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncTotalProduct.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            });
    },
});

export const fetchAsyncTotalOrder = createAsyncThunk('total-order/fetch', async () => {
    const response = await customAxios.get(`/admin/analysis/total-order`);
    return response.data;
});

export const fetchAsyncTotalRevenue = createAsyncThunk('total-revenue/fetch', async () => {
    const response = await customAxios.get(`/admin/analysis/total-revenue`);
    return response.data;
});

export const fetchAsyncTotalProduct = createAsyncThunk('total-product/fetch', async () => {
    const response = await customAxios.get(`/admin/analysis/total-product`);
    return response.data;
});

export const getTotalOrder = (state) => state.analysis.totalOrder;
export const getTotalRevenue = (state) => state.analysis.totalRevenue;
export const getTotalProduct = (state) => state.analysis.totalProduct;

export default analysisSlice.reducer;
