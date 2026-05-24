import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    application: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    requestForAllApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllApplications(state, action) {
      state.loading = false;
      state.applications = action.payload;
    },
    failureForAllApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForMyApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForMyApplications(state, action) {
      state.loading = false;
      state.applications = action.payload;
    },
    failureForMyApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForPostApplication(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForPostApplication(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    failureForPostApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForDeleteApplication(state) {
      state.loading = true;
      state.error = null;
    },
    successForDeleteApplication(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    failureForDeleteApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForSingleApplication(state) {
      state.loading = true;
      state.error = null;
      state.application = null;
    },
    successForSingleApplication(state, action) {
      state.loading = false;
      state.application = action.payload;
    },
    failureForSingleApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateStatusInRedux(state, action) {
      const { id, status } = action.payload;
      state.applications = state.applications.map((app) =>
        app._id === id ? { ...app, status } : app
      );
    },

    clearAllErrors(state) {
      state.error = null;
    },
    resetApplicationSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.application = null;
    },
  },
});

export const fetchEmployerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForAllApplications());
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/application/employer/getall",
      { withCredentials: true }
    );
    dispatch(applicationSlice.actions.successForAllApplications(data.applications));
    console.log(data)
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForAllApplications(
        error.response?.data?.message || "Failed to fetch employer applications."
      )
    );
  }
};

export const fetchJobSeekerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForMyApplications());
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/application/jobseeker/getall",
      { withCredentials: true }
    );
    dispatch(applicationSlice.actions.successForMyApplications(data.applications));
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForMyApplications(
        error.response?.data?.message || "Failed to fetch job seeker applications."
      )
    );
  }
};

export const fetchApplicationById = (id) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForSingleApplication());
  console.log("application id :",id)
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/application/application/${id}`,
      { withCredentials: true }
    );
    console.log("id",id);
    dispatch(applicationSlice.actions.successForSingleApplication(data.application));
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForSingleApplication(
        error.response?.data?.message || "Failed to fetch application details."
      )
    );
  }
};

export const postApplication = (data, jobId) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForPostApplication());
  try {
    const { data: response } = await axios.post(
      `http://localhost:8000/api/v1/application/post/${jobId}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(applicationSlice.actions.successForPostApplication(response.message));
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForPostApplication(
        error.response?.data?.message || "Failed to post application."
      )
    );
  }
};


export const deleteApplication = (id) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForDeleteApplication());
  try {
    const { data } = await axios.delete(
      `http://localhost:8000/api/v1/application/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(applicationSlice.actions.successForDeleteApplication(data.message));
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForDeleteApplication(
        error.response?.data?.message || "Failed to delete application."
      )
    );
  }
};

export const updateApplicationStatus = (id, status) => async (dispatch) => {
  dispatch(applicationSlice.actions.updateStatusInRedux({ id, status }));
  
  try {
    await axios.post(
      `http://localhost:8000/api/v1/application/status/${id}`,
      { status },
      { withCredentials: true }
    );
    dispatch(fetchEmployerApplications());
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForAllApplications(
        error.response?.data?.message || "Failed to update status."
      )
    );
  }
};

export const clearAllApplicationErrors = () => (dispatch) => {
  dispatch(applicationSlice.actions.clearAllErrors());
};

export const resetApplicationSlice = () => (dispatch) => {
  dispatch(applicationSlice.actions.resetApplicationSlice());
};

export default applicationSlice.reducer;
