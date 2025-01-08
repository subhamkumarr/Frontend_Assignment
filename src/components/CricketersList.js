import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Pagination,
  Button
} from '@mui/material';
import getPlayers from '../utils/get-players';

const ITEMS_PER_PAGE = 10;

const calculateAge = (dob) => {
  return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
};

const CricketersList = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const savedState = localStorage.getItem('cricketersState');
    if (savedState) {
      const { searchTerm, typeFilter, page, sortField, sortOrder } = JSON.parse(savedState);
      setSearchTerm(searchTerm);
      setTypeFilter(typeFilter);
      setPage(page);
      setSortField(sortField);
      setSortOrder(sortOrder);
    }

    getPlayers().then(data => {
      setPlayers(data);
      setFilteredPlayers(data);
    });
  }, []);

  useEffect(() => {
    let filtered = [...players];

    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(player => player.type === typeFilter);
    }

    filtered.sort((a, b) => {
      let compareA = sortField === 'age' ? calculateAge(a.dob) : a[sortField];
      let compareB = sortField === 'age' ? calculateAge(b.dob) : b[sortField];
      
      return sortOrder === 'asc' ? 
        (compareA > compareB ? 1 : -1) : 
        (compareA < compareB ? 1 : -1);
    });

    setFilteredPlayers(filtered);
    localStorage.setItem('cricketersState', JSON.stringify({
      searchTerm,
      typeFilter,
      page,
      sortField,
      sortOrder
    }));
  }, [players, searchTerm, typeFilter, sortField, sortOrder]);

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const paginatedPlayers = filteredPlayers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '20px' }}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="batsman">Batsman</MenuItem>
          <MenuItem value="bowler">Bowler</MenuItem>
          <MenuItem value="allRounder">All Rounder</MenuItem>
          <MenuItem value="wicketKeeper">Wicket Keeper</MenuItem>
        </Select>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>
                <Button onClick={() => handleSort('rank')}>
                  Rank {sortField === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSort('age')}>
                  Age {sortField === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <Link to={`/player/${player.id}`}>{player.name}</Link>
                </TableCell>
                <TableCell>{player.type}</TableCell>
                <TableCell>{player.points}</TableCell>
                <TableCell>{player.rank}</TableCell>
                <TableCell>{calculateAge(player.dob)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={(e, value) => setPage(value)}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default CricketersList;