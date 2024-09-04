import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import formatPrice from '../../utils/helpers';
import NumberInput from '../../components/NumberInput/NumberInput';
import {
    fetchCart,
    addToCart,
    removeItemFromCart,
    deleteCart,
    updateCart,
    itemsCount,
    carts,
    totalPrice,
    totalQuantity,
    getCartStatus,
} from '../../stores/CartSlice/CartSlice';

import { createAsyncOrder } from '../../stores/OrderSlice/OrderSlide';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

import { STATUS } from '../../utils/status';
import Loading from '../../components/Loading/Loading';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentCart = useSelector(carts);
    const total_price = useSelector(totalPrice);
    const total_quantity = useSelector(totalQuantity);
    const items_count = useSelector(itemsCount);

    const cartStatus = useSelector(getCartStatus);

    useEffect(() => {
        dispatch(fetchCart());
    }, []);

    if (cartStatus === STATUS.LOADING || cartStatus === STATUS.FAILED) {
        return <Loading />;
    }

    const handleRemoveCartItem = (event, id) => {
        event.stopPropagation();
        dispatch(removeItemFromCart(id));
    };
    const handleQuantityChange = (event, newValue, itemId) => {
        event.stopPropagation();
        dispatch(updateCart({ productId: itemId, quantity: newValue }));
    };
    const handleClickNumberInput = (event) => {
        event.stopPropagation();
    };

    const handleDeleteCart = () => {
        dispatch(deleteCart());
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return items_count !== 0 ? (
        <div className="flex flex-col items-center pb-[100px]">
            <div className="w-full flex flex-col justify-center items-center">
                <div className="my-[28px] w-full flex justify-start">
                    <span className="font-body text-[24px] font-[600]">{`My Cart (${items_count})`}</span>
                </div>
                <div className="cart-section flex flex-col w-full gap-y-6">
                    <div className="cart-item-section bg-white border rounded-md border-grey-300 flex flex-col divide-y">
                        {currentCart?.map((cartItem) => (
                            <div
                                key={cartItem?.productId?._id}
                                className="p-[18px] grid md:grid-cols-[80px_1.5fr_1fr_1fr_1fr_1fr] grid-cols-[80px_1.5fr_1fr_1fr_1fr_0.5fr] gap-x-[4px] hover:bg-gray-100"
                            >
                                <div className="image col-span-1 border-[1px] border-grey-400 cursor-pointer">
                                    <img
                                        src={cartItem?.productId?.image || ''}
                                        className="w-full object-contain h-[80px]"
                                        onClick={(e) => {
                                            navigate(`/product/${cartItem?.productId?._id}`);
                                        }}
                                    ></img>
                                </div>
                                <div
                                    className="pl-[10px] item-name col-span-1 font-body font-[500] flex items-center justify-center truncate cursor-pointer"
                                    onClick={(e) => {
                                        navigate(`/product/${cartItem?.productId?._id}`);
                                    }}
                                >
                                    {cartItem?.productId?.name || 'unknown'}
                                </div>
                                <div className="pl-[10px] item-name col-span-1 flex items-center justify-center">
                                    <span className="font-body font-[500]">
                                        {formatPrice(cartItem?.productId?.price)}
                                    </span>
                                </div>
                                <div className="quantity-input flex items-center justify-center">
                                    <NumberInput
                                        initialValue={cartItem?.quantity}
                                        onChange={handleQuantityChange}
                                        onClick={handleClickNumberInput}
                                        identifier={cartItem?.productId?._id}
                                        maxValue={cartItem?.productId?.quantity}
                                    />
                                </div>
                                <div className="quantity-input flex items-center justify-center text-red font-[500]">
                                    {formatPrice(
                                        cartItem?.quantity *
                                            (cartItem?.productId?.price -
                                                (cartItem?.productId?.price *
                                                    (cartItem?.productId?.discountPercentage || 0)) /
                                                    100 || 1),
                                    )}
                                </div>
                                <div className="quantity-input flex items-center justify-center ">
                                    <div
                                        className="delete-btn flex items-center justify-center border rounded-md border-grey-300 shadow-sm
                  hover:bg-primary cursor-pointer"
                                        onClick={(e) => handleRemoveCartItem(e, cartItem?.productId?._id)}
                                    >
                                        <span className="font-body text-primary px-[10px] py-[5px] hover:text-white sm:inline-block hidden">
                                            Remove
                                        </span>
                                        <FontAwesomeIcon
                                            icon={faCircleXmark}
                                            className="text-red sm:hidden inline-block"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="checkout sticky bottom-0 bg-white shadow-sm flex justify-between items-center
           min-h-[100px] border border-grey-300 rounded-md p-6"
                    >
                        <div className="flex items-center gap-x-4">
                            <div
                                className="bg-white hover:bg-red font-body text-red px-[10px] py-[5px]
              border border-grey-300 rounded-md hover:text-white cursor-pointer"
                                onClick={handleDeleteCart}
                            >
                                Delete all
                            </div>
                            <div className="font-body">
                                <span className="font-[600] text-dark">Total items: {''}</span>
                                {total_quantity}
                            </div>
                        </div>
                        <div className="md:flex block items-center gap-x-8">
                            <div className="">
                                Total:{'  '}
                                <span className="text-red text-[24px] font-[500]">{formatPrice(total_price)}</span>
                            </div>
                            <div
                                className="font-body text-[20px] px-[30px] py-[5px] bg-primary text-white
              border rounded-md cursor-pointer hover:opacity-90 shadow-sm"
                                onClick={() => handleCheckout()}
                            >
                                Check Out
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center pb-[100px]">
            <div className="max-w-[1200px] w-[1200px] flex flex-col justify-center items-center">
                <NavLink
                    to={`/`}
                    className="font-body text-[32px] flex justify-center items-center pt-[40px] hover:text-orange"
                >
                    Your cart is empty. Let's go shopping now
                </NavLink>
            </div>
        </div>
    );
};

export default CartPage;
