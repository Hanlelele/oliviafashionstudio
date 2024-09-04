import { configureStore } from '@reduxjs/toolkit';

import CartReducer from './CartSlice/CartSlice';
import OrderReducer from './OrderSlice/OrderSlide';
import CategoryReducer from './CategorySlice/CategorySlice';
import ProductReducer from './ProductSlice/ProductSlice';
import CouponReducer from './CouponSlice/CouponSlice';
import AnalysisReducer from './Analysis/AnalysisSlice';

const store = configureStore({
    reducer: {
        cart: CartReducer,
        order: OrderReducer,
        category: CategoryReducer,
        product: ProductReducer,
        coupon: CouponReducer,
        analysis: AnalysisReducer,
    },
});

export default store;
