import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000";

const ModelList = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[] | any>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedPowerPlant, setSelectedPowerPlant] = useState("All");
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [selectedModel, setSelectedModel] = useState("All");
  const [selectedVersion, setSelectedVersion] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCreated, setSelectedCreated] = useState("All");

  // Fetch data from the database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/model-training`);
        const processedRows = response.data.map((item: any) => ({
          id: item.id,
          powerPlant: item.powerPlant,
          unit: item.unit,
          model: item.model,
          version: item.layers,
          status: item.endDate ? "Deployed" : "Stopped",
          created: item.endDate || "N/A",
          branch: item.branch,
          tags: item.pids.map((i: any) => i.type),
          pids: item.loadConditions.map((i: any) => i.pid),
        }));

        setRows(processedRows);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [success]);

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    console.log("Menu clicked, setting selectedRowId to:", id);
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewClick = () => {
    const selectedRow = rows.find((row: any) => row.id === selectedRowId);
    navigate(`/view-page`, { state: { rowData: selectedRow } });
    handleMenuClose();
  };

  const handleUpdateClick = (row: any) => {
    const id = row;
    navigate(`/dashboard/createModelVersion`, { state: { modelId: id } });
    handleMenuClose();
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    const updatedRows: any = rows.map((row: any) => ({
      ...row,
      isSelected: isChecked,
    }));
    setRows(updatedRows);
    setSelectedRows(isChecked ? updatedRows : []);
  };

  const handleRowSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowId: number
  ) => {
    const isChecked = event.target.checked;
    const updatedRows: any = rows.map((row: any) =>
      row.id === rowId ? { ...row, isSelected: isChecked } : row
    );
    setRows(updatedRows);

    const selectedRowData = updatedRows.filter((row: any) => row.isSelected);
    setSelectedRows(selectedRowData);
  };

  const powerPlantOptions = [
    "All",
    ...new Set(rows.map((row: any) => row.powerPlant)),
  ];
  const unitOptions = ["All", ...new Set(rows.map((row: any) => row.unit))];
  const modelOptions = ["All", ...new Set(rows.map((row: any) => row.model))];
  const VersionOptions = [
    "All",
    ...new Set(rows.map((row: any) => row.version)),
  ];
  const StatusOptions = ["All", ...new Set(rows.map((row: any) => row.status))];
  const CreatedOptions = [
    "All",
    ...new Set(rows.map((row: any) => row.created)),
  ];

  const filteredRows = rows.filter((row: any) => {
    const matchesPowerPlant =
      selectedPowerPlant === "All" || row.powerPlant === selectedPowerPlant;
    const matchesUnit = selectedUnit === "All" || row.unit === selectedUnit;
    const matchesModel = selectedModel === "All" || row.model === selectedModel;
    const matchesVersion =
      selectedVersion === "All" || row.version === selectedVersion;
    const matchesStatus =
      selectedStatus === "All" || row.status === selectedStatus;
    const matchesCreated =
      selectedCreated === "All" || row.created === selectedCreated;

    return (
      matchesPowerPlant &&
      matchesUnit &&
      matchesModel &&
      matchesVersion &&
      matchesStatus &&
      matchesCreated
    );
  });

  const handleDeleteSelected = async (id: number) => {
    if (selectedRows.length === 0) {
      alert("No rows selected for deletion.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:3000/model-training/${id}`
      );
      console.log("Delete API response:", response.data);
      setSelectedRows(
        selectedRows.filter((training: { id: number }) => training.id !== id)
      );
      setSuccess(`ModelTraining with ID ${id} deleted successfully!`);
      setNotification(`ModelTraining with ID ${id} deleted!`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      console.error("Error during deletion:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete the ModelTraining record."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewModelCreate = () => {
    navigate("/dashboard/createModelVersion");
  };

  const isButtonDisabled = selectedRows.length === 0;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Model List
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() =>
            handleDeleteSelected(selectedRows.map((data: any) => data.id))
          }
          disabled={isButtonDisabled}
        >
          SOFT DELETE
        </Button>
        <Button variant="contained" color="primary">
          + CREATE EQUIPMENT
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewModelCreate}
        >
          + CREATE MODEL
        </Button>
      </Box>

      {loading ? (
        <Typography variant="body1" align="center">
          Loading...
        </Typography>
      ) : error ? (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      ) : (
        <TableContainer
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <input
                    type="checkbox"
                    style={{ width: "20px", height: "20px" }}
                    checked={rows.every((row: any) => row.isSelected)}
                    onChange={handleSelectAllChange}
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <InputLabel>Power Plant</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        defaultValue="All"
                        value={selectedPowerPlant}
                        onChange={(e) => setSelectedPowerPlant(e.target.value)}
                      >
                        {powerPlantOptions.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <InputLabel>Unit</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        defaultValue="All"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                      >
                        {unitOptions.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <InputLabel>Model</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        {modelOptions.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <InputLabel>Version</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        defaultValue="All"
                        value={selectedVersion}
                        onChange={(e) => setSelectedVersion(e.target.value)}
                      >
                        {VersionOptions.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <InputLabel>Status</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        defaultValue="All"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        {StatusOptions.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <InputLabel>Created</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        defaultValue="All"
                        value={selectedCreated}
                        onChange={(e) => setSelectedCreated(e.target.value)}
                      >
                        {CreatedOptions.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{ width: "20px", height: "20px" }}
                          checked={row.isSelected}
                          onChange={(e) => handleRowSelectChange(e, row.id)}
                        />
                        <Box>
                          <Button
                            size="small"
                            onClick={(e) => handleMenuClick(e, row.id)}
                          >
                            <MoreVertIcon />
                          </Button>
                          <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            MenuListProps={{
                              "aria-labelledby": "menu-dots",
                            }}
                          >
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleMenuClose}
                              MenuListProps={{
                                "aria-labelledby": "menu-dots",
                              }}
                            >
                              <MenuItem onClick={handleViewClick}>
                                <VisibilityIcon sx={{ marginRight: 1 }} /> View
                              </MenuItem>
                              <MenuItem onClick={() => handleUpdateClick(row)}>
                                <CreateNewFolderIcon sx={{ marginRight: 1 }} />{" "}
                                Create Version
                              </MenuItem>
                              <MenuItem onClick={handleMenuClose}>
                                <CloudUploadIcon sx={{ marginRight: 1 }} />{" "}
                                Deploy
                              </MenuItem>
                              <MenuItem onClick={handleMenuClose}>
                                <DescriptionIcon sx={{ marginRight: 1 }} /> Logs
                              </MenuItem>
                              <MenuItem onClick={handleMenuClose}>
                                <DownloadIcon sx={{ marginRight: 1 }} />{" "}
                                Download Tags
                              </MenuItem>
                            </Menu>
                          </Menu>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{row.powerPlant}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.version}</TableCell>
                    <TableCell>
                      {row.status === "Deployed" ? (
                        <Typography variant="body2" color="success.main">
                          {row.status}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="error.main">
                          {row.status}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{row.created}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />
    </Box>
  );
};

export default ModelList;
