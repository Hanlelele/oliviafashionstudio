import formatPrice from '../../utils/helpers';
const OrderItem = ({ order }) => {
    const items = order.items;
    return (
        <div className="w-full flex flex-col gap-y-2 px-[10px] py-[20px] my-5 border border-grey-300 rounded-md">
            <div className="flex justify-between items-center">
                <div className="font-body text-[18px] font-[500]">Order ID: {order?._id || '#NoId'}</div>
                <div
                    className={`font-[600] font-body ${
                        order?.status === 'PENDING'
                            ? 'text-primary'
                            : order?.status === 'PROCESSING'
                            ? 'text-primary'
                            : order?.status === 'SHIPPING'
                            ? 'text-orange'
                            : order?.status === 'COMPLETED'
                            ? 'text-green'
                            : order?.status === 'CANCELLED'
                            ? 'text-red'
                            : 'text-dark'
                    }`}
                >
                    {order?.status || 'NO STATUS'}
                </div>
            </div>
            <div>
                <h1 className="text-xl font-[700] mb-2">Customer Information</h1>
                <div className="flex">
                    <h1 className="mr-2 font-[100] font-price text-gray-400">Full Name</h1>
                    <h1>{order?.fullname.toUpperCase()}</h1>
                </div>
                <div className="flex ">
                    <h1 className="mr-2 font-[100] font-price text-gray-400">Phone</h1>
                    <h1>{order?.phone.toUpperCase()}</h1>
                </div>
                <div className="flex">
                    <h1 className="mr-2 font-[100] font-price text-gray-400">Address</h1>
                    <h1>{order?.address}</h1>
                </div>
                <div className="flex">
                    <h1 className="mr-2 font-[100] font-price text-gray-400">Payment Method</h1>
                    <h1>{order?.paymentMethod}</h1>
                </div>
            </div>
            <hr className="border-t-[1px] border-gray-300 my-4" />

            {items.map((item, index) => (
                <div key={index} className="item flex justify-between p-1 bg-white">
                    <div className="flex items-center justify-center gap-x-3">
                        <img
                            src={item?.product?.image || ''}
                            className="w-[60px] h-[60px] border-[1px] border-grey-400"
                            alt={item?.product?.name || 'unknown'}
                        ></img>
                        <div className="flex flex-col justify-evenly">
                            <h2 className="truncate w-[180px] font-price text-colorText">{item?.product?.name}</h2>
                            <h4 className="font-[200] text-[12px]">x{item?.quantity}</h4>
                        </div>
                    </div>
                    <div className="flex items-center text-sm font-price">{item?.product.description}</div>
                    <div className="font-price flex items-center justify-center text-sm">
                        {formatPrice(item?.product?.price)}
                    </div>
                </div>
            ))}
            <hr className="border-t-[1px] border-gray-300 my-4" />
            <div className="font-body flex items-center justify-end pt-3 px-3 gap-x-2">
                Total price: <span className="text-red ">{formatPrice(order.totalPrice || 0)}</span>
            </div>
        </div>
    );
};

export default OrderItem;
