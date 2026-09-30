// Declare modules for untyped JS slice files
declare module './slices/authSlice' {
  import { Reducer, Action } from '@reduxjs/toolkit';
  const authReducer: Reducer<any, Action>;
  export default authReducer;
}

declare module './slices/uiSlice' {
  import { Reducer, Action } from '@reduxjs/toolkit';
  const uiReducer: Reducer<any, Action>;
  export default uiReducer;
}

declare module './slices/dataSlice' {
  import { Reducer, Action } from '@reduxjs/toolkit';
  const dataReducer: Reducer<any, Action>;
  export default dataReducer;
}

declare module './slices/settingsSlice' {
  import { Reducer, Action } from '@reduxjs/toolkit';
  const settingsReducer: Reducer<any, Action>;
  export default settingsReducer;
}
