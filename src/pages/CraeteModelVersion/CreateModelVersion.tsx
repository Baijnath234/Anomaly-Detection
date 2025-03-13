import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import Tabs from "../CraeteModelVersion/Tabs";
import PlantDetails from "./PlantDetails";
import TagsDetails from "./TagsDetails";
import ScheduleDetails from "./ScheduleDetails";
import TrainingCondition from "./TrainingCondition";
import GridSearch from "./GridSearch";
import { createModel } from "../../services/Aggregator.service";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const useStyles = makeStyles()((theme) => ({
  boxContainer: {
    border: "1px solid #ccc",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    backgroundColor: "#fff",
  },
}));

const CreateBaseVersionPage: React.FC = () => {
  const { classes } = useStyles();
  const { state } = useLocation();
  const modelId = state?.modelId;
  const [modelData, setModelData] = useState(null);

  // State Declarations
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    branch: "",
    powerPlant: "",
    unit: "",
    model: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    branch: "",
    powerPlant: "",
    unit: "",
    model: "",
  });
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [selectedTagsError, setSelectedTagsError] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [conditions, setConditions] = useState([
    {
      tag: "",
      lowerEquality: ">",
      lowerValue: "",
      upperEquality: "<=",
      upperValue: "",
    },
  ]);
  const [conditionError, setConditionsError] = useState<string | null>(null);
  const [gridSearchParams, setGridSearchParams] = useState({
    layers: "",
    nodes: "",
    batches: "",
    maxEpochs: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // Notification State
  const [notification, setNotification] = useState<string | null>(null);

  // Navigation Handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNext = () => {
    if (activeTab === 2 && !validateDates(startDate, endDate)) {
      return;
    }
    if (validateTab()) {
      setActiveTab((prev) => prev + 1);
    }
    if (activeTab === 2) {
      setDateRange({ startDate, endDate });
    }
  };

  // Validation Functions
  const validateTab = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (activeTab === 0) {
      if (!formData.branch) newErrors.branch = "Branch is required.";
      if (!formData.powerPlant)
        newErrors.powerPlant = "Power Plant is required.";
      if (!formData.unit) newErrors.unit = "Unit is required.";
      if (!formData.model) newErrors.model = "Model is required.";
      isValid = Object.values(newErrors).every((val) => val === "");
    } else if (activeTab === 1) {
      if (selectedTags.length === 0) {
        setSelectedTagsError("Please select at least one tag.");
        isValid = false;
      } else {
        setSelectedTagsError(null);
      }
    } else if (activeTab === 2) {
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        setScheduleError("Please select a valid start and end date.");
        isValid = false;
      } else {
        setScheduleError(null);
        return true;
      }
    } else if (activeTab === 3) {
      if (conditions.some((condition) => !condition.tag)) {
        setConditionsError("Please select a tag for all conditions.");
        isValid = false;
      } else {
        setConditionsError(null);
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateDates = (start: string, end: string) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const minStartDate = new Date("2025-01-01");
    const maxEndDate = new Date("2025-03-30");

    if (startDateObj < minStartDate || endDateObj > maxEndDate) {
      setScheduleError(
        "Dates must be between January 1, 2025, and March 30, 2025."
      );
      return false;
    }
    if (startDateObj > endDateObj) {
      setScheduleError("Start date must be earlier than end date.");
      return false;
    }
    setScheduleError(null);
    return true;
  };

  const isGridSearchValid = () => {
    return (
      gridSearchParams.layers.trim() &&
      gridSearchParams.nodes.trim() &&
      gridSearchParams.batches.trim() &&
      gridSearchParams.maxEpochs.trim()
    );
  };

  // Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleInputChangeTraining = (field: string, value: string) => {
    setGridSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // API Submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Updating model data:", modelData);
    try {
      setLoading(true);
      const payload = {
        branch: formData.branch.trim(),
        powerPlant: formData.powerPlant.trim(),
        unit: formData.unit.trim(),
        model: formData.model.trim(),
        startDate: dateRange?.startDate
          ? new Date(dateRange.startDate).toISOString()
          : null,
        endDate: dateRange?.endDate
          ? new Date(dateRange.endDate).toISOString()
          : null,
        tags: "tag1,tag2",
        layers: gridSearchParams.layers,
        nodes: gridSearchParams.nodes,
        batches: gridSearchParams.batches,
        maxEpochs: gridSearchParams.maxEpochs,
        PIDs: selectedTags.map((tag) => ({
          type: tag.type,
          trainCount: tag.trainCount || 50,
          trainMean: tag.trainMean || 20,
          trainStd: tag.trainStd || 5,
          trainMin: tag.trainMin || 1,
          trainMax: tag.trainMax || 100,
          train25Perc: tag.train25Perc || 10,
          train50Perc: tag.train50Perc || 20,
          train75Perc: tag.train75Perc || 30,
          isOutput: tag.isOutput ?? true,
          isMonitor: tag.isMonitor ?? false,
          included: tag.included ?? true,
        })),
        grid: {
          batches: [parseInt(gridSearchParams.batches, 10) || 16, 32],
          layers: [parseInt(gridSearchParams.layers, 10) || 3, 5],
          maxEpochs: [parseInt(gridSearchParams.maxEpochs, 10) || 50, 100],
          nodes: [parseInt(gridSearchParams.nodes, 10) || 64, 128],
          rates: [0.01, 0.001],
        },
        schedule: {
          startDate: new Date(
            dateRange?.startDate || "2025-01-01"
          ).toISOString(),
          endDate: new Date(dateRange?.endDate || "2025-01-31").toISOString(),
          PIDs: ["PID1", "PID2"],
          timePeriods: [
            {
              start: new Date(
                dateRange?.startDate || "2025-01-01"
              ).toISOString(),
              end: new Date(dateRange?.endDate || "2025-01-15").toISOString(),
            },
          ],
        },
        loadCondition: {
          conditions: conditions.map((condition) => ({
            pid: condition.tag || "PID1",
            lower: condition.lowerValue || "10",
            upper: condition.upperValue || "100",
            loadId: "Load1",
            isUsed: true,
            isLowerEqualityStrict: condition.lowerEquality === ">=",
            isUpperEqualityStrict: condition.upperEquality === "<=",
            createdAt: new Date().toISOString(),
          })),
        },
        mlModel: {
          key: 123,
          uuid: "uuid-123",
          name: formData.model.trim(),
          nameJp: "モデル X",
          description: formData.description || "Test model",
          version: "1.0",
          plant: formData.powerPlant.trim(),
          unit: formData.unit.trim(),
          branch: formData.branch.trim(),
          createdAt: new Date().toISOString(),
          status: "trained",
          isNewest: true,
          isStopped: false,
          isCountReset: false,
          specialKey: 1014,
          specialUuid: "uuid-1014",
          deletionInProgress: false,
        },
        monitorAlarmTags: ["tag1", "tag2"],
        sensorAlarmConditions: ["condition1", "condition2"],
      };

      console.log("Payload being sent:", payload);

      const response = await createModel(payload);
      console.log(response, "response");
      setSuccess("Python says: Hello World!");
      setSuccess("Model created successfully!");
      setNotification("Model created successfully!");
      setTimeout(() => setNotification(null), 3000);
      setLoading(false);

      // Clear all inputs
      setFormData({
        branch: "",
        powerPlant: "",
        unit: "",
        model: "",
        description: "",
      });
      setSelectedTags([]);
      setGridSearchParams({
        layers: "",
        nodes: "",
        batches: "",
        maxEpochs: "",
      });
      setDateRange(null);
      setConditions([
        {
          tag: "",
          lowerEquality: ">",
          lowerValue: "",
          upperEquality: "<=",
          upperValue: "",
        },
      ]);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (modelId) {
      const fetchModelData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/model-training/${modelId}`
          );
          const data = response.data;
          setModelData(data);

          setFormData({
            branch: data.branch || "",
            powerPlant: data.powerPlant || "",
            unit: data.unit || "",
            model: data.model || "",
            description: data.description || "",
          });

          const tags = data.tags
            ? data.tags.split(",").map((tag: any) => ({ type: tag }))
            : [];
          setSelectedTags(tags);

          // Auto-fill grid search params
          if (data.gridSearchParams && data.gridSearchParams.length > 0) {
            const gridParams = data.gridSearchParams[0];
            setGridSearchParams({
              layers: gridParams.layers.join(","),
              nodes: gridParams.nodes.join(","),
              batches: gridParams.batches.join(","),
              maxEpochs: gridParams.maxEpochs.join(","),
            });
          }

          // Auto-fill conditions (if they exist)
          if (data.loadConditions && data.loadConditions.length > 0) {
            setConditions(
              data.loadConditions.map((condition: any) => ({
                tag: condition.pid,
                lowerEquality: condition.isLowerEqualityStrict ? ">=" : ">",
                lowerValue: condition.lower || "",
                upperEquality: condition.isUpperEqualityStrict ? "<=" : "<",
                upperValue: condition.upper || "",
              }))
            );
          }
        } catch (err) {
          console.error("Error fetching model data:", err);
          setError("Failed to load model data.");
        } finally {
          setLoading(false);
        }
      };

      fetchModelData();
    }
  }, [modelId]);

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ marginBottom: 8 }}>
          Create Model Version
        </Typography>
        <Box className={classes.boxContainer}>
          <Tabs
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            handleNext={handleNext}
            loading={loading}
            handleSubmit={handleSubmit}
            isGridSearchValid={isGridSearchValid}
          />
          {activeTab === 0 && (
            <PlantDetails
              error={error}
              success={success}
              handleSubmit={handleSubmit}
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          )}
          {activeTab === 1 && (
            <TagsDetails
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              error={selectedTagsError}
            />
          )}
          {activeTab === 2 && (
            <ScheduleDetails
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              error={scheduleError}
              validateDates={validateDates}
            />
          )}
          {activeTab === 3 && (
            <TrainingCondition
              addCondition={() =>
                setConditions([
                  ...conditions,
                  {
                    tag: "",
                    lowerEquality: ">",
                    lowerValue: "",
                    upperEquality: "<=",
                    upperValue: "",
                  },
                ])
              }
              conditions={conditions}
              handleConditionChange={(index: any, field: any, value: any) => {
                const updatedConditions: any = [...conditions];
                updatedConditions[index][field] = value;
                setConditions(updatedConditions);
              }}
              removeCondition={(index: any) => {
                const updatedConditions = conditions.filter(
                  (_, i) => i !== index
                );
                setConditions(updatedConditions);
              }}
              selectedTags={selectedTags}
              error={conditionError}
            />
          )}
          {activeTab === 4 && (
            <GridSearch
              gridSearchParams={gridSearchParams}
              handleInputChangeTraining={handleInputChangeTraining}
            />
          )}
        </Box>
      </Box>

      {notification && <div className="notification">{notification}</div>}
    </>
  );
};

export default CreateBaseVersionPage;
