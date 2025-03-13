import { Box, Tabs, Tab, Button, CircularProgress } from '@mui/material'
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    tabContainer: {
        marginBottom: theme.spacing(3),
      },
    TagsContainer: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        
      },
    buttontag: {
      marginLeft:'30px'
    }
}))

const tabs = ({activeTab, handleTabChange, handleNext, loading, handleSubmit, isGridSearchValid}:any) => {

    const { classes } = useStyles();

  return (
    <Box className={classes.TagsContainer}>
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      className={classes.tabContainer}
    >
      <Tab label="Plant Details" />
      <Tab label="Tags" />
      <Tab label="Schedule" />
      <Tab label="Training Conditions" />
      <Tab label="Grid Search" />
      {/* <Tab label="Exec Conditions" /> */}
    </Tabs>
    
      {activeTab < 4 ? (
        <Button className={classes.buttontag}
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Next"}
        </Button>
      ) : (
        <Button className={classes.buttontag}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !isGridSearchValid()}
        >
          {loading ? <CircularProgress size={24} /> : "Train"}
        </Button>
      )}

  </Box>
  )
}

export default tabs