import { useState, useEffect } from 'react';
import axios from 'axios';
import Slidebar from './Slidebar';
 // Reusing styles from UserManagement for consistency
import './app.css';
import {
  Typography, TextField, InputAdornment, Box, Button, TableContainer,
  Paper, Table, TableHead, TableRow, TableCell, TableBody, useTheme
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

// Based on the C# DTO you provided
interface Asset {
  id: number;
  name: string;
  orginalCapability: string;
  recommendedCapability: string;
  description: string;
}

const CapacityMapping = () => {
  const theme = useTheme();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const recordsPerPage = 7;
  const API_URL = 'http://localhost:5256/api/AI/Aset'; // Corrected API endpoint for assets

  // Reset to the first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  // Apply filtering first
  const filteredAssets = assets.filter(asset => {
    return searchTerm
      ? asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  // Then, apply pagination to the filtered data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(filteredAssets.length / recordsPerPage);

  const nextPage = () => { if (currentPage < nPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };


  return (
    <>
      <Slidebar />
      <div style={{ marginLeft: 70, padding: 24 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           
            <Typography variant="h6" component="div">
              Capacity Maping: {filteredAssets.length}
            </Typography>
          </div>
          <Box>
            <Box>
              <TextField
                label="Search by Name"
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
        </Box>
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="capacity mapping table">
            <TableHead>
              <TableRow sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: theme.palette.mode === 'light' ? '#f0f4f9' : theme.palette.grey[800],
                  fontWeight: 'bold'
                }
              }}>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Id</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Name</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Description</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Orginal Capability</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Recommended Capability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {currentAssets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>0{asset.id}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.name}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.description}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.orginalCapability}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.recommendedCapability}</TableCell>
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
      </div>
    </>
  )
}

export default CapacityMapping
