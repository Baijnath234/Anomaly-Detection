import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const TrainingCondition = ({ 
  addCondition, 
  conditions, 
  handleConditionChange, 
  removeCondition, 
  selectedTags,
  error 
}: any) => {

  // Updated getAvailableTags function
  const getAvailableTags = (currentIndex: number) => {
    const selectedTagLabels = conditions
      .map((condition: any, index: any) => (index !== currentIndex ? condition.tag : null))
      .filter(Boolean);

    return selectedTags.filter(
      (tag: any) =>
        !selectedTagLabels.includes(tag.label) || tag.label === conditions[currentIndex]?.tag
    );
  };

  return (
    <Box>
      <Typography component="h1" variant="h5" gutterBottom>
        Training Conditions
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={addCondition}
        sx={{ marginBottom: "16px" }}
        disabled={selectedTags.length === 0}
      >
        Add Condition
      </Button>

      {conditions.map((condition: any, index: any) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "16px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Tag Selection Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Tag</InputLabel>
            <Select
              value={condition?.tag || ''}
              onChange={(e) => handleConditionChange(index, "tag", e.target.value)}
            >
              {getAvailableTags(index).map((tag: any) => (
                <MenuItem key={tag.id} value={tag.label}>
                  {tag.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Lower Equality Dropdown */}
          <FormControl sx={{ flex: "500px" }}>
            <InputLabel>Lower Equality</InputLabel>
            <Select
              value={condition.lowerEquality}
              onChange={(e) =>
                handleConditionChange(index, "lowerEquality", e.target.value)
              }
            >
              <MenuItem value=">">{">"}</MenuItem>
              <MenuItem value=">=">{">="}</MenuItem>
            </Select>
          </FormControl>

          {/* Lower Value Input */}
          <TextField
            sx={{ flex: "500px" }}
            type="number"
            label="Lower Value"
            value={condition.lowerValue}
            onChange={(e) =>
              handleConditionChange(index, "lowerValue", e.target.value)
            }
          />

          {/* Upper Equality Dropdown */}
          <FormControl sx={{ flex: "500px" }}>
            <InputLabel>Upper Equality</InputLabel>
            <Select
              value={condition.upperEquality}
              onChange={(e) =>
                handleConditionChange(index, "upperEquality", e.target.value)
              }
            >
              <MenuItem value="<">{"<"}</MenuItem>
              <MenuItem value="<=">{"<="}</MenuItem>
            </Select>
          </FormControl>

          {/* Upper Value Input */}
          <TextField
            sx={{ flex: "500px" }}
            type="number"
            label="Upper Value"
            value={condition.upperValue}
            onChange={(e) =>
              handleConditionChange(index, "upperValue", e.target.value)
            }
          />

          {/* Delete Condition Button */}
          <IconButton
            color="error"
            onClick={() => removeCondition(index)}
            disabled={conditions.length === 1} // Disable delete button if only one condition exists
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {/* Validation Error Message */}
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default TrainingCondition;
