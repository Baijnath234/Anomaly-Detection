import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

// Function to create a model
export const createModel = async (modelData: any) => {
  try {
    console.log('Sending model data to API:', JSON.stringify(modelData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/model-training`, modelData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return response.data;

  } catch (error: any) {
    if (error.response) {
      console.error('Backend responded with error:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    const responseDetails = error.response?.data?.message ?? error.response?.data;
    const message = responseDetails
      ? typeof responseDetails === 'string'
        ? responseDetails
        : JSON.stringify(responseDetails)
      : error.message;

    throw new Error(`Error creating model: ${message}`);
  }
};
