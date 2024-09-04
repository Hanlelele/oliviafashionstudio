import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils/status';
import customAxios from '../../api/customApi';

const initialState = {
    orders: [],
    ordersStatus: STATUS.IDLE,
    userOrders: [],
    order: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncOrders.pending, (state, action) => {
                state.ordersStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncOrders.fulfilled, (state, action) => {
                state.orders = action.payload.data;
                state.ordersStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncOrders.rejected, (state, action) => {
                state.ordersStatus = STATUS.FAILED;
            })

            .addCase(updateAsyncOrder.pending, (state, action) => {
                state.ordersStatus = STATUS.LOADING;
            })

            .addCase(updateAsyncOrder.fulfilled, (state, action) => {
                state.ordersStatus = STATUS.SUCCEEDED;
            })

            .addCase(updateAsyncOrder.rejected, (state, action) => {
                state.ordersStatus = STATUS.FAILED;
            })

            .addCase(fetchOrderByUser.fulfilled, (state, action) => {
                state.userOrders = action.payload.data;
            })
            .addCase(fetchOrderByUser.rejected, (state, action) => {
                console.log(action);
            })

            .addCase(createAsyncOrder.pending, (state, action) => {
                state.ordersStatus = STATUS.LOADING;
            })

            .addCase(createAsyncOrder.fulfilled, (state, action) => {
                state.order = action.payload.data;
            });
    },
});

//Get all order from user
export const fetchOrderByUser = createAsyncThunk('fetchOrderByUser', async (userId) => {
    const response = await customAxios.get(`/order/user/${userId}`);
    return response.data;
});

// get all order
export const fetchAsyncOrders = createAsyncThunk('order/fetch', async () => {
    const response = await customAxios.get(`/order/`);
    return response.data;
});

//update order
export const updateAsyncOrder = createAsyncThunk('order/update', async ({ orderId, data }) => {
    const response = await customAxios.post(`order/update/${orderId}`, data);
    return response.data;
});

//create order
export const createAsyncOrder = createAsyncThunk('order/create', async (data) => {
    const response = await customAxios.post(`order/create/`, data);
    return response.data;
});

export const getAllOrder = (state) => state.order.orders;
export const getAllOrderStatus = (state) => state.order.ordersStatus;
export const getUserOrders = (state) => state.order.userOrders;
export const getOrder = (state) => state.order.order;
export default orderSlice.reducer;
