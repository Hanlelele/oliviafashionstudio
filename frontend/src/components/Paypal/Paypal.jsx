import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { carts, fetchCart, totalPrice } from '../../stores/CartSlice/CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import paymentApi from '../../api/paymentApi';
import { createAsyncOrder } from '../../stores/OrderSlice/OrderSlide';

const Paypal = (props) => {
    const { handleOrder, checkCoupon } = props;
    const { token } = useAuth();
    const currentCart = useSelector(carts);
    const total_price = useSelector(totalPrice);
    const dispatch = useDispatch();

    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchCartData = async () => {
            await dispatch(fetchCart());
        };
        fetchCartData();
    }, [dispatch]);

    useEffect(() => {
        const getConfig = async () => {
            try {
                const response = await paymentApi.getConfig();
                setUserId(response.data);
            } catch (error) {
                console.error('Error fetching PayPal config:', error);
            }
        };

        getConfig();
    }, []);

    const converCartToOrder = (cart) => {
        return cart.map((item) => ({
            product: item.productId._id,
            quantity: item.quantity,
        }));
    };

    const createOrder = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/order/paypal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: converCartToOrder(currentCart),
                    totalPrice: (
                        (total_price -
                            total_price * (checkCoupon?.success ? checkCoupon.data.discountPercentage / 100 : 0)) /
                        25000
                    ).toFixed(2),
                }),
            });

            const order = await response.json();
            return order.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const onApprove = async (data) => {
        try {
            const response = await fetch(`http://localhost:8000/api/order/paypal/${data.orderID}/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: converCartToOrder(currentCart),
                    totalPrice: (
                        (total_price -
                            total_price * (checkCoupon?.success ? checkCoupon.data.discountPercentage / 100 : 0)) /
                        25000
                    ).toFixed(2),
                }),
            });

            const orderData = await response.json();

            if (orderData.status === 'COMPLETED') {
                handleOrder();
            } else {
                console.log('Order captured:', orderData);
            }
        } catch (error) {
            console.error('Error capturing order:', error);
        }
    };

    return userId ? (
        <PayPalScriptProvider
            options={{
                'client-id': userId,
            }}
        >
            <div id="paypal-button-container">
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
            </div>
        </PayPalScriptProvider>
    ) : (
        <div>Loading...</div>
    );
};

export default Paypal;
