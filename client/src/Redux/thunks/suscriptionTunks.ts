import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../Services/api";
import { Subscription, PartialSubscriptionUpdate } from "../feature/SuscriptionSlice"
export const fetchSubscription = createAsyncThunk<
  Subscription,
  string,
  { rejectValue: string; state: any }
>("subscription/fetch", async (userId, thunkAPI) => {
  try {

    const res = await apiService.get(`subscription/mysubscription/${(userId)}`, {
      method: "GET",

    });
    console.log(res, "response from ap++ think")

    if (!res.data) {

      console.log("failed")
    }
    const data = res.data as Subscription;
    console.log(data, "from sucf++++++++DATA")
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message || "fetchSubscription failed");
  }
});

export const updateSubscription = createAsyncThunk<
  Subscription,
  { id: string; changes: PartialSubscriptionUpdate },
  { rejectValue: string; state: any }
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
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message || "updateSubscription failed");
  }
});