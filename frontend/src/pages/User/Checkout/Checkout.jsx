import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    MenuItem,
    InputLabel,
    TextField,
    Radio,
    Button,
    FormControlLabel,
    RadioGroup,
} from '@mui/material';

import { fetchCart, carts, totalPrice, deleteCart } from '../../../stores/CartSlice/CartSlice';
import { createAsyncOrder, fetchOrderByUser, getUserOrders, getOrder } from '../../../stores/OrderSlice/OrderSlide';
import Paypal from '../../../components/Paypal/Paypal';
import { useDispatch, useSelector } from 'react-redux';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import formatPrice from '../../../utils/helpers';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { format } from 'date-fns';
import { checkAsyncCoupon, getCheckCoupon, resetCheckCoupon } from '../../../stores/CouponSlice/CouponSlice';

const CheckoutPage = () => {
    const [payment, setPayment] = useState('cash');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderCreated = useSelector(getOrder);
    const currentCart = useSelector(carts);
    const total_price = useSelector(totalPrice);
    const [orderComplete, setOrderComplete] = useState(false);
    const [discount, setDiscount] = useState('');
    const checkCoupon = useSelector(getCheckCoupon);

    const { user } = useAuth();

    const [order, createOrder] = useState({
        fullname: '',
        phone: '',
        address: '',
        items: [],
        totalPrice: '',
        paymentMethod: '',
    });

    useEffect(() => {
        const fetchCartData = async () => {
            await dispatch(fetchCart());
        };
        fetchCartData();
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchOrderByUser(user._id));
    }, [dispatch]);

    useEffect(() => {
        converCartToOrder(currentCart);
        createOrder((prev) => ({ ...prev, paymentMethod: payment.toUpperCase() }));
    }, [currentCart, payment, checkCoupon]);

    const handleChangePayment = (e) => {
        if (!order.fullname || !order.address || !order.phone) {
            toast.error('Please fill all information');
        } else {
            setPayment(e.target.value);
            createOrder((prev) => ({ ...prev, paymentMethod: payment.toUpperCase() }));
        }
    };

    const converCartToOrder = (cart) => {
        const orderItems = cart.map((item) => ({
            product: item.productId._id,
            quantity: item.quantity,
        }));

        createOrder((prevOrder) => ({
            ...prevOrder,
            items: orderItems,
            totalPrice:
                total_price - total_price * (checkCoupon?.success ? checkCoupon.data.discountPercentage / 100 : 0),
        }));
    };

    const handleOrder = () => {
        if (!order.fullname || !order.address || !order.phone) {
            toast.error('Please fill all information');
        } else {
            dispatch(createAsyncOrder(order)).then(() => {
                setOrderComplete(true);
                setDiscount('');
            });
        }
    };

    const handleChange = (e) => {
        createOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const containerClassName = clsx('overflow-y-auto', {
        'h-[70px]': currentCart.length === 1,
        'h-[130px]': currentCart.length === 2,
        'h-[180px]': currentCart.length >= 3,
    });

    const handleCancelAnnouncement = () => {
        setOrderComplete(false);
        dispatch(resetCheckCoupon());
        dispatch(deleteCart());
        navigate(`/cart/${user._id}`);
    };

    const handleContiueShopping = () => {
        navigate('/');
        dispatch(deleteCart());
        setOrderComplete(false);
        dispatch(resetCheckCoupon());
    };

    const handleChangDiscount = (e) => {
        const discount = e.target.value;
        setDiscount(discount);
    };

    const handleCheckDiscount = () => {
        dispatch(checkAsyncCoupon({ name: discount })).then((result) => {
            if (result.payload.success) {
                toast.success(result.payload.message);
            } else {
                toast.error(result.payload.message);
                setDiscount('');
            }
        });
    };

    return (
        <div className="w-full h-full grid grid-cols-10 my-2 lg:px-[100px] xl:px-[150px] md:px-[80px] sm:px-[40px] px-[20px] gap-x-3 font-price">
            <div className="col-span-6 p-4 border-[1px] border-grey-400 rounded-md">
                <h2 className="text-colorText font-[600] mb-2 text-xl">Shipping address</h2>
                <div className="flex flex-col mb-1">
                    <label>Full name</label>
                    <input
                        className="w-full h-[35px] border-[1px] border-grey-500 rounded-md p-2 text-sm"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        name="fullname"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col mb-1">
                    <label>Phone Number</label>
                    <input
                        className="w-full h-[35px] border-[1px] border-grey-500 rounded-md p-2 text-sm"
                        type="text"
                        required
                        placeholder="Enter your phone numbe(only digits)"
                        name="phone"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col mb-1">
                    <label className="block">Address</label>
                    <input
                        className="w-full h-[35px] border-[1px] border-grey-500 rounded-md p-2 text-sm"
                        type="text"
                        required
                        placeholder="Enter your address"
                        name="address"
                        onChange={handleChange}
                    />
                </div>

                <hr className="border-t-1 border-gray-300 my-4" />

                <h2 className="text-colorText font-[600] mt-2 text-xl">Payment</h2>

                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="cash"
                        name="radio-buttons-group"
                        value={payment}
                        onChange={handleChangePayment}
                    >
                        <FormControlLabel style={{ height: '30px' }} value="cash" control={<Radio />} label="Cash" />
                        <FormControlLabel
                            style={{ height: '30px' }}
                            value="paypal"
                            control={<Radio />}
                            label="Paypal"
                        />
                    </RadioGroup>
                </FormControl>

                <hr className="border-t-1 border-gray-300 my-4" />
                {payment === 'cash' ? (
                    <DialogActions style={{ marginTop: '10px' }}>
                        <Button variant="outlined" fullWidth={true} onClick={handleOrder}>
                            Order
                        </Button>
                    </DialogActions>
                ) : (
                    <>
                        <Paypal handleOrder={handleOrder} checkCoupon={checkCoupon} />
                    </>
                )}
            </div>
            <div className="col-span-4 bg-red-300 p-4 border-[1px] border-grey-400 rounded-md">
                <DialogTitle style={{ padding: 0 }}>Your Order</DialogTitle>
                <hr className="border-t-1 border-gray-300 my-2" />
                <DialogContent style={{ padding: 0 }}>
                    {currentCart ? (
                        <div>
                            <div className={containerClassName}>
                                {currentCart.map((cartItem) => (
                                    <div className="flex justify-between mb-1" key={cartItem?._id}>
                                        <img
                                            src={cartItem?.productId?.image}
                                            className="h-[60px] w-[60px] object-contain mr-2 border-[1px] border-grey-400"
                                        />
                                        <div className="flex flex-col justify-evenly mr-4">
                                            <h2 className="truncate w-[180px] font-price text-colorText">
                                                {cartItem?.productId?.name}
                                            </h2>
                                            <h4 className="font-[200] text-[12px]">x{cartItem?.quantity}</h4>
                                        </div>
                                        <h1>
                                            {formatPrice(
                                                cartItem?.quantity *
                                                    (cartItem?.productId?.price -
                                                        (cartItem?.productId?.price *
                                                            (cartItem?.productId?.discountPercentage || 0)) /
                                                            100 || 1),
                                            )}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                            <hr className="border-t-1 border-gray-300 my-2" />

                            <DialogTitle style={{ padding: '0px' }}>Discount Code</DialogTitle>
                            <div className="flex h-[40px] mt-[10px]">
                                <TextField
                                    label="Discount"
                                    fullWidth={true}
                                    style={{ marginRight: '10px' }}
                                    size="small"
                                    onChange={handleChangDiscount}
                                    value={discount}
                                />
                                <Button
                                    style={{ borderRadius: '4px', border: '1px solid #333' }}
                                    onClick={handleCheckDiscount}
                                >
                                    Apply
                                </Button>
                            </div>

                            <hr className="border-t-1 border-gray-300 my-2" />

                            <div className="flex justify-between mb-3">
                                <h2 className="text-grey-500 font-[500]">Subtotal</h2>
                                <h2 className="text-[#38485a] font-[700] font-price">{formatPrice(total_price)}</h2>
                            </div>

                            {checkCoupon?.success && (
                                <div className="flex justify-between">
                                    <h2 className="text-grey-500 font-[500]">Discount</h2>
                                    <h2 className="text-grey-500 font-[500] font-price">
                                        -{formatPrice((total_price * checkCoupon?.data?.discountPercentage) / 100)}
                                    </h2>
                                </div>
                            )}

                            <hr className="border-t-1 border-gray-300 my-4" />
                            <div className="flex justify-between">
                                <h2 className="text-grey-700 font-[500]">Grand Total</h2>
                                <h2 className="text-[#38485a] font-[800] font-price text-[20px]">
                                    {formatPrice(
                                        total_price -
                                            total_price *
                                                (checkCoupon?.success ? checkCoupon.data.discountPercentage / 100 : 0),
                                    )}
                                </h2>
                            </div>
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </DialogContent>
            </div>

            <div>
                <Dialog open={orderComplete} onClose={handleCancelAnnouncement}>
                    <div className="flex justify-center mt-2">
                        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 70 }} />
                    </div>
                    <DialogContent style={{ paddingTop: 0, paddingBottom: 0 }}>
                        <div className="flex justify-center">
                            <DialogTitle>Thanks for your order!</DialogTitle>
                        </div>
                        <hr className="border-t-1 border-gray-300 my-2 " />

                        <div className="flex flex-col mb-3">
                            <h2 className="text-[#38485a] font-[700] font-price">Transaction Date</h2>
                            <h2 className="text-[#acb6c2] font-[500] font-price">
                                {format(new Date(orderCreated?.createdAt || Date.now()), 'iiii, LLLL dd, yyyy p')}
                            </h2>
                        </div>
                        <div className="flex flex-col mb-3">
                            <h2 className="text-[#38485a] font-[700] font-price">Payment Method</h2>
                            <h2 className="text-[#acb6c2] font-[500] font-price">{orderCreated?.paymentMethod}</h2>
                        </div>
                        <h2 className="text-[#38485a] font-[700] font-price uppercase underline">Track order</h2>

                        <hr className="border-t-1 border-dashed border-gray-300 mt-2 mb-6" />

                        <h2 className="text-[#38485a] font-[700] font-price">Your Order</h2>
                        <div>
                            {currentCart.map((cartItem) => (
                                <div className="flex justify-between mb-1" key={cartItem?._id}>
                                    <img
                                        src={cartItem?.productId?.image}
                                        className="h-[80px] w-[80px] object-contain mr-4 border-[1px] border-grey-400"
                                    />
                                    <div className="flex flex-col justify-evenly mr-4">
                                        <h2 className="truncate w-[360px] font-price text-colorText">
                                            {cartItem?.productId?.name}
                                        </h2>
                                        <h4 className="font-[200] text-[12px]">x{cartItem?.quantity}</h4>
                                    </div>
                                    <h1>
                                        {formatPrice(
                                            cartItem?.quantity *
                                                (cartItem?.productId?.price -
                                                    (cartItem?.productId?.price *
                                                        (cartItem?.productId?.discountPercentage || 0)) /
                                                        100 || 1),
                                        )}
                                    </h1>
                                </div>
                            ))}

                            <hr className="border-t-1 border-dashed border-gray-300 my-4" />
                            {/* 
                            <DialogTitle style={{ padding: '0px' }}>Discount Code</DialogTitle>
                            <div className="flex h-[56px] mt-[16px]">
                                <TextField label="Discount" fullWidth={true} style={{ marginRight: '10px' }} />
                                <Button style={{ borderRadius: '4px', border: '1px solid #333' }}>Apply</Button>
                            </div> */}

                            {/* <hr className="border-t-1 border-gray-300 my-4" /> */}

                            <div className="flex justify-between mb-3">
                                <h2 className="text-[#38485a] font-[500] font-price">Subtotal</h2>
                                <h2 className="text-[#38485a] font-[700] font-price">{formatPrice(total_price)}</h2>
                            </div>

                            {checkCoupon?.success && (
                                <>
                                    <hr className="border-t-1 border-dashed border-gray-300 my-2" />
                                    <div className="flex justify-between mb-3">
                                        <div className="flex items-center">
                                            <h2 className="text-grey-500 font-[400]">Applied discount code</h2>
                                        </div>
                                        <h2 className="text-grey-500 font-[400] font-price bg-gray-200 py-1 px-2 rounded-md">
                                            {checkCoupon.data.discountPercentage}% OFF
                                        </h2>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center">
                                            <h2 className="text-grey-500 font-[400]">Discount</h2>
                                        </div>
                                        <h2 className="text-grey-500 font-[400]">
                                            -{formatPrice((total_price * checkCoupon.data.discountPercentage) / 100)}
                                        </h2>
                                    </div>
                                </>
                            )}
                            <hr className="border-t-1 border-gray-300 my-4" />
                            <div className="flex justify-between">
                                <h2 className="text-grey-700 font-[500]">Grand Total</h2>
                                <h2 className="text-[#38485a] font-[800] font-price text-[20px]">
                                    {formatPrice(orderCreated.totalPrice)}
                                </h2>
                            </div>
                            <hr className="border-t-1 border-gray-300 my-4" />
                        </div>
                    </DialogContent>

                    <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            style={{ backgroundColor: '#1d242d', color: '#f4f4f5' }}
                            onClick={() => handleContiueShopping()}
                        >
                            Continue Shopping
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default CheckoutPage;
