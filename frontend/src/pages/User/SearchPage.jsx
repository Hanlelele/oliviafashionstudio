import { NavLink, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import formatPrice from '../../utils/helpers';
import Dropdown from 'react-select';
import ReactPaginate from 'react-paginate';
import categoryApi from '../../api/categoryApi';

import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading/Loading';
import ProductApi from '../../api/productApi';
import ProductCard from '../../components/ProductCard/ProductCard';

import clsx from 'clsx';
import { toast } from 'react-toastify';

const SearchPage = () => {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(null);
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    let [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search');
    const order = searchParams.get('order');

    //Get product list
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ProductApi.getAllProduct(currentPage, 8, search, minPrice, maxPrice, order);

                setTotalPages(res.totalPages);
                setTotalProducts(res.totalProducts);
                setProducts(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [currentPage, minPrice, maxPrice, search, order]);

    const [priceFilterError, setPriceFilterError] = useState('');
    const [priceRange, setPriceRange] = useState({
        min: '',
        max: '',
    });

    const [priceSortOption, setPriceSortOption] = useState(null);

    const options = [
        { value: 'asc', label: 'Price: Low to high' },
        { value: 'desc', label: 'Price: High to low' },
    ];

    const handlePriceSortOptionChange = (selectedOption) => {
        setSearchParams({ search: search, order: selectedOption.value });
        setPriceSortOption(selectedOption);
    };

    const handleChange = (e) => {
        setPriceFilterError('');

        const newValue = e.target.value;

        if (/^\d*$/.test(newValue)) {
            setMinPrice(newValue);
        } else {
            toast.error('Please enter only numbers.');
        }
    };

    return products ? (
        <div className=" w-fullflex flex-col items-center pb-[100px] px-2">
            <div className="w-full pt-[20px]">
                <div className="View">
                    <div>
                        <i className="text-gray-400"> Tìm kiếm với từ khóa: </i> <i>{search}</i>
                    </div>
                    <div className="sort-bar flex justify-between p-[20px] bg-white border border-grey-300 rounded-md shadow-sm">
                        <div className="flex items-center justify-center">
                            <p className="font-body">{totalProducts} items</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="">
                                <label htmlFor="minInput" className="font-body mr-2 hidden md:inline-block">
                                    Min
                                </label>
                                <input
                                    className="p-[5px] border border-grey-300 rounded-md lg:w-[150px] sm:w-[100px] w-[80px] mr-2 sm:text-[100%] text-[80%]"
                                    name="minInput"
                                    placeholder="Min"
                                    onChange={handleChange}
                                    value={minPrice}
                                    onKeyDown={(e) => handleBlur(e.target.value)}
                                />
                            </div>

                            <div className="">
                                <label htmlFor="maxInput" className="font-body mr-2 hidden md:inline-block">
                                    Max
                                </label>
                                <input
                                    className="p-[5px] border border-grey-300 rounded-md lg:w-[150px] sm:w-[100px] w-[80px] mr-2 "
                                    name="maxInput"
                                    placeholder="Max"
                                    onChange={(e) => {
                                        setPriceFilterError('');
                                        setMaxPrice(e.target.value);
                                    }}
                                    value={maxPrice}
                                    onKeyDown={(e) => handleBlur(e.target.value)}
                                />
                            </div>
                            <p className="font-body pr-2">Sort by</p>
                            <Dropdown
                                options={options}
                                onChange={handlePriceSortOptionChange}
                                placeholder="Price"
                                value={priceSortOption}
                                styles={{
                                    control: (provided) => ({ ...provided, width: 150 }),
                                    indicatorSeparator: () => ({ display: 'none' }),
                                }}
                            />
                        </div>
                    </div>
                    <div className="product-list mt-6 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                        {products?.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                    <div className="mt-[20px] col-span-3">
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="next >"
                            onPageChange={(event) => {
                                setCurrentPage(event.selected + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            pageRangeDisplayed={5}
                            pageCount={totalPages}
                            previousLabel="< prev"
                            renderOnZeroPageCount={null}
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item prev-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item next-item"
                            nextLinkClassName="page-link"
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default SearchPage;
