import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const ExecutionContion = ({ addCondition, conditions, handleConditionChange, removeCondition }: any) => {
  return (
    <Box>
      <Typography component="h1" variant="h5" gutterBottom>
        Execution Condition
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={addCondition}
        sx={{ marginBottom: "16px" }}
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
          <FormControl fullWidth>
            <InputLabel>Tag</InputLabel>
            <Select
              value={condition.tag}
              onChange={(e) => handleConditionChange(index, "tag", e.target.value)}
            >
              <MenuItem value="Tag1">Tag1</MenuItem>
              <MenuItem value="Tag2">Tag2</MenuItem>
              <MenuItem value="Tag3">Tag3</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Lower Equality</InputLabel>
            <Select
              value={condition.lowerEquality}
              onChange={(e) => handleConditionChange(index, "lowerEquality", e.target.value)}
            >
              <MenuItem value=">">{">"}</MenuItem>
              <MenuItem value=">=">{">="}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Lower Value"
            value={condition.lowerValue}
            onChange={(e) => handleConditionChange(index, "lowerValue", e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Upper Equality</InputLabel>
            <Select
              value={condition.upperEquality}
              onChange={(e) => handleConditionChange(index, "upperEquality", e.target.value)}
            >
              <MenuItem value="<">{"<"}</MenuItem>
              <MenuItem value="<=">{"<="}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Upper Value"
            value={condition.upperValue}
            onChange={(e) => handleConditionChange(index, "upperValue", e.target.value)}
          />
          <IconButton
            color="error"
            onClick={() => removeCondition(index)}
            disabled={conditions.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

export default ExecutionContion;
