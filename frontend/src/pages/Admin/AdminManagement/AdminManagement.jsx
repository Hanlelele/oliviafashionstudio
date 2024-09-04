import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllUsers,
    getAllUsersStatus,
    fetchAsyncUsers,
    deleteAsyncUser,
    updateAsyncUser,
} from '../../../store/UsersSlice/UsersSlice';
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
import { Loading } from '../../../components';
import { Delete, Edit } from '../../../assets/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminManagement = () => {
    const dispatch = useDispatch();
    const userList = useSelector(getAllUsers);
    const userListStatus = useSelector(getAllUsersStatus);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        dispatch(fetchAsyncUsers());
    }, []);

    if (userListStatus === STATUS.LOADING) {
        return <Loading />;
    }

    const handleDelete = (userId) => {
        setUserIdToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const handleEdit = (user) => {
        setUserToEdit(user);
        setEditDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        toast.success('User deleted successfully', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });

        dispatch(deleteAsyncUser(userIdToDelete)).then(() => dispatch(fetchAsyncUsers()));

        setDeleteDialogOpen(false);
        setUserIdToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setUserIdToDelete(null);
    };

    const handleConfirmEdit = () => {
        dispatch(
            updateAsyncUser({
                userId: userToEdit._id,
                data: userToEdit,
            }),
        ).then(() => dispatch(fetchAsyncUsers()));

        toast.success('Edit successfully', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });

        setEditDialogOpen(false);
        setUserToEdit(null);
    };

    const handleCancelEdit = () => {
        setEditDialogOpen(false);
        setUserToEdit(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
            <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell>{user._id.slice(-6)}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.fullname}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
                                            <Edit className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <Delete className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', zIndex: 1 }}
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        component="div"
                        count={userList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                {/* Delete Dialog */}
                <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>Are you sure you want to delete this user?</DialogContent>
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
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="ID"
                            value={userToEdit?._id || ''}
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Username"
                            value={userToEdit?.username || ''}
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Fullname"
                            value={userToEdit?.fullname || ''}
                            onChange={(e) => setUserToEdit((prevUser) => ({ ...prevUser, fullname: e.target.value }))}
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                        />
                        <TextField
                            label="Email"
                            value={userToEdit?.email || ''}
                            fullWidth={true}
                            style={{ marginBottom: '16px', marginTop: '16px' }}
                            InputProps={{
                                readOnly: true,
                            }}
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
            </div>
        </div>
    );
};

export default AdminManagement;
