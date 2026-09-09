

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme,
    CircularProgress, Typography, Button, Box, Modal, TextField, Select,
    MenuItem, FormControl, InputLabel, SelectChangeEvent
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { User } from './user';
import Slidebar from './Slidebar';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', place: '', privilege: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const privilegeOptions = ['Admin', 'Report viewer', 'User'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null); // Clear previous errors
        const response = await axios.get<User[]>('http://localhost:5256/api/AI');
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError('Failed to fetch users from the backend. Please check the connection and try again.');
        setUsers([]); // Clear any existing user data
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDeleteModal = (id: number) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete === null) return;

    try {
      await axios.delete(`http://localhost:5256/api/AI/${userToDelete}`);
      setUsers(users.filter((user) => user.id !== userToDelete));
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };
  
  const handleOpenEditModal = (user: User) => {
    setCurrentUser({ ...user });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentUser(null);
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;

    try {
      await axios.put(`http://localhost:5256/api/AI/${currentUser.id}`, currentUser);
      setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
      handleCloseEditModal();
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewUser({ name: '', email: '', place: '', privilege: '', password: '' }); // Reset form
  };

  const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post<User>('http://localhost:5256/api/AI', newUser);
      setUsers([...users, response.data]); // Add new user to the list
      handleCloseAddModal();
    } catch (err) {
      console.error('Failed to create user:', err);
      setError('Failed to create user. Please check the data and try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.privilege.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
    if (currentUser) {
      const { name, value } = e.target;
      setCurrentUser({
        ...currentUser,
        [name]: value,
      });
    }
  };
  const handleNewUserSelectChange = (e: SelectChangeEvent) => {
    if (newUser) {
      setNewUser({
        ...newUser,
        privilege: e.target.value,
      });
    }
  };

  return (
    <>
    <Slidebar />
    <div style={{ marginLeft: 70, padding: 24 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, mr: 2 }}>
            User Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="subtitle1" color="text.secondary">
              ({filteredUsers.length} {searchTerm ? 'users found' : 'total users'})
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
                Add User
            </Button>
            <TextField
                label="Search by Privilege"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </Box>

        <TableContainer component={Paper} elevation={3}>
          {error && <Typography color="error" sx={{ p: 2 }}>{error}</Typography>}
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow sx={{ 
                '& .MuiTableCell-head': { 
                  backgroundColor: theme.palette.mode === 'light' ? '#f0f4f9' : theme.palette.grey[800], 
                  fontWeight: 'bold' 
                } 
              }}>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>ID</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Name</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Email</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Place</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Privilege</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.id}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.name}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.email}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.place}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.privilege}</TableCell>
               
                  <TableCell align="center">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      style={{ marginRight: 8 }}
                      onClick={() => handleOpenEditModal(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="small"
                      onClick={() => handleOpenDeleteModal(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
      )}
      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-user-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="edit-user-modal-title" variant="h6" component="h2">
            Edit User
          </Typography>
          {currentUser && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField fullWidth margin="normal" label="Name" name="name" value={currentUser.name} onChange={handleInputChange} />
              <TextField fullWidth margin="normal" label="Email" name="email" value={currentUser.email} onChange={handleInputChange} />
              <TextField fullWidth margin="normal" label="Place" name="place" value={currentUser.place} onChange={handleInputChange} />
              <FormControl fullWidth margin="normal">
                <InputLabel id="edit-privilege-label">Privilege</InputLabel>
                <Select labelId="edit-privilege-label" id="privilege" name="privilege" value={currentUser.privilege} label="Privilege" onChange={handleInputChange}>
                  {privilegeOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField fullWidth margin="normal" label="Password" name="password" type="password" value={currentUser.password || ''} onChange={handleInputChange} />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseEditModal} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdateUser}>
                  Save
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
      <Modal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        aria-labelledby="add-user-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="add-user-modal-title" variant="h6" component="h2">
            Add New User
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField fullWidth margin="normal" label="Name" name="name" value={newUser.name} onChange={handleNewUserInputChange} />
            <TextField fullWidth margin="normal" label="Email" name="email" value={newUser.email} onChange={handleNewUserInputChange} />
            <TextField fullWidth margin="normal" label="Place" name="place" value={newUser.place} onChange={handleNewUserInputChange} />
            <FormControl fullWidth margin="normal">
              <InputLabel id="add-privilege-label">Privilege</InputLabel>
              <Select labelId="add-privilege-label" id="privilege" name="privilege" value={newUser.privilege} label="Privilege" onChange={handleNewUserSelectChange}>
                <MenuItem value=""><em>None</em></MenuItem>
                {privilegeOptions.map(option => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField fullWidth margin="normal" label="Password" name="password" type="password" value={newUser.password} onChange={handleNewUserInputChange} />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseAddModal} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleCreateUser}>
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-user-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="delete-user-modal-title" variant="h6" component="h2">
            Confirm Delete ?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDeleteModal} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
    </>
  );
};

export default UserManagement;