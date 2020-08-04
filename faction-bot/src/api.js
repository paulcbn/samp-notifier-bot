import axios from 'axios';
import CONFIG from '../config/config.json';

const { hostname } = CONFIG;

async function getFactionData() {
  try {
    const response = await axios.get(hostname);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default { getFactionData };


