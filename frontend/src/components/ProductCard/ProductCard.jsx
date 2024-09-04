import { NavLink } from 'react-router-dom';
import formatPrice from '../../utils/helpers';
import clsx from 'clsx';
const ProductCard = ({ product }) => {
    const priceAfterSale = (product) => {
        let priceAfterSale;
        if (product) {
            if (product?.discountPercentage > 0) {
                priceAfterSale = formatPrice(product?.price - product?.price * (product?.discountPercentage / 100));
            } else {
                priceAfterSale = formatPrice(product.price);
            }
        }
        return priceAfterSale;
    };

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <NavLink
            to={`/product/${product?._id}`}
            className="item-card grid lg:grid-rows-[2fr_1fr] sm:grid-rows-[1.5fr_0.5fr]
                border border-grey-300 shadow-md cursor-pointer transition-transform hover:scale-105"
            onClick={handleClick}
        >
            {product.discountPercentage !== null && product.discountPercentage > 0 && (
                <>
                    <span className="absolute w-[34px] h-[45px] block z-10 bg-[#D01345] text-center text-[14px] text-white">
                        {product.discountPercentage}% OFF
                    </span>
                </>
            )}

            <div className="img-container border-b-[1px] flex justify-center h-[200px]">
                <img className="h-full object-cover relative" src={product?.image || ''} />
            </div>
            <div className="p-[8px] box-border grid grid-rows-[1fr_1fr_1fr]">
                <div className="font-body text-colorText text-[16px] font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                    {product?.name || 'No name'}
                </div>
                <div className="font-price flex text-[16px] font-[600] items-center justify-between">
                    <span
                        className={clsx(
                            `mr-2 text-center`,
                            product.discountPercentage > 0 ? 'text-[#D01345]' : 'text-colorText',
                        )}
                    >
                        {priceAfterSale(product)}
                    </span>

                    {product.discountPercentage !== null && product.discountPercentage > 0 && (
                        <>
                            <span className="line-through text-[16px] pr-5">{formatPrice(product.price)}</span>
                        </>
                    )}
                    {/* {product?.discountPercentage && (
                        <>
                            <span className="line-through text-[16px] pr-5">{formatPrice(product.price)}</span>
                            <span className="border-l-[1px] h-[12px] border-gray-600"></span>
                            <div className="">
                                <span className="ml-2 text-[#D01345] font-body text-[16px] font-[500] border-0 p-[4px]">
                                    {product.discountPercentage}% OFF
                                </span>
                            </div>
                        </>
                    )} */}
                </div>
                <div className="flex justify-between items-center">
                    {/* <div>{handlePriceRender()}</div> */}
                    <div className="font-body text-[12px] text-grey-500">{product?.quantity ?? 0} stock</div>
                </div>
            </div>
        </NavLink>
    );
};

export default ProductCard;
