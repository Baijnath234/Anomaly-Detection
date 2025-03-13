import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BaseVersionState {
  plantDetails: {
    branch: string;
    powerPlant: string;
    unit: string;
    model: string;
    description: string;
  };
  tagsDetails: {
    tags: string[];
    selectedCategory: string;
  };
  scheduleDetails: {
    chartPeriod: string;
    startDate: Date | null;
    endDate: Date | null;
    scheduleTags: string[];
    selectedPeriods: string[];
  };
  trainingConditions: any[];
  gridSearchParams: {
    layers: string;
    nodes: string;
    batches: string;
    maxEpochs: string;
  };
}

const initialState: BaseVersionState = {
  plantDetails: {
    branch: '',
    powerPlant: '',
    unit: '',
    model: '',
    description: '',
  },
  tagsDetails: {
    tags: [],
    selectedCategory: 'ALL',
  },
  scheduleDetails: {
    chartPeriod: '',
    startDate: null,
    endDate: null,
    scheduleTags: [],
    selectedPeriods: [],
  },
  trainingConditions: [
    {
      tag: '',
      lowerEquality: '>',
      lowerValue: '',
      upperEquality: '<=',
      upperValue: '',
    },
  ],
  gridSearchParams: {
    layers: '',
    nodes: '',
    batches: '',
    maxEpochs: '',
  },
};

const baseVersionSlice = createSlice({
  name: 'baseVersion',
  initialState,
  reducers: {
    savePlantDetails(state, action: PayloadAction<BaseVersionState['plantDetails']>) {
      state.plantDetails = action.payload;
    },
    saveTagsDetails(state, action: PayloadAction<BaseVersionState['tagsDetails']>) {
      state.tagsDetails = action.payload;
    },
    saveScheduleDetails(state, action: PayloadAction<BaseVersionState['scheduleDetails']>) {
      state.scheduleDetails = action.payload;
    },
    saveTrainingConditions(state, action: PayloadAction<any[]>) {
      state.trainingConditions = action.payload;
    },
    saveGridSearchParams(state, action: PayloadAction<BaseVersionState['gridSearchParams']>) {
      state.gridSearchParams = action.payload;
    },
  },
});

export const {
  savePlantDetails,
  saveTagsDetails,
  saveScheduleDetails,
  saveTrainingConditions,
  saveGridSearchParams,
} = baseVersionSlice.actions;

export default baseVersionSlice.reducer;
