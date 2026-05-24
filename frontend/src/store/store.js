import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 

import jobReducer from "./slices/jobSlice";
import userReducer from "./slices/userSlice";
import applicationReducer from "./slices/applicationSlice";
import updateProfileReducer from "./slices/updateProfileSlice";
import interviewReducer from "./slices/interviewSlice";
import skillAssessmentReducer from "./slices/skillAssessmentsSlice";
import adminSliceReducer from "./slices/adminSlice";
import reportSliceReducer from "./slices/reportSlice";
import aiSliceReducer from "./slices/aiSlice"


const rootReducer = combineReducers({
  user: userReducer,
  jobs: jobReducer,
  applications: applicationReducer,
  updateProfile: updateProfileReducer,
  interviews: interviewReducer,
  skillAssessments: skillAssessmentReducer,
  admin: adminSliceReducer,
  report: reportSliceReducer,
  ai:aiSliceReducer
});


const persistConfig = {
  key: "user",           
  storage,               
  whitelist: ["user"],   
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
