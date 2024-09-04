import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllProduct,
    getAllProductStatus,
    fetchAsyncAllProduct,
    getAllProductNumber,
    addAsyncProduct,
    updateAsyncProduct,
    deleteAsyncProduct,
} from '../../../stores/ProductSlice/ProductSlice';
import {
    getAllCategory,
    getAllCategoryStatus,
    fetchAsyncCategories,
} from '../../../stores/CategorySlice/CategorySlice';
import { STATUS } from '../../../utils/status';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Button,
} from '@mui/material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
} from '@mui/material';
import { Delete, Edit } from '../../../assets/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const categoryList = useSelector(getAllCategory);
    const categoryListStatus = useSelector(getAllCategoryStatus);

    const productList = useSelector(getAllProduct);

    const productListStatus = useSelector(getAllProductStatus);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        id_category: '',
        category: '',
        image: '',
        quantity: '',
        description: '',
        discountPercentage: 0,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        dispatch(fetchAsyncAllProduct({ page, limit: rowsPerPage }));
        dispatch(fetchAsyncCategories());
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = event.target.value;
        setRowsPerPage(parseInt(newRowsPerPage));
        setPage(0);
    };

    //// ADD PRODUCT ////

    const handleAdd = () => {
        setAddDialogOpen(true);
    };

    const handleConfirmAdd = () => {
        if (
            newProduct.name == '' ||
            newProduct.description == '' ||
            newProduct.id_category == '' ||
            newProduct.price <= 0 ||
            newProduct.quantity <= 0 ||
            newProduct.discountPercentage < 0
        ) {
            toast.error('You cannot leave the input blank');
        } else {
            toast.success('Add successfully!');

            dispatch(addAsyncProduct(newProduct)).then(() =>
                dispatch(fetchAsyncAllProduct({ page, limit: rowsPerPage })),
            );
            setAddDialogOpen(false);
            setNewProduct({
                name: '',
                price: 0,
                id_category: '',
                category: '',
                image: '',
                quantity: '',
                description: '',
            });
        }
    };

    const handleCancelAdd = () => {
        setAddDialogOpen(false);
        setNewProduct({
            name: '',
            price: 0,
            id_category: '',
            category: '',
            image: '',
            quantity: '',
            description: '',
        });
    };

    //// EDIT PRODUCT ////

    const handleEdit = (product) => {
        setProductToEdit(product);
        setEditDialogOpen(true);
    };

    const handleConfirmEdit = () => {
        dispatch(
            updateAsyncProduct({
                productId: productToEdit._id,
                data: productToEdit,
            }),
        ).then(() => dispatch(fetchAsyncAllProduct({ page, limit: rowsPerPage })));

        toast.success('Edit successfully!');

        setEditDialogOpen(false);
        setProductToEdit(null);
    };

    const handleCancelEdit = () => {
        setEditDialogOpen(false);
        setProductToEdit(null);
    };

    //// DELETE PRODUCT
    const handleDelete = (productId) => {
        setProductIdToDelete(productId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        toast.success('Delete successfully!');

        dispatch(deleteAsyncProduct(productIdToDelete)).then(() =>
            dispatch(fetchAsyncAllProduct({ page, limit: rowsPerPage })),
        );
        setDeleteDialogOpen(false);
        setProductIdToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setProductIdToDelete(null);
    };

    const handleImageInputChange = (event, dialogType) => {
        const imageFile = event.target.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                if (dialogType === 'edit') {
                    setProductToEdit((prevProduct) => ({
                        ...prevProduct,
                        image: reader.result,
                    }));
                } else if (dialogType === 'add') {
                    setNewProduct((prevProduct) => ({
                        ...prevProduct,
                        image: reader.result,
                    }));
                }
            };
            reader.readAsDataURL(imageFile);
        }
    };

    const getCategoryForProduct = (productId, categories) => {
        const matchingCategory = categories.find((category) => category._id === productId);
        return matchingCategory?.category;
    };

    return (
        <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
            <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Image</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="success" onClick={() => handleAdd()}>
                                        Add
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productList?.data?.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>{product._id.slice(-6)}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{getCategoryForProduct(product.id_category, categoryList)}</TableCell>
                                    <TableCell>
                                        <img src={product.image} id={product._id} width="100px" height="100px" />
                                    </TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.discountPercentage ? product.discountPercentage : 0}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <Delete className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                        </Button>

                                        <Button variant="contained" color="primary" onClick={() => handleEdit(product)}>
                                            <Edit className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', zIndex: 1 }}
                        rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            { label: 'All', value: parseInt(productList?.totalProducts || 0, 10) },
                        ]}
                        component="div"
                        count={parseInt(productList?.totalProducts || 0, 10)}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                {/* Add Dialog */}
                <Dialog open={addDialogOpen} onClose={handleCancelAdd}>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct((prevProduct) => ({ ...prevProduct, name: e.target.value }))}
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                        />
                        <FormControl fullWidth={true} style={{ marginBottom: '16px' }}>
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                value={newProduct.id_category}
                                onChange={(e) =>
                                    setNewProduct((prevProduct) => ({ ...prevProduct, id_category: e.target.value }))
                                }
                            >
                                {categoryList.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Price"
                            value={newProduct.price || 0}
                            onChange={(e) =>
                                setNewProduct((prevProduct) => ({ ...prevProduct, price: Number(e.target.value) }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />
                        <TextField
                            label="Quantity"
                            value={newProduct.quantity || 0}
                            onChange={(e) =>
                                setNewProduct((prevProduct) => ({ ...prevProduct, quantity: Number(e.target.value) }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />

                        <TextField
                            label="Discount"
                            value={newProduct.discountPercentage || 0}
                            onChange={(e) =>
                                setNewProduct((prevProduct) => ({
                                    ...prevProduct,
                                    discountPercentage: Number(e.target.value),
                                }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />

                        <TextField
                            label="Description"
                            value={newProduct.description || ''}
                            onChange={(e) =>
                                setNewProduct((prevProduct) => ({ ...prevProduct, description: e.target.value }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />
                        <input type="file" accept="image/*" onChange={(e) => handleImageInputChange(e, 'add')} />
                        {newProduct?.image && <img src={newProduct.image} alt="Preview" width="100%" height="auto" />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelAdd} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmAdd} color="secondary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onClose={handleCancelEdit}>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={productToEdit?.name || ''}
                            onChange={(e) =>
                                setProductToEdit((prevProduct) => ({ ...prevProduct, name: e.target.value }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                        />
                        <FormControl fullWidth={true} style={{ marginBottom: '16px' }}>
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                value={productToEdit?.id_category || ''}
                                onChange={(e) =>
                                    setProductToEdit((prevProduct) => ({ ...prevProduct, id_category: e.target.value }))
                                }
                            >
                                {categoryList.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Price"
                            value={productToEdit?.price || 0}
                            onChange={(e) =>
                                setProductToEdit((prevProduct) => ({ ...prevProduct, price: Number(e.target.value) }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />
                        <TextField
                            label="Quantity"
                            value={productToEdit?.quantity || 0}
                            onChange={(e) =>
                                setProductToEdit((prevProduct) => ({
                                    ...prevProduct,
                                    quantity: Number(e.target.value),
                                }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />

                        <TextField
                            label="Discount"
                            value={productToEdit?.discountPercentage || 0}
                            onChange={(e) =>
                                setProductToEdit((prevProduct) => ({
                                    ...prevProduct,
                                    discountPercentage: Number(e.target.value),
                                }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />

                        <TextField
                            label="Description"
                            value={productToEdit?.description || ''}
                            onChange={(e) =>
                                setProductToEdit((prevProduct) => ({ ...prevProduct, description: e.target.value }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px' }}
                        />
                        <input type="file" accept="image/*" onChange={(e) => handleImageInputChange(e, 'edit')} />
                        {productToEdit?.image && (
                            <img src={productToEdit.image} alt="Preview" width="100%" height="auto" />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelEdit} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmEdit} color="secondary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>Are you sure you want to delete this product?</DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminProducts;
