import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../Services/apiServices/apiService";

import { Subscription, PartialSubscriptionUpdate } from "./subscriptionSlice"
import { RootState } from "../../store";
export const fetchSubscription = createAsyncThunk<
  Subscription,
  string,
  { rejectValue: string; state: RootState }
>("subscription/fetch", async (userId, thunkAPI) => {
  try {

    const res = await apiService.get(`subscription/mysubscription/${(userId)}`, {
      method: "GET",

    });


    
    const data = res.data as Subscription;
    
    return data;
  } catch (err: unknow) {
    return thunkAPI.rejectWithValue(err?.message || "fetchSubscription failed");
  }
});

export const updateSubscription = createAsyncThunk<
  Subscription,
  { id: string; changes: PartialSubscriptionUpdate },
  { rejectValue: string; state: RootState }
>("subscription/update", async ({ id, changes }, thunkAPI) => {
  try {
    const token = thunkAPI.getState()?.auth?.token;
    const res = await fetch(`/api/subscriptions/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(changes),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to update subscription (${res.status})`);
    }

    const data = (await res.json()) as Subscription;
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(err?.message || "updateSubscription failed");
  }
});