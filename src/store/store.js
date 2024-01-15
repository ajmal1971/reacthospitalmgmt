import { configureStore } from '@reduxjs/toolkit';
import pageSwitchReducer from './pageSwitchSlice';

const store = configureStore({
    reducer: {
        pageSwitch: pageSwitchReducer
    }
});

export default store;