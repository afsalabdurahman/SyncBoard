import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchSubscription,updateSubscription } from "./subscriptionTunks";
import { RootState } from "../../store";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "expired";
  export interface Subscription {
  cancelAtPeriodEnd: boolean;
  createdAt?: string; // ISO
  currentPeriodEnd?: string | null; // ISO or null
  currentPeriodStart?: string | null; // ISO or null
  metadata?: string;
  planKey: string;
  quantity: number;
  startedAt?: string; // ISO
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  updatedAt?: string; // ISO
  user?: string; // user id
  __v?: number;
  _id?: string; // subscription id
  
  [key: string]: any;
}
export type PartialSubscriptionUpdate = Partial<
  Pick<
    Subscription,
    | "cancelAtPeriodEnd"
    | "metadata"
    | "planKey"
    | "quantity"
    | "status"
    | "currentPeriodEnd"
    | "currentPeriodStart"
    | "startedAt"
  >
>;
export interface SubscriptionState {
  subscription: Subscription | null;
  // granular loading & error flags per operation:
  loading: {
    fetch: boolean;
    update: boolean;
    cancel: boolean;
    resume: boolean;
  };
  errors: {
    fetch?: string | null;
    update?: string | null;
    cancel?: string | null;
    resume?: string | null;
  };
}






export const cancelSubscription = createAsyncThunk<
  Subscription,
  { id: string; atPeriodEnd?: boolean },
  { rejectValue: string; state: RootState }
>("subscription/cancel", async ({ id, atPeriodEnd = true }, thunkAPI) => {
  try {
    const token = thunkAPI.getState()?.auth?.token;
 
    const res = await fetch(
      `/api/subscriptions/${encodeURIComponent(id)}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ cancelAtPeriodEnd: atPeriodEnd }),
      }
    );

  
    if (res.status === 404) {
      // fallback: patch main resource
      const fallback = await fetch(
        `/api/subscriptions/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ cancelAtPeriodEnd: atPeriodEnd }),
        }
      );
      if (!fallback.ok) {
        const txt = await fallback.text();
        throw new Error(txt || `Failed to cancel subscription (${fallback.status})`);
      }
      return (await fallback.json()) as Subscription;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to cancel subscription (${res.status})`);
    }

    const data = (await res.json()) as Subscription;
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(err?.message || "cancelSubscription failed");
  }
});
export const resumeSubscription = createAsyncThunk<
  Subscription,
  { id: string },
  { rejectValue: string; state: RootState }
>("subscription/resume", async ({ id }, thunkAPI) => {
  try {
    const token = thunkAPI.getState()?.auth?.token;
    const res = await fetch(`/api/subscriptions/${encodeURIComponent(id)}/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.status === 404) {
      // fallback
      const fallback = await fetch(`/api/subscriptions/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ cancelAtPeriodEnd: false }),
      });
      if (!fallback.ok) {
        const txt = await fallback.text();
        throw new Error(txt || `Failed to resume subscription (${fallback.status})`);
      }
      return (await fallback.json()) as Subscription;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to resume subscription (${res.status})`);
    }

    const data = (await res.json()) as Subscription;
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(err?.message || "resumeSubscription failed");
  }
});


const initialState: SubscriptionState = {
  subscription: null, // start null in real app; SAMPLE_SUBSCRIPTION can be used in dev
  loading: {
    fetch: false,
    update: false,
    cancel: false,
    resume: false,
  },
  errors: {
    fetch: null,
    update: null,
    cancel: null,
    resume: null,
  },
};


//  create slice
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    // replace entire subscription
    setSubscription(state, action: PayloadAction<Subscription | null>) {
      state.subscription = action.payload;
      // reset errors when setting a new subscription
      state.errors = { fetch: null, update: null, cancel: null, resume: null };
    },

    // update any single field; defensive - only if subscription exists
    updateField(
      state,
      action: PayloadAction<{ field: keyof Subscription; value: string|number }>
    ) {
      const { field, value } = action.payload;
      if (!state.subscription) return;
      // @ts-ignore -- dynamic field set (RTK + Immer)
      state.subscription[field] = value;
      state.loading.update = false;
      state.errors.update = null;
    },

    // clear on logout
    clearSubscription(state) {
      state.subscription = null;
      state.loading = { fetch: false, update: false, cancel: false, resume: false };
      state.errors = { fetch: null, update: null, cancel: null, resume: null };
    },

    // small helpers to set flags/errors synchronously if needed
    setLoading(
      state,
      action: PayloadAction<{ op: keyof SubscriptionState["loading"]; value: boolean }>
    ) {
      state.loading[action.payload.op] = action.payload.value;
    },

    setError(
      state,
      action: PayloadAction<{ op: keyof SubscriptionState["errors"]; message?: string | null }>
    ) {
      state.errors[action.payload.op] = action.payload.message ?? null;
    },

    // convenient domain actions
    toggleCancelAtPeriodEnd(state, action: PayloadAction<boolean>) {
      if (!state.subscription) return;
      state.subscription.cancelAtPeriodEnd = action.payload;
    },

    updateStatus(state, action: PayloadAction<SubscriptionStatus>) {
      if (!state.subscription) return;
      state.subscription.status = action.payload;
    },

    updateMetadata(state, action: PayloadAction<string>) {
      if (!state.subscription) return;
      state.subscription.metadata = action.payload;
    },

    updatePlanKey(state, action: PayloadAction<string>) {
      if (!state.subscription) return;
      state.subscription.planKey = action.payload;
    },

    updateQuantity(state, action: PayloadAction<number>) {
      if (!state.subscription) return;
      state.subscription.quantity = action.payload;
    },
  },

  extraReducers: (builder) => {
    // fetchSubscription
    builder.addCase(fetchSubscription.pending, (state) => {
      state.loading.fetch = true;
      state.errors.fetch = null;
    });
    builder.addCase(fetchSubscription.fulfilled, (state, action) => {
      state.loading.fetch = false;
      state.subscription = action.payload;
      state.errors.fetch = null;
    });
    builder.addCase(fetchSubscription.rejected, (state, action) => {
      state.loading.fetch = false;
      state.errors.fetch = action.payload ?? action.error.message ?? "Unknown error";
    });

    // updateSubscription
    builder.addCase(updateSubscription.pending, (state) => {
      state.loading.update = true;
      state.errors.update = null;
    });
    builder.addCase(updateSubscription.fulfilled, (state, action) => {
      state.loading.update = false;
      state.subscription = action.payload; // replace with server canonical record
      state.errors.update = null;
    });
    builder.addCase(updateSubscription.rejected, (state, action) => {
      state.loading.update = false;
      state.errors.update = action.payload ?? action.error.message ?? "Unknown error";
    });

    // cancelSubscription
    builder.addCase(cancelSubscription.pending, (state) => {
      state.loading.cancel = true;
      state.errors.cancel = null;
    });
    builder.addCase(cancelSubscription.fulfilled, (state, action) => {
      state.loading.cancel = false;
      state.subscription = action.payload;
      state.errors.cancel = null;
    });
    builder.addCase(cancelSubscription.rejected, (state, action) => {
      state.loading.cancel = false;
      state.errors.cancel = action.payload ?? action.error.message ?? "Unknown error";
    });

    // resumeSubscription
    builder.addCase(resumeSubscription.pending, (state) => {
      state.loading.resume = true;
      state.errors.resume = null;
    });
    builder.addCase(resumeSubscription.fulfilled, (state, action) => {
      state.loading.resume = false;
      state.subscription = action.payload;
      state.errors.resume = null;
    });
    builder.addCase(resumeSubscription.rejected, (state, action) => {
      state.loading.resume = false;
      state.errors.resume = action.payload ?? action.error.message ?? "Unknown error";
    });
  },
});
export const {
  setSubscription,
  updateField,
  clearSubscription,
  setLoading,
  setError,
  toggleCancelAtPeriodEnd,
  updateStatus,
  updateMetadata,
  updatePlanKey,
  updateQuantity,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
 
export const selectSubscription = (state: RootState): Subscription | null =>
  state.subscriptions?.subscription ?? null;

export const selectIsTrialing = (state: RootState): boolean =>
  (state.subscriptions?.subscription?.status ?? null) === "trialing";

/**
 * selectIsActive:
 * - True if status is in active-like set and not canceled at period end.
 * - Conservative: treat 'trialing' as active.
 */
export const selectIsActive = (state: RootState): boolean => {
  const sub: Subscription | null = selectSubscription(state);
  if (!sub) return false;
  const activeStatuses: SubscriptionStatus[] = ["active", "trialing"];
  return activeStatuses.includes(sub.status) && !sub.cancelAtPeriodEnd;
};

/**
 * Returns a JS Date or null. Defensive parsing.
 */
export const selectCurrentPeriodEndDate = (state: RootState): Date | null => {
  const iso = selectSubscription(state)?.currentPeriodEnd ?? null;
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
};