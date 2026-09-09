import React, { useState, useEffect } from 'react';
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
  orginalDescription: string;
  recommendedDescription: string;
  status: string;
 
}

const EnrichDescription = () => {
  const theme = useTheme();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const recordsPerPage = 7;
  const API_URL = 'http://localhost:5256/api/AI/Aset'; // Corrected API endpoint for assets

  // Reset to the first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

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
  const statusOptions = ["Pilot","Operational", "In-development", "Planned", "Maintain for legal hold", "retired"];

  // Apply filtering first
  const filteredAssets = assets.filter(asset => {
    const statusMatch = statusFilter ? asset.status.toLowerCase() === statusFilter.toLowerCase() : true;
    const searchMatch = searchTerm ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return statusMatch && searchMatch;
  });

  // Then, apply pagination to the filtered data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(filteredAssets.length / recordsPerPage);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value);

  const nextPage = () => { if (currentPage < nPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };


  return (
    <>
      <Slidebar />
      <div style={{ marginLeft: 70, padding: 24 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           
            <Typography variant="h6" component="div">
              Enrich Description: {filteredAssets.length}
            </Typography>
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <select className="filter-select" value={statusFilter} onChange={handleStatusChange}>
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </Box>
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
                // Removed InputLabelProps for default theme handling
              />
            </Box>
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="enrich description table">
            <TableHead>
              <TableRow sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: theme.palette.mode === 'light' ? '#f0f4f9' : theme.palette.grey[800],
                  fontWeight: 'bold'
                }
              }}>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Id</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Name</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Orginal Description</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Recommended Description</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {currentAssets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>0{asset.id}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.name}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.orginalDescription}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.recommendedDescription}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{asset.status}</TableCell>
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

export default EnrichDescription
