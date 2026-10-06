// UI Slice for Redux Store - Handles loading and error states
import { createSlice } from '$1';

export const uiSlice = createSlice({name: 'ui',
  initialState: { loading: false,
    error: null,
    successMessage: null,
    notifications: []
  },
  reducers: {setLoading: (state, action) => {
    state.loading = action.payload;
  },
  setError: (state, action) => {
    state.error = action.payload;
    // Clear success message when setting error
    state.successMessage = null;
  },
  setSuccessMessage: (state, action) => {
    state.successMessage = action.payload;
    // Clear error when setting success message
    state.error = null;
  },
  clearError: (state) => {
    state.error = null;
  },
  clearSuccessMessage: (state) => {
    state.successMessage = null;
  },
  addNotification: (state, action) => {
    const notification = { id: Date.now(), ...action.payload,
      timestamp: new Date().toISOString()
    };
    state.notifications.push(notification);
  },
  removeNotification: (state, action) => {
    state.notifications = state.notifications.filter(
      notification => notification.id !== action.payload
    );
  },
  clearNotifications: (state) => {
    state.notifications = [];
  }
  }
});

export const { setLoading,
  setError,
  setSuccessMessage,
  clearError,
  clearSuccessMessage,
  addNotification,
  removeNotification,
  clearNotifications
} = uiSlice.actions;

export default uiSlice.reducer;
