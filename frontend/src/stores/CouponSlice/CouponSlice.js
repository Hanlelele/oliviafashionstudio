import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils/status';
import customAxios from '../../api/customApi';

const initialState = {
    coupons: [],
    couponsStatus: STATUS.IDLE,
    checkCoupon: [],
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        resetCheckCoupon: (state) => {
            state.checkCoupon = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAsyncCoupon.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(checkAsyncCoupon.fulfilled, (state, action) => {
                state.checkCoupon = action.payload;
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(checkAsyncCoupon.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            })

            .addCase(fetchAsyncCoupons.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncCoupons.fulfilled, (state, action) => {
                state.coupons = action.payload.data;
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncCoupons.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            })

            .addCase(addAsyncCoupon.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(addAsyncCoupon.fulfilled, (state, action) => {
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(addAsyncCoupon.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            })

            .addCase(updateAsyncCoupon.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(updateAsyncCoupon.fulfilled, (state, action) => {
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(updateAsyncCoupon.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            })

            .addCase(deleteAsyncCoupon.pending, (state, action) => {
                state.couponsStatus = STATUS.LOADING;
            })

            .addCase(deleteAsyncCoupon.fulfilled, (state, action) => {
                state.couponsStatus = STATUS.SUCCEEDED;
            })

            .addCase(deleteAsyncCoupon.rejected, (state, action) => {
                state.couponsStatus = STATUS.FAILED;
            });
    },
});

//Checkout discount
export const checkAsyncCoupon = createAsyncThunk('coupon/check', async (name) => {
    const response = await customAxios.post(`admin/coupon/check`, name);
    return response.data;
});

// get all coupons
export const fetchAsyncCoupons = createAsyncThunk('coupon/fetch', async () => {
    const response = await customAxios.get(`/admin/coupon/`);
    return response.data;
});

//add coupon
export const addAsyncCoupon = createAsyncThunk('coupon/add', async (data) => {
    const response = await customAxios.post(`admin/coupon/add`, data);
    return response.data;
});

//update coupon
export const updateAsyncCoupon = createAsyncThunk('coupon/update', async ({ couponId, data }) => {
    const response = await customAxios.post(`admin/coupon/update/${couponId}`, data);
    return response.data;
});

//delete coupon
export const deleteAsyncCoupon = createAsyncThunk('coupon/delete', async (couponId) => {
    const response = await customAxios.get(`admin/coupon/delete/${couponId}`);
    return response.data;
});

// export const getAllCoupons = (state) => state.coupon.coupons;
// export const getAllCouponsStatus = (state) => state.coupon.couponsStatus;
// export const getCheckCoupon = (state) => state.coupon.checkCoupon;
// export const resetCheckCoupon = (state) => state.coupon.checkCoupon = null;
// export default couponSlice.reducer;

export const { resetCheckCoupon } = couponSlice.actions;
export const getAllCoupons = (state) => state.coupon.coupons;
export const getAllCouponsStatus = (state) => state.coupon.couponsStatus;
export const getCheckCoupon = (state) => state.coupon.checkCoupon;
export default couponSlice.reducer;
