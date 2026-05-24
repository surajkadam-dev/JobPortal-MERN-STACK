import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    reply: null,
    loading: false,
    error: null,
    usage: null,
  },
  reducers: {
    requestForAIResponse(state) {
      state.loading = true;
      state.error = null;
      state.reply = null;
    },

    successForAIResponse(state, action) {
      state.loading = false;
      state.reply = action.payload.reply;
      state.usage = action.payload.usage;
    },

    failureForAIResponse(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearAllAIErrors(state) {
      state.error = null;
    },

    // ✅ NEW: clear reply after UI consumes it
    clearReply(state) {
      state.reply = null;
      state.usage = null;
    },

    resetAISlice(state) {
      state.loading = false;
      state.error = null;
      state.reply = null;
      state.usage = null;
    },
  },
});


// 🔥 Send Message To AI
export const sendMessageToAI = (message) => async (dispatch) => {
  dispatch(aiSlice.actions.requestForAIResponse());

  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/ai/chat",
      { message },
      { withCredentials: true }
    );

    dispatch(
      aiSlice.actions.successForAIResponse({
        reply: data.reply,
        usage: data.usage,
      })
    );
  } catch (error) {
    dispatch(
      aiSlice.actions.failureForAIResponse(
        error.response?.data?.message || "Failed to get AI response."
      )
    );
  }
};


// 🔹 Clear Errors
export const clearAllAIErrors = () => (dispatch) => {
  dispatch(aiSlice.actions.clearAllAIErrors());
};


// 🔹 Reset AI State
export const resetAISlice = () => (dispatch) => {
  dispatch(aiSlice.actions.resetAISlice());
};


// ✅ Export clearReply
export const { clearReply } = aiSlice.actions;

export default aiSlice.reducer;