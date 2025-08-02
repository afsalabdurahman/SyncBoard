// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    ActivityFeed: true,
    MeetingRoom:false,
    Channel:false,
    Mytodo:false,
    Invite:false,
    Profile:false,
    MyProject:false,
};

const StatusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        activity: (state, action) => {

            state.ActivityFeed = true;
        },
        meeting: (state,  ) => {

            state.MeetingRoom = true;
        },
        channel: (state,  ) => {

            state.Channel = true;
        },
        mytodo: (state,  ) => {

            state.Mytodo = true;
        },
        invite: (state,  ) => {

            state.Invite = true;
        },
        profile:(state, )=>{
            state.Profile=true
        },
        myproject:(state)=>{
            state.MyProject=true},

        deactive: state => {

            state.ActivityFeed = false;
            state.Channel = false;
            state.MeetingRoom = false;
            state.Invite = false;
            state.Mytodo = false;
            state.Profile=false;
            state.MyProject=false;
        },
    },
});

export const { activity,channel,invite,meeting,mytodo,profile,myproject, deactive } = StatusSlice.actions;
export default StatusSlice.reducer;
