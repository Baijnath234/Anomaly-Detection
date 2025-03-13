import { Box, Grid, TextField, Typography } from '@mui/material'


const GridSearch = ({ gridSearchParams, handleInputChangeTraining }: any) => {

    return (
        <Box sx={{ padding: "16px" }}>
            <Typography variant="h5" gutterBottom>
                Grid Search
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: "16px" }}>
                {/* Layers Input */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Layers"
                        variant="outlined"
                        value={gridSearchParams.layers}
                        onChange={(e) => handleInputChangeTraining("layers", e.target.value)}
                        placeholder="Enter number of layers"
                        error={!gridSearchParams.layers.trim()}
                        helperText={!gridSearchParams.layers.trim() ? "This field is required." : ""}
                    />
                </Grid>

                {/* Nodes Input */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Nodes"
                        variant="outlined"
                        value={gridSearchParams.nodes}
                        onChange={(e) => handleInputChangeTraining("nodes", e.target.value)}
                        placeholder="Enter nodes (e.g., 200,250)"
                        error={!gridSearchParams.nodes.trim()}
                        helperText={!gridSearchParams.nodes.trim() ? "This field is required." : ""}
                    />
                </Grid>

                {/* Batches Input */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Batches"
                        variant="outlined"
                        value={gridSearchParams.batches}
                        onChange={(e) => handleInputChangeTraining("batches", e.target.value)}
                        placeholder="Enter batch sizes (e.g., 1024,2048)"
                        error={!gridSearchParams.batches.trim()}
                        helperText={!gridSearchParams.batches.trim() ? "This field is required." : ""}
                    />
                </Grid>

                {/* Max Epochs Input */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Max Epochs"
                        variant="outlined"
                        value={gridSearchParams.maxEpochs}
                        onChange={(e) => handleInputChangeTraining("maxEpochs", e.target.value)}
                        placeholder="Enter maximum epochs"
                        error={!gridSearchParams.maxEpochs.trim()}
                        helperText={!gridSearchParams.maxEpochs.trim() ? "This field is required." : ""}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default GridSearch