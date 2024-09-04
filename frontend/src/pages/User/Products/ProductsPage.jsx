import { NavLink, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu } from '../../../assets/icons';
import formatPrice from '../../../utils/helpers';
import Dropdown from 'react-select';
import ReactPaginate from 'react-paginate';
import categoryApi from '../../../api/categoryApi';
import './ProductsPage.css';
import { useDispatch, useSelector } from 'react-redux';
import ProductApi from '../../../api/productApi';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Loading from '../../../components/Loading/Loading';
import clsx from 'clsx';
import { toast } from 'react-toastify';
const ProductsPage = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(null);
    let [searchParams, setSearchParams] = useSearchParams();

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const order = searchParams.get('order');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ProductApi.getAllProductOfCategory(
                    categoryId,
                    currentPage,
                    6,
                    minPrice,
                    maxPrice,
                    order,
                );
                setTotalPages(res.totalPages);
                setTotalProducts(res.totalProducts);
                setProducts(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [currentPage, categoryId, searchParams]);

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
        setSearchParams({ order: selectedOption.value });
        setPriceSortOption(selectedOption);
    };

    const handleFilterPriceRange = () => {
        if (priceRange.min === null && priceRange.max === null) {
            window.scroll(0, 0);
            setSearchParams({ minPrice: priceRange.min, maxPrice: priceRange.max });
        } else if (Number(priceRange.min) <= Number(priceRange.max)) {
            setSearchParams({ minPrice: priceRange.min, maxPrice: priceRange.max });
        } else {
            setPriceFilterError('Please enter a valid price range');
        }
    };

    const handleClearAll = () => {
        setSearchParams({});
        setPriceRange({ min: '', max: '' });
        setPriceFilterError('');
        setPriceSortOption(null);
    };

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await categoryApi.getAllCategories();
                setCategoryList(results.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return products ? (
        <div className=" w-fullflex flex-col items-center pb-[100px] px-2">
            <div className="w-full grid grid-cols-[minmax(0,230px)_10fr] pt-[20px] gap-x-[28px]">
                <div className="Filter flex flex-col gap-y-[20px]">
                    <div className="AllCategories flex flex-col border-t">
                        <div className="flex gap-x-[12px] justify-center mt-4">
                            <Menu className="w-[24px] h-[24px] fill-dark hover:opacity-60 cursor-pointer" />
                            <p className="font-body text-[16px] hover:opacity-60 cursor-pointer">CATEGORIES</p>
                        </div>
                        <div className="categoryBar p-[14px] flex flex-col">
                            {categoryList.map((category, index) => (
                                <NavLink
                                    to={`/category/${category?._id}`}
                                    key={index}
                                    className={clsx(
                                        categoryId === category._id && 'bg-sky-200 text-dark text-lg font-bold',
                                        `pt-3 pb-3 font-body text-grey-600 cursor-pointer hover:bg-sky-200 hover:text-dark hover:text-lg hover:border-0 hover:rounded-md border-sky-600 border-[1px] mb-1 text-center`,
                                    )}
                                >
                                    <img src={category.icon} className="w-[20px] h-[30px] inline-block mr-2" />
                                    <span className="w-[40px]">{category?.category}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="PriceFilter flex flex-col border-t">
                        <p className="pt-[12px] pb-[12px] font-body text-dark font-[600]">Price range</p>
                        <div className="grid grid-cols-2 gap-x-1">
                            <div className="flex flex-col">
                                <label htmlFor="minInput" className="font-body">
                                    Min
                                </label>
                                <input
                                    className="p-[5px] border border-grey-300 rounded-md"
                                    name="minInput"
                                    placeholder="0"
                                    onChange={(e) => {
                                        setPriceFilterError('');
                                        setPriceRange({ ...priceRange, min: e.target.value });
                                    }}
                                    value={priceRange.min}
                                    onKeyDown={(e) => {
                                        const allowedKeys = [
                                            'Backspace',
                                            'ArrowUp',
                                            'ArrowDown',
                                            'ArrowLeft',
                                            'ArrowRight',
                                            'Delete',
                                            'Tab',
                                            'Enter',
                                        ];
                                        if (!/\d/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                            toast.error('Please enter only numbers.');
                                        }
                                    }}
                                ></input>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="maxInput" className="font-body">
                                    Max
                                </label>
                                <input
                                    className="p-[5px] border border-grey-300 rounded-md"
                                    name="maxInput"
                                    placeholder="999999999"
                                    onChange={(e) => {
                                        setPriceFilterError('');
                                        setPriceRange({ ...priceRange, max: e.target.value });
                                    }}
                                    value={priceRange.max}
                                    onKeyDown={(e) => {
                                        const allowedKeys = [
                                            'Backspace',
                                            'ArrowUp',
                                            'ArrowDown',
                                            'ArrowLeft',
                                            'ArrowRight',
                                            'Delete',
                                            'Tab',
                                            'Enter',
                                        ];
                                        if (!/\d/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                            toast.error('Please enter only numbers.');
                                        }
                                    }}
                                ></input>
                            </div>
                        </div>
                        {priceFilterError && (
                            <div className="pt-[10px] text-red font-body text-sm">{priceFilterError}</div>
                        )}
                    </div>
                    <div
                        className="h-[40px] w-full bg-white border border-grey-300 rounded-md flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
                        onClick={handleFilterPriceRange}
                    >
                        <span className="text-primary font-body font-[500] ">Apply</span>
                    </div>

                    <div
                        className="h-[40px] w-full bg-primary border border-grey-300 rounded-md flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
                        onClick={handleClearAll}
                    >
                        <span className="text-white font-body font-[500] ">Clear All</span>
                    </div>
                </div>
                <div className="View">
                    <div className="sort-bar flex justify-between p-[20px] bg-white border border-grey-300 rounded-md shadow-sm">
                        <div className="flex items-center justify-center">
                            <p className="font-body">{totalProducts} items</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="font-body pr-2">Sort by</p>
                            <Dropdown
                                options={options}
                                onChange={handlePriceSortOptionChange}
                                placeholder="Price"
                                value={priceSortOption}
                                styles={{
                                    control: (provided) => ({ ...provided, width: 200 }),
                                    indicatorSeparator: () => ({ display: 'none' }),
                                }}
                            />
                        </div>
                    </div>
                    <div className="product-list mt-6 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[20px]">
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

export default ProductsPage;
