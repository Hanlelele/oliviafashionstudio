import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct, fetchAsyncAllProduct } from '../../../stores/ProductSlice/ProductSlice';
import {
    getAllOrder,
    getAllOrderStatus,
    fetchAsyncOrders,
    updateAsyncOrder,
} from '../../../stores/OrderSlice/OrderSlide';
import { STATUS } from '../../../utils/status';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import clsx from 'clsx';
import formatPrice from '../../../utils/helpers';

const STATUSORDER = ['PENDING', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

const statusColors = {
    PENDING: '#FFD700', // Vàng
    PROCESSING: '#00BFFF', // Xanh lam
    SHIPPING: '#1E90FF', // Xanh da trời
    COMPLETED: '#32CD32', // Xanh lá cây
    CANCELLED: '#FF4500', // Đỏ
};

const AdminOrders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(getAllOrder);
    const orderStatus = useSelector(getAllOrderStatus);

    const productList = useSelector(getAllProduct);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetailsDialogOpen, setOrderDetailsDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAsyncAllProduct());
        dispatch(fetchAsyncOrders());
    }, []);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOrderDetailsDialogOpen(true);
    };

    const handleCancelDetails = () => {
        setOrderDetailsDialogOpen(false);
        setSelectedOrder(null);
    };

    const getProductById = (productId, products) => {
        const product = products.find((product) => product._id === productId);
        return product ? product : { name: 'Product not found' };
    };

    const handleChangeStatus = (orderId, newStatus) => {
        dispatch(
            updateAsyncOrder({
                orderId: orderId,
                data: {
                    status: newStatus,
                },
            }),
        ).then(() => dispatch(fetchAsyncOrders()));

        toast.success('Change status successfully');
    };

    return (
        <div className="flex flex-col bg-grey-100 items-center pb-[50px]">
            <h1 className="font-price text-[30px] font-[700]">All Orders</h1>
            <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id.slice(-6)}</TableCell>
                                    <TableCell>{order.fullname.toUpperCase()}</TableCell>
                                    <TableCell>{format(new Date(order?.createdAt), 'iiii, LLLL dd, yyyy p')}</TableCell>
                                    <TableCell>
                                        <FormControl size="small">
                                            <Select
                                                id="status-select"
                                                value={order.status}
                                                MenuProps={{
                                                    MenuListProps: {
                                                        sx: {
                                                            padding: 0,
                                                        },
                                                    },
                                                }}
                                                onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                                                sx={{
                                                    backgroundColor: statusColors[order.status],
                                                    color: '#ffffff',
                                                    width: '144px',
                                                }}
                                            >
                                                {STATUSORDER.map((status, id) => (
                                                    <MenuItem
                                                        key={id}
                                                        value={status}
                                                        sx={{
                                                            backgroundColor: statusColors[status],
                                                            borderRadius: 0,
                                                            width: '144px',
                                                            color: '#ffffff',
                                                            '&:hover': {
                                                                backgroundColor: '#ccc',
                                                                color: 'black',
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor: `${statusColors[status]} !important`,
                                                                '&:hover': {
                                                                    backgroundColor: statusColors[status],
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Order Details Dialog */}
                <Dialog open={orderDetailsDialogOpen} onClose={handleCancelDetails} fullWidth="sm" maxWidth="sm">
                    <div className="flex justify-between">
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogTitle
                            style={{
                                color: selectedOrder?.status ? statusColors[selectedOrder?.status] : 'black',
                            }}
                        >
                            {selectedOrder?.status}
                        </DialogTitle>
                    </div>
                    <DialogContent>
                        {selectedOrder && (
                            <>
                                <div>
                                    <strong>Order ID:</strong> {selectedOrder._id.slice(-6)}
                                </div>
                                <div>
                                    <strong>Full name:</strong> {selectedOrder.fullname.toUpperCase()}
                                </div>

                                <div>
                                    <strong>Phone:</strong> {selectedOrder.phone}
                                </div>

                                <div>
                                    <strong>Address:</strong> {selectedOrder.address}
                                </div>
                                <div>
                                    <strong>Total Price:</strong> {formatPrice(selectedOrder.totalPrice.toFixed(2))}
                                </div>

                                <hr className="border-t-1 border-gray-300 my-4" />

                                <h2 className="text-[#38485a] font-[700] font-price uppercase underline">
                                    Track order
                                </h2>
                                <div className="flex justify-center">
                                    <Table
                                        style={{
                                            width: '400px',
                                            marginTop: '16px',
                                            background: '#f5f5f5',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>Image</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.items.map((product, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{product.product.name}</TableCell>
                                                    <TableCell style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <img
                                                            src={product.product.image}
                                                            alt={product._id}
                                                            width={'80px'}
                                                            height={'60px'}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>
                                                        {product.quantity}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDetails} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminOrders;
