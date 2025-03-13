import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Select,
  MenuItem,
  Pagination,
  Paper,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const RolesPage = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: "Administrator", access: "1 section(s)", status: "Active", notes: "" },
    { id: 2, name: "Customer", access: "1 section(s)", status: "Active", notes: "" },
    { id: 3, name: "Data scientist", access: "1 section(s)", status: "Active", notes: "" },
    { id: 4, name: "EC Engineer", access: "1 section(s)", status: "Active", notes: "" },
    { id: 5, name: "Guest (test data)", access: "1 section(s)", status: "Active", notes: "" },
    { id: 6, name: "Manager", access: "1 section(s)", status: "Active", notes: "" },
    { id: 7, name: "PP Engineer", access: "1 section(s)", status: "Active", notes: "" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e:any) => setSearchTerm(e.target.value);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Roles
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Role Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Select defaultValue="All" size="small" style={{ width: "120px" }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
        </Select>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
        >
          Add Role
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Number Of Access</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles
              .filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.access}</TableCell>
                  <TableCell>{role.status}</TableCell>
                  <TableCell>{role.notes}</TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={1} color="primary" />
      </Box>
    </Box>
  );
};

export default RolesPage;
