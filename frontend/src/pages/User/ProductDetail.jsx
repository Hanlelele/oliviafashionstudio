import { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { Review, Sold, Cart } from '../../assets/icons';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductApi from '../../api/productApi';
import NumberInput from '../../components/NumberInput/NumberInput';
import { toast } from 'react-toastify';

import { useSelector, useDispatch } from 'react-redux';
import { addToCart, fetchCart } from '../../stores/CartSlice/CartSlice';
import formatPrice from '../../utils/helpers';

import Loading from '../../components/Loading/Loading';

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [zoomImage, setZoomImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result_1 = await ProductApi.getProductByID(id);
                const result_2 = await ProductApi.getRelatedProducts(id);
                setProduct(result_1.data);
                setRelatedProducts(result_2.data);
                setZoomImage(result_1.data.image);
                setQuantity(1);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (product && product.image) {
            setZoomImage(product.image);
        }
    }, [zoomImage]);

    const handlePriceRender = () => {
        if (product && product?.discountPercentage) {
            if (product.discountPercentage > 0) {
                return (
                    <>
                        <div className="oldPrice font-body line-through text-grey-800 text-[18px]">
                            {formatPrice(product.price)}
                        </div>
                        <div className="newPrice font-body text-[30px] text-red">
                            {formatPrice(product?.price - product?.price * (product?.discountPercentage / 100))}
                        </div>
                        <div className="discount-percentage h-0.5 flex items-center">
                            <span className="text-white font-body font-[600] bg-red p-1">
                                {product?.discountPercentage}% OFF
                            </span>
                        </div>
                    </>
                );
            } else {
                return (
                    <>
                        <div className="newPrice font-body text-[30px] text-red">{formatPrice(product?.price)}</div>
                    </>
                );
            }
        } else {
            return (
                <div className="newPrice font-body text-[30px] text-red font-[500]">{formatPrice(product?.price)}</div>
            );
        }
    };

    const handleQuantityInput = (e, newValue) => {
        setQuantity(newValue);
    };

    const handleAddToCart = () => {
        if (!user.isAuthenticated) {
            toast.error('Please login first!');
        } else {
            dispatch(
                addToCart({
                    productId: product._id,
                    quantity: quantity,
                }),
            )
                .then(() => {
                    dispatch(fetchCart());
                })
                .catch((error) => {
                    toast.error('Error adding to cart');
                });
        }
    };

    const handleBuyNow = () => {
        if (!user.isAuthenticated) {
            toast.error('Please login first!');
        } else {
            dispatch(
                addToCart({
                    productId: product._id,
                    quantity: quantity,
                }),
            )
                .then(() => {
                    dispatch(fetchCart());
                    navigate('/checkout');
                })
                .catch((error) => {
                    toast.error('Error adding to cart');
                });
        }
    };

    return product ? (
        <div className="w-full flex flex-col items-center pb-[100px]">
            <div className="w-full flex flex-col justify-center items-center">
                <div className="product-section mt-[20px] w-full sm:grid gap-x-[18px] grid-cols-12 p-[20px] min-h-[580px] bg-white border border-grey-300 rounded-[6px]">
                    <div className="image-section col-span-5 ">
                        <div className=" h-[380px] border rounded-[6px] p-1 flex justify-center items-center">
                            <img className="zoom-item object-fit h-full" src={zoomImage} />
                        </div>

                        <div className="other-imgs mt-[20px] grid grid-cols-5 gap-x-[9px]">
                            <img
                                className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                                src={product?.image || ''}
                                onClick={() => setZoomImage(product?.image || '')}
                            />
                            <img
                                className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                                src={product?.image || ''}
                                onClick={() => setZoomImage(product?.image || '')}
                            />
                            <img
                                className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                                src={product?.image || ''}
                                onClick={() => setZoomImage(product?.image || '')}
                            />
                            <img
                                className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                                src={product?.image || ''}
                                onClick={() => setZoomImage(product?.image || '')}
                            />
                            <img
                                className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                                src={product?.image || ''}
                                onClick={() => setZoomImage(product?.image || '')}
                            />
                        </div>
                    </div>
                    <div className="info-section col-span-7">
                        <div className="product-name pb-2 pt-2 font-body text-2xl font-[600]">
                            {product.name ?? 'unknown'}
                        </div>

                        <div className="price-section bg-grey-100 px-[20px] py-[15px] flex items-center gap-x-[10px]">
                            {handlePriceRender()}

                            {product.quantity === 0 && (
                                <div className="h-0.5 flex items-center">
                                    <span className="text-white font-body font-[600] bg-red p-1">SOLD OUT</span>
                                </div>
                            )}
                        </div>
                        <div className="additional-info p-[20px] flex flex-col gap-y-[16px] border-b-2">
                            <div className="description grid grid-cols-[3fr_9fr]">
                                <div className="font-body text-grey-500">Description: </div>
                                <div className="font-body">{product?.description ?? 'No description'}</div>
                            </div>
                            <div className="category grid grid-cols-[3fr_9fr]">
                                <div className="font-body text-grey-500">Category: </div>
                                <div>{product?.category ?? 'No category'}</div>
                            </div>
                            <div className="warranty grid grid-cols-[3fr_9fr]">
                                <div className="font-body text-grey-500">Brand: </div>
                                <div>{product?.brand ?? 'Unknown'}</div>
                            </div>
                            <div className="warranty grid grid-cols-[3fr_9fr]">
                                <div className="font-body text-grey-500">Warranty: </div>
                                <div>{product?.warranty ?? '2 years full warranty'}</div>
                            </div>
                        </div>
                        {product?.quantity !== 0 ? (
                            <div className="quantity-selection px-[20px] pt-[20px] grid grid-cols-[3fr_9fr]">
                                <div className="font-body text-grey-500">Quantity: </div>
                                <div className="quantity-input flex items-center gap-x-[20px]">
                                    <NumberInput
                                        onChange={(e, newValue) => handleQuantityInput(e, newValue)}
                                        maxValue={product?.quantity ?? undefined}
                                        identifier={product?._id}
                                    />
                                    <div className="stock font-body text-grey-500 select-none">
                                        {product?.quantity} pieces available
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {product?.quantity !== 0 ? (
                            <div className="purchase-section mx-[20px] mt-[20px] flex items-center justify-around">
                                <div
                                    className="add-to-cart-button flex items-center gap-x-2 py-[15px] md:px-[20px] px-[10px] w-[163px]
              border border-grey-300 shadow-sm rounded-[6px] transition-transion hover:scale-105 cursor-pointer hover:bg-grey-100"
                                    onClick={handleAddToCart}
                                >
                                    <Cart className="fill-primary" />
                                    <span className="text-primary font-body font-[500] select-none">Add To Cart</span>
                                </div>

                                <div
                                    className="buy-now-button flex items-center justify-center gap-x-2 py-[15px] px-[20px] bg-primary w-[163px]
              border border-primary shadow-sm rounded-[6px] transition-transion hover:scale-105 cursor-pointer hover:opacity-90"
                                    onClick={handleBuyNow}
                                >
                                    <span className="text-white font-body font-[500] select-none">Buy Now</span>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <div className="related-items-section mt-[20px] w-full flex flex-col">
                    <div className="font-body font-[600] text-[20px] pt-[20px] pb-[10px] select-none">
                        Related products
                    </div>
                    <div className="product grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                        {relatedProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default ProductDetail;
