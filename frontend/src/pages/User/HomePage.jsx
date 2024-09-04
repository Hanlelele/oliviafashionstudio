import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import categoryApi from '../../api/categoryApi';
import { Menu } from '../../assets/icons';
import ProductApi from '../../api/productApi';
import { getAllCategory, getAllCategoryStatus, fetchAsyncCategories } from '../../stores/CategorySlice/CategorySlice';

import { STATUS } from '../../utils/status';
import Carousel from 'react-material-ui-carousel';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Bolt } from '@mui/icons-material';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading/Loading';

const HomePage = () => {
    const dispatch = useDispatch();
    const categoryList = useSelector(getAllCategory);
    const categoryListStatus = useSelector(getAllCategoryStatus);
    const [saleProducts, setSaleProducts] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const saleProducts = await ProductApi.getSaleProduct();
                const topProducts = await ProductApi.getTopProduct();
                setSaleProducts(saleProducts.data);
                setTopProducts(topProducts.data);
            } catch (error) {
                console.log(error);
            }
        };
        dispatch(fetchAsyncCategories());
        fetchData();
    }, []);

    if (categoryListStatus === STATUS.LOADING || categoryListStatus === STATUS.FAILED) {
        return <Loading />;
    }

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 5, // optional, default to 1.
        },

        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2, // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
    };

    return saleProducts && topProducts ? (
        <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px] z-0">
            <div className="h-[400px] w-full bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
                <div className="hidden md:block w-1/4">
                    <div className="flex gap-x-[12px] justify-center mt-4">
                        <Menu className="w-[24px] h-[24px] fill-dark hover:opacity-60 cursor-pointer" />
                        <p className="font-body text-[16px] hover:opacity-60 cursor-pointer">CATEGORIES</p>
                    </div>

                    <ul className="categoryBar p-[14px]">
                        {categoryList.map((category, index) => (
                            <NavLink to={`/category/${category?._id}`} key={index}>
                                <li
                                    key={index}
                                    className="py-2 xl:px-[70px] lg:px-[60px] md:px-[30px] font-body text-grey-600 cursor-pointer hover:bg-sky-200 hover:text-dark hover:font-[700] hover:text-lg hover:border-0 hover:rounded-md border-sky-600 border-[1px] mb-1 text-center flex justify-start"
                                >
                                    <img src={category.icon} className="w-[50px] h-[40px] inline-block mr-4" />
                                    <span className="flex justify-center items-center text-[20px] font-[500]">
                                        {category?.category}
                                    </span>
                                </li>
                            </NavLink>
                        ))}
                    </ul>
                </div>

                <div className="ads h-full flex-1 z-0">
                    <Carousel
                        navButtonsAlwaysVisible={true}
                        swipe={false}
                        interval={5000}
                        className="object-fill"
                        IndicatorIcon={
                            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'grey' }} />
                        }
                        indicatorIconButtonProps={{
                            style: {
                                padding: '2px',
                                color: 'blue',
                            },
                        }}
                        activeIndicatorIconButtonProps={{
                            style: {
                                backgroundColor: 'white',
                            },
                        }}
                        indicatorContainerProps={{
                            style: {
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 2,
                            },
                        }}
                    >
                        {categoryList.map((category, index) => (
                            <img
                                className="cursor-pointer object-cover max-w-full max-h-full"
                                src={category.banner}
                                key={index}
                                onClick={() => {
                                    navigate(`/product/category/${category._id}`);
                                }}
                                style={{
                                    width: '100%',
                                    height: '399px',
                                }}
                            ></img>
                        ))}
                    </Carousel>
                </div>
            </div>

            <div className="w-full mt-[20px] ">
                <div className="pt-4 pb-2 flex font-body text-2xl text-red font-bold items-center ml-2">
                    <Bolt sx={{}} />
                    <p>TODAY SPECIAL OFFERS</p>
                </div>
                <MultiCarousel responsive={responsive} itemClass="p-3">
                    {saleProducts.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </MultiCarousel>
            </div>

            <div className="w-full mt-[20px]">
                <div className="pt-4 pb-2 flex font-body text-2xl text-primary font-bold items-center ml-2">
                    <Bolt sx={{}} />
                    <p>Top products</p>
                </div>
                <MultiCarousel responsive={responsive} itemClass="p-3">
                    {topProducts.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </MultiCarousel>
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default HomePage;
