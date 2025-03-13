import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, Chip, Alert } from '@mui/material';

const TagsDetails = ({
  searchQuery, 
  handleSearchChange, 
  selectedCategory, 
  handleCategoryChange, 
  selectedTags, 
  setSelectedTags,
  error
}:any) => {
  // Mock data for tags
  const allTags = [
    { id: 1, label: 'HK_01calc35 1号 R Hメタル温度差', type: 'ANALOG' },
    { id: 2, label: 'HK_01calc60 HK1 WBいずれか運転中', type: 'DIGITAL' },
    { id: 3, label: 'HK_01calc61 HK1 二次冷却水量', type: 'MONITOR' },
    { id: 4, label: 'HK_01calc62 HK1 冷却水温差', type: 'ANALOG' },
    { id: 5, label: 'HK_01calc63 HK1 三次冷却水温度', type: 'MONITOR' },
  ];

  // Filter tags based on category and search query
  const filteredTags = allTags.filter(
    (tag) =>
      (selectedCategory === 'ALL' || tag.type === selectedCategory) &&
      tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle tag selection and deselection
  const handleTagSelection = (tag: any) => {
    if (selectedTags.some((selected:any) => selected.id === tag.id)) {
      // If already selected, remove it
      setSelectedTags((prevTags:any) => prevTags.filter((selected:any) => selected.id !== tag.id));
    } else {
      // Otherwise, add it
      setSelectedTags((prevTags:any) => [...prevTags, tag]);
    }
  };

  // Handle tag removal (used in MODEL TAGS)
  const handleTagRemoval = (tag: any) => {
    setSelectedTags((prevTags:any) => prevTags.filter((selected:any) => selected.id !== tag.id));
  };


  return (
    <Box display="flex" gap={3}>
      {/* DATACATALOG Section */}
      <Box flex={1} padding={2} border="1px solid #ddd" borderRadius="8px" bgcolor="#f9f9f9">
        <Typography variant="h6" gutterBottom>
          DATACATALOG
        </Typography>

        {/* Search Tags */}
        <TextField
          label="Search PID Name"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by PID Name"
          margin="normal"
        />

        {/* Category Filter Buttons */}
        <Box display="flex" gap={2} marginBottom="16px">
          {['ALL', 'ANALOG', 'DIGITAL', 'MONITOR'].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Filtered Tags */}
        <Box>
          {filteredTags.map((tag) => (
            <FormControlLabel
              key={tag.id}
              control={
                <Checkbox
                  checked={selectedTags.some((selected:any) => selected.id === tag.id)}
                  onChange={() => handleTagSelection(tag)}
                />
              }
              label={tag.label}
            />
          ))}
        </Box>
      </Box>

      {/* MODEL TAGS Section */}
      <Box flex={1} padding={2} border="1px solid #ddd" borderRadius="8px" bgcolor="#f9f9f9">
        <Typography variant="h6" gutterBottom>
          MODEL TAGS
        </Typography>

        {/* Analog Section */}
        <Box marginBottom="16px">
          <Typography variant="subtitle1">Analog</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedTags
              .filter((tag:any) => tag.type === 'ANALOG')
              .map((tag:any) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  onDelete={() => handleTagRemoval(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
          </Box>
        </Box>

        {/* Digital Section */}
        <Box marginBottom="16px">
          <Typography variant="subtitle1">Digital</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedTags
              .filter((tag:any) => tag.type === 'DIGITAL')
              .map((tag:any) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  onDelete={() => handleTagRemoval(tag)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
          </Box>
        </Box>

        {/* Monitor Section */}
        <Box marginBottom="16px">
          <Typography variant="subtitle1">Monitor</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedTags
              .filter((tag:any) => tag.type === 'MONITOR')
              .map((tag:any) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  onDelete={() => handleTagRemoval(tag)}
                  color="info"
                  variant="outlined"
                />
              ))}
          </Box>
        </Box>

        {/* Output Section */}
        <Box>
          <Typography variant="subtitle1">Output</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedTags
              .filter((tag:any) => tag.type === 'ANALOG' || tag.type === 'MONITOR')
              .map((tag:any ) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  onDelete={() => handleTagRemoval(tag)}
                  color="success"
                  variant="outlined"
                />
              ))}
          </Box>
        </Box>
      </Box>

      {/* Validation Error Message */}
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default TagsDetails;
