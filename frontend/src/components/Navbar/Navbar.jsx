import { Menu } from '../../assets/icons';
import { NavLink } from 'react-router-dom';
import categoryApi from '../../api/categoryApi';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await categoryApi.getAllCategories();
            setCategoryList(categories.data);
        };

        fetchCategories();
    }, []);

    return (
        <div className="h-[56px] flex">
            <div className="max-w-[1200px] w-[1200px] flex mx-0 my-auto">
                <div className="relative flex items-center gap-1" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                    <Menu className="w-[24px] h-[24px] fill-dark hover:opacity-60 cursor-pointer" />
                    <p className="font-body text-[16px] hover:opacity-60 cursor-pointer">All category</p>
                    {isCategoryOpen && (
                        <div className="absolute w-[200px] top-[45px] left-2 bg-grey-300 border">
                            <div className="flex flex-col">
                                {categoryList.map((category, index) => {
                                    return (
                                        <NavLink
                                            to="/"
                                            className="p-2 hover:bg-dark hover:text-white cursor-pointer"
                                            key={index}
                                        >
                                            {category?.category}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
