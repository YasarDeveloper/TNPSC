import axios from 'axios';

const baseURL = 'http://localhost:3001/api/';

export const getInitialData = async (userId) => {
    try {
        const response = await axios.get(`${baseURL}getInitialData/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteData = async (recordId) => {
    try {
        const response = await axios.delete(`${baseURL}deleteData/${recordId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateData = async (updatedData) => {
    try {
        const response = await axios.post(`${baseURL}updateData`, updatedData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const AddStudent = async (formData) => {
    try {
        const response = await axios.post(`${baseURL}saveFormData`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
