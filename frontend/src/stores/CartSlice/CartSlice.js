import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils/status';
import customAxios from '../../api/customApi';
import { toast } from 'react-toastify';

const initialState = {
    itemsCount: 0,
    totalQuantity: 0,
    carts: [],
    totalPrice: 0,
    cartStatus: STATUS.IDLE,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state, action) => {
            state.cartStatus = STATUS.LOADING;
        });

        builder.addCase(fetchCart.fulfilled, (state, action) => {
            const data = action.payload.data;
            state.carts = data?.items;
            state.itemsCount = data?.items.length || 0;
            state.totalQuantity = data?.items.reduce((total, item) => total + item?.quantity, 0);
            state.totalPrice = data?.items?.reduce((total, item) => {
                const price = item?.productId?.price || 0;
                const discountPercentage = item?.productId?.discountPercentage || 0;
                const discount = price * (discountPercentage / 100);
                const discountedPrice = price - discount;
                const quantity = item?.quantity || 1;

                return total + discountedPrice * quantity;
            }, 0);

            state.cartStatus = STATUS.SUCCEEDED;
        });

        builder.addCase(fetchCart.rejected, (state, action) => {
            state.cartStatus = STATUS.FAILED;
        });

        builder.addCase(addToCart.fulfilled, (state, action) => {
            const data = action.payload.data;
            state.carts = data?.items;
            state.itemsCount = data?.items?.length;
            state.totalQuantity = data?.items.reduce((total, item) => total + item?.quantity, 0);
            state.totalPrice = data?.items?.reduce((total, item) => {
                const price = item?.productId?.price || 0;
                const discountPercentage = item?.productId?.discountPercentage || 0;
                const discount = price * (discountPercentage / 100);
                const discountedPrice = price - discount;
                const quantity = item?.quantity || 1;

                return total + discountedPrice * quantity;
            }, 0);

            toast.success('Add to cart successfully !');

            state.cartStatus = STATUS.SUCCEEDED;
        });

        builder.addCase(updateCart.fulfilled, (state, action) => {
            const data = action.payload.data;
            state.carts = data?.items;
            state.itemsCount = data?.items?.length;
            state.totalQuantity = data?.items?.reduce((total, item) => total + item?.quantity, 0);
            state.totalPrice = data?.items?.reduce((total, item) => {
                const price = item?.productId?.price || 0;
                const discountPercentage = item?.productId?.discountPercentage || 0;
                const discount = price * (discountPercentage / 100);
                const discountedPrice = price - discount;
                const quantity = item?.quantity || 1;

                return total + discountedPrice * quantity;
            }, 0);

            state.cartStatus = STATUS.SUCCEEDED;
        });

        builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
            const data = action.payload.data;
            state.carts = data?.items || [];
            state.itemsCount = data?.items?.length || 0;
            state.totalQuantity = data?.items?.reduce((total, item) => total + item?.quantity, 0) || 0;
            state.totalPrice = data?.items?.reduce((total, item) => {
                const price = item?.productId?.price || 0;
                const discountPercentage = item?.productId?.discountPercentage || 0;
                const discount = price * (discountPercentage / 100);
                const discountedPrice = price - discount;
                const quantity = item?.quantity || 1;

                return total + discountedPrice * quantity;
            }, 0);

            state.cartStatus = STATUS.SUCCEEDED;
        });

        builder.addCase(deleteCart.fulfilled, (state, action) => {
            state.carts = [];
            state.itemsCount = 0;
            state.totalQuantity = 0;
            state.totalPrice = 0;

            state.cartStatus = STATUS.SUCCEEDED;
        });
    },
});

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
    const response = await customAxios.get(`/cart/`);
    return response.data;
});

export const addToCart = createAsyncThunk('cart/add', async (product) => {
    const response = await customAxios.post(`/cart/add`, product);
    return response.data;
});

export const updateCart = createAsyncThunk('cart/update', async (product) => {
    const response = await customAxios.post(`/cart/update`, product);
    return response.data;
});

export const removeItemFromCart = createAsyncThunk('cart/remove', async (productId) => {
    const response = await customAxios.post(`/cart/remove`, {
        productId: productId,
    });
    return response.data;
});

export const deleteCart = createAsyncThunk('cart/delete', async () => {
    const response = await customAxios.post(`/cart/delete`, {});
    return response.data;
});

// Selectors
export const itemsCount = (state) => state.cart.itemsCount;
export const carts = (state) => state.cart.carts;
export const totalQuantity = (state) => state.cart.totalQuantity;
export const totalPrice = (state) => state.cart.totalPrice;
export const getCartStatus = (state) => state.cart.cartStatus;
export default cartSlice.reducer;
