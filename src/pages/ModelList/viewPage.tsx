import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    Grid,
    Paper,
    IconButton,
    CssBaseline,
    Chip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../common/sidebar";

const ViewPage = ({ setSidebarOpen, sidebarOpen, setActivePage, activePage }: any) => {
    const location = useLocation();
    const { rowData } = location.state || {}; // Safely get rowData from location.state
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();

    const drawerWidth = 280;
    const collapsedWidth = 280;

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleBackClick = () => {
        navigate("/dashboard/modelList");
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
            <CssBaseline />
            <Sidebar
                setSidebarOpen={setSidebarOpen}
                open={sidebarOpen}
                setActivePage={setActivePage}
                activePage={activePage}
            />
            <Box
                component="main"
                sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "16px",
                    overflowX: "auto",
                    flexGrow: 1,
                    height: "100vh",
                    transition: "margin-left 0.3s ease",
                    marginLeft: sidebarOpen ? `${drawerWidth}px` : `${collapsedWidth}px`,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                    }}
                >
                    <IconButton onClick={handleBackClick} color="primary">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4">View Model Details</Typography>
                    <Box>
                        <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                            DEPLOY
                        </Button>
                        <Button variant="contained" color="secondary" sx={{ marginRight: 1 }}>
                            RESET
                        </Button>
                        <Button variant="contained">
                            SAVE
                        </Button>
                    </Box>
                </Box>

                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Model Tabs">
                    <Tab label="Overview" />
                    <Tab label="Monitor Tags" />
                    <Tab label="Alarm Conditions" />
                </Tabs>

                <Box sx={{ marginTop: 3 }}>


                    {/* Tab Content */}
                    {selectedTab === 0 && (
                        <Box>
                            {/* Display rowData in fields */}
                            {rowData ? (
                                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                                    <Typography variant="h6">Model Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            {/* <Typography variant="body1">
                                        <strong>ID:</strong> {rowData.id}
                                    </Typography> */}
                                            <Typography variant="body1">
                                                <strong>Branch:</strong> {rowData.branch || "N/A"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Power Plant:</strong> {rowData.powerPlant || "N/A"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Unit:</strong> {rowData.unit || "N/A"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Equipment:</strong> {rowData.model || "N/A"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Typography variant="body1">
                                                <strong>Status:</strong> {rowData.status || "N/A"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Version:</strong> {rowData.version || "N/A"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Created:</strong> {rowData.created || "N/A"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ) : (
                                <Typography variant="body1">No data available.</Typography>
                            )}

                            {/* Tags Section */}
                            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                                <Typography variant="h6">Tags</Typography>
                                <Chip
                                    label={rowData.tags}
                                    color="primary"
                                    sx={{ marginRight: 1, marginBottom: 1 }}
                                />
                                <Chip
                                    label={rowData.pids}
                                    color="primary"
                                    sx={{ marginRight: 1, marginBottom: 1 }}
                                />
                            </Paper>
                            <Typography variant="body1">Overview content goes here...</Typography>
                        </Box>
                    )}
                    {selectedTab === 1 && (
                        <Box>
                            <Typography variant="body1">Monitor Tags content goes here...</Typography>
                        </Box>
                    )}
                    {selectedTab === 2 && (
                        <Box>
                            <Typography variant="body1">Alarm Conditions content goes here...</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ViewPage;
