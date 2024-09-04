import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllCoupons,
    addAsyncCoupon,
    fetchAsyncCoupons,
    deleteAsyncCoupon,
    updateAsyncCoupon,
} from '../../../stores/CouponSlice/CouponSlice';
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
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import 'react-multi-carousel/lib/styles.css';
import { Delete, Edit } from '../../../assets/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const AdminCoupons = () => {
    const dispatch = useDispatch();
    const couponList = useSelector(getAllCoupons);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [couponIdToDelete, setCouponIdToDelete] = useState(null);
    const [couponToEdit, setCouponToEdit] = useState(null);
    const [newCoupon, setNewCoupon] = useState({
        name: '',
        discountPercentage: '',
    });

    useEffect(() => {
        dispatch(fetchAsyncCoupons());
    }, []);

    const handleDelete = (couponId) => {
        setCouponIdToDelete(couponId);
        setDeleteDialogOpen(true);
    };

    const handleEdit = (coupon) => {
        setCouponToEdit(coupon);
        setEditDialogOpen(true);
    };

    const handleAdd = () => {
        setAddDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        toast.success('Delete successfully');

        dispatch(deleteAsyncCoupon(couponIdToDelete)).then(() => dispatch(fetchAsyncCoupons()));
        setDeleteDialogOpen(false);
        setCouponIdToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setCategoryIdToDelete(null);
    };

    const handleConfirmEdit = () => {
        dispatch(
            updateAsyncCoupon({
                couponId: couponToEdit._id,
                data: couponToEdit,
            }),
        ).then(() => dispatch(fetchAsyncCoupons()));

        toast.success('Edit successfully');

        setEditDialogOpen(false);
        setCategoryToEdit(null);
    };

    const handleCancelEdit = () => {
        setEditDialogOpen(false);
        setCategoryToEdit(null);
    };

    const handleConfirmAdd = () => {
        if (newCoupon.name == '' || newCoupon.discountPerentage == '') {
            toast.error('You cannot leave the input blank');
        } else {
            toast.success('Add successfully');

            dispatch(addAsyncCoupon(newCoupon)).then(() => dispatch(fetchAsyncCoupons()));

            setAddDialogOpen(false);
            setNewCoupon({
                name: '',
                discountPercentage: '',
            });
        }
    };

    const handleCancelAdd = () => {
        setAddDialogOpen(false);
        setNewCategory({
            name: '',
            discountPercentage: '',
        });
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
                                <TableCell>Discount (%)</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="success" onClick={() => handleAdd()}>
                                        Add
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {couponList.map((coupon, index) => (
                                <TableRow key={index} className="hover:bg-gray-100">
                                    <TableCell>{coupon._id.slice(-6)}</TableCell>
                                    <TableCell>{coupon.name}</TableCell>
                                    <TableCell>{coupon.discountPercentage}%</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(coupon._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} className="w-[20px] h-[20px]" />
                                        </Button>

                                        <Button variant="contained" color="primary" onClick={() => handleEdit(coupon)}>
                                            <Edit className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Delete Dialog */}
                <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>Are you sure you want to delete this coupon?</DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onClose={handleCancelEdit}>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={couponToEdit?.name || ''}
                            onChange={(e) => setCouponToEdit((prevCoupon) => ({ ...prevCoupon, name: e.target.value }))}
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                        />

                        <TextField
                            label="Discount (%)"
                            value={couponToEdit?.discountPercentage || ''}
                            onChange={(e) =>
                                setCouponToEdit((prevCoupon) => ({ ...prevCoupon, discountPercentage: e.target.value }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                        />
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

                {/* Add Dialog */}
                <Dialog open={addDialogOpen} onClose={handleCancelAdd}>
                    <DialogTitle>Add Coupon</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={newCoupon.name}
                            onChange={(e) => setNewCoupon((prevCoupon) => ({ ...prevCoupon, name: e.target.value }))}
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                        />
                        <TextField
                            label="Discount (%)"
                            value={newCoupon.discountPercentage}
                            onChange={(e) =>
                                setNewCoupon((prevCoupon) => ({ ...prevCoupon, discountPercentage: e.target.value }))
                            }
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                        />
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
            </div>
        </div>
    );
};

export default AdminCoupons;
