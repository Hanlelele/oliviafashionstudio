import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import OrderItem from '../../components/OrderItem/OrderItem';
import { fetchOrderByUser, getUserOrders } from '../../stores/OrderSlice/OrderSlide';
import { useDispatch, useSelector } from 'react-redux';

const OrderInfo = () => {
    const dispatch = useDispatch();
    const orders = useSelector(getUserOrders);
    const { user } = useAuth();

    useEffect(() => {
        dispatch(fetchOrderByUser(user._id));
    }, [dispatch]);

    return (
        user && (
            <div>
                <header className="heading flex flex-col border-b pt-[20px] pb-[15px]">
                    <span className="font-body text-[18px] text-dark font-[500]">My Order</span>
                    <span className="my-[4px] font-body text-[14px]">Find your orders here</span>
                </header>
                <div className="flex flex-col justify-center items-center">
                    {orders.length === 0 ? (
                        <p className="font-body py-5">You have no order.</p>
                    ) : (
                        orders.map((order, index) => <OrderItem key={index} order={order} />)
                    )}
                </div>
            </div>
        )
    );
};

export default OrderInfo;
