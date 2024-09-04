import { useDispatch, useSelector } from 'react-redux';
import {
    getTotalOrder,
    getTotalRevenue,
    getTotalProduct,
    fetchAsyncTotalOrder,
    fetchAsyncTotalRevenue,
    fetchAsyncTotalProduct,
} from '../../../stores/Analysis/AnalysisSlice';
import formatPrice from '../../../utils/helpers';
import { TotalPrice, TotalOrder, TotalProduct } from '../../../assets/icons';
import { useEffect } from 'react';

const AdminHome = () => {
    const totalOrder = useSelector(getTotalOrder);
    const totalRevenue = useSelector(getTotalRevenue);
    const totalProduct = useSelector(getTotalProduct);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAsyncTotalOrder());
        dispatch(fetchAsyncTotalRevenue());
        dispatch(fetchAsyncTotalProduct());
    }, []);

    return (
        <>
            <div className="flex mt-6 px-20 gap-3">
                <div className="w-full lg:w-1/3 bg-white border-[1px] border-gray-300 rounded-sm shadow-md">
                    <div className="shadow-sm p-4">
                        <article className="flex">
                            <div className="rounded-full bg-[#cce5ff] w-[50px] h-[50px] flex justify-center items-center">
                                <TotalPrice className="fill-primary w-[20px] h-[20px]" />
                            </div>
                            <div className="flex flex-col justify-center items-start pl-3 font-price">
                                <h6 className="mb-1 font-[700]">Total Sales</h6>
                                <span>{formatPrice(totalRevenue)} VND</span>
                            </div>
                        </article>
                    </div>
                </div>
                <div className="w-full lg:w-1/3 bg-white border-[1px] border-gray-300 rounded-sm shadow-md">
                    <div className="shadow-sm p-4">
                        <article className="flex">
                            <div className="rounded-full bg-[#d4edda] w-[50px] h-[50px] flex justify-center items-center">
                                <TotalOrder className="fill-green w-[20px] h-[20px]" />
                            </div>
                            <div className="flex flex-col justify-center items-start pl-3 font-price">
                                <h6 className="mb-1 font-[700]">Total Orders</h6>
                                <span>{totalOrder}</span>
                            </div>
                        </article>
                    </div>
                </div>
                <div className="w-full lg:w-1/3 bg-white border-[1px] border-gray-300 rounded-sm shadow-md">
                    <div className="shadow-sm p-4">
                        <article className="flex">
                            <div className="rounded-full bg-[#fff3cd] w-[50px] h-[50px] flex justify-center items-center">
                                <TotalProduct className="fill-[#856404] w-[20px] h-[20px]" />
                            </div>
                            <div className="flex flex-col justify-center items-start pl-3 font-price">
                                <h6 className="mb-1 font-[700]">Total products</h6>
                                <span>{totalProduct}</span>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
            <div className="flex px-20 py-4 gap-4 justify-center">
                <div className="flex-1">
                    <article>
                        <iframe
                            style={{
                                background: '#FFFFFF',
                                border: 'none',
                                borderRadius: '2px',
                                boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
                                width: '100%',
                                height: '400px',
                            }}
                            src="https://charts.mongodb.com/charts-myshop-gulxxik/embed/charts?id=66b626ea-7c15-4fe9-84d3-7d7b7ca9f5bf&maxDataAge=3600&theme=light&autoRefresh=true"
                        ></iframe>
                    </article>
                </div>

                <div className="flex-1">
                    <iframe
                        style={{
                            background: '#FFFFFF',
                            border: 'none',
                            borderRadius: '2px',
                            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
                            width: '100%',
                            height: '400px',
                        }}
                        src="https://charts.mongodb.com/charts-myshop-gulxxik/embed/charts?id=66b628fd-ed35-4df1-8e0f-e2c43cbd1f7a&maxDataAge=3600&theme=light&autoRefresh=true"
                    ></iframe>
                </div>
            </div>
        </>
    );
};
export default AdminHome;
