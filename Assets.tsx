import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slidebar from './Slidebar';
import './app.css'; // Reusing styles from UserManagement for consistency
import {
  Typography, TextField, InputAdornment, Modal, Box, Button, TableContainer,
  Paper, Table, TableHead, TableRow, TableCell, TableBody, useTheme,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Based on the C# DTO you provided
interface Asset {
  id: number;
  name: string;
  description: string;
  status: string;
  capability: string;
  portfolio: string;
}

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

const Assets = () => {
  const theme = useTheme();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recordsPerPage = 7;
  const API_URL = 'http://localhost:5256/api/AI/Aset'; // Corrected API endpoint for assets

  // Reset to the first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, portfolioFilter, searchTerm]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    axios.get<Asset[]>(API_URL, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    })
      .then(response => {
        setAssets(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the assets!', error);
      });
  };

  // Hardcoded options for filters
  const portfolioOptions = ["Assurance","Security", "Admin", "Monitoring", "Communication","Compliance","Storage","Security",];
  const statusOptions = ["Pilot","Operational", "In-development", "Planned", "Maintain for legal hold", "retired"];

  // Apply filtering first
  const filteredAssets = assets.filter(asset => {
    const statusMatch = statusFilter ? asset.status.toLowerCase() === statusFilter.toLowerCase() : true;
    const portfolioMatch = portfolioFilter ? asset.portfolio.toLowerCase() === portfolioFilter.toLowerCase() : true;
    const searchMatch = searchTerm
      ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return statusMatch && portfolioMatch && searchMatch;
  });

  // Then, apply pagination to the filtered data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(filteredAssets.length / recordsPerPage);

  const handleStatusChange = (e: SelectChangeEvent) => setStatusFilter(e.target.value);
  const handlePortfolioChange = (e: SelectChangeEvent) => setPortfolioFilter(e.target.value);

  const nextPage = () => { if (currentPage < nPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const handleViewClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };


  return (
    <>
      <Slidebar />
      <div style={{ marginLeft: 70, padding: 24 }}>
        <div className="user-management-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           
            <Typography variant="h6" component="div">
              Assets: {filteredAssets.length}
            </Typography>
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select labelId="status-filter-label" value={statusFilter} label="Status" onChange={handleStatusChange}>
                  <MenuItem value=""><em>All Statuses</em></MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="portfolio-filter-label">Portfolio</InputLabel>
                <Select labelId="portfolio-filter-label" value={portfolioFilter} label="Portfolio" onChange={handlePortfolioChange}>
                  <MenuItem value=""><em>All Portfolios</em></MenuItem>
                  {portfolioOptions.map((portfolio, index) => (<MenuItem key={`${portfolio}-${index}`} value={portfolio}>{portfolio}</MenuItem>))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                label="Search Name/Description"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </div>
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="assets table">
            <TableHead>
              <TableRow sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: theme.palette.mode === 'light' ? '#f0f4f9' : theme.palette.grey[800],
                  fontWeight: 'bold'
                }
              }}>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Empire Id</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Name</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Description</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Status</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Capability</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Portfolio</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {currentAssets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>EMP100{asset.id}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.name}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.description}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.status}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.capability}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.portfolio}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary" size="small" onClick={() => handleViewClick(asset)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <Button onClick={prevPage} disabled={currentPage === 1} variant="contained">
            Previous
          </Button>
          <Typography sx={{ mx: 2 }}>
            Page {nPages > 0 ? currentPage : 0} of {nPages}
          </Typography>
          <Button onClick={nextPage} disabled={currentPage >= nPages} variant="contained">
            Next
          </Button>
        </Box>
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="asset-details-modal-title"
        >
          <Box sx={modalStyle}>
            <Typography id="asset-details-modal-title" variant="h6" component="h2">
              Asset Details
            </Typography>
            {selectedAsset && (
              <Box sx={{ mt: 2 }}>
                <Typography><strong>ID:</strong>0{selectedAsset.id}</Typography>
                <Typography><strong>Name:</strong> {selectedAsset.name}</Typography>
                <Typography><strong>Description:</strong> {selectedAsset.description}</Typography>
                <Typography><strong>Status:</strong> {selectedAsset.status}</Typography>
                <Typography><strong>Capability:</strong> {selectedAsset.capability}</Typography>
                <Typography><strong>Portfolio:</strong> {selectedAsset.portfolio}</Typography>
                <Button onClick={handleCloseModal} sx={{ mt: 2 }}>Close</Button>
              </Box>
            )}
          </Box>
        </Modal>
      </div>
    </>
  )
}

export default Assets
