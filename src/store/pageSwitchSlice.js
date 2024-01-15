import { createSlice } from '@reduxjs/toolkit';
import { PageSwitch } from '../shared/AppEnum';

const initialState = {
    pageIndex: PageSwitch.ViewPage,
    switchData: null
};

const pageSwitchSlice = createSlice({
    name: 'pageSwitch',
    initialState: initialState,
    reducers: {
        switchPage: (state, action) => {
            state.pageIndex = action.payload.pageIndex;
            state.switchData = action.payload.switchData;
        }
    }
});

export const { switchPage } = pageSwitchSlice.actions;
export default pageSwitchSlice.reducer;
