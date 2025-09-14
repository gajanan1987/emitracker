import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import supabase from "../services/supabase";
import { signOut } from "./authSlice";
import { normalizeLoan } from "../utils/normalizeLoan";
import { genrateEmi } from "../utils/genrateEmi";

// Save only summary to DB
export const createLoan = createAsyncThunk(
  "loans/createLoan",
  async ({ loan, remaining }, { rejectWithValue }) => {
    const { error, data } = await supabase
      .from("loan")
      .insert([loan])
      .select()
      .single();
    if (error) return rejectWithValue(error.message);
    const u = { ...data, remaningEmi: remaining };
    return u;
  }
);

export const editLoan = createAsyncThunk(
  "loans/editLoan",
  async ({ loan, remaining, loanId }, { rejectWithValue }) => {
    const { error, data } = await supabase
      .from("loan")
      .update({
        loan_name: loan.loan_name,
        loan_amount: loan.loan_amount,
        interest_rate: loan.interest_rate,
        tenure_months: loan.tenure_months,
        emi_amount: loan.emi_amount,
        loan_date: loan.loan_date,
        emi_date: loan.emi_date,
      })
      .eq("id", Number(loanId))
      .select()
      .single();
    if (error) return rejectWithValue(error.message);
    if (!data || data.length === 0) {
      return rejectWithValue("No loan found with that ID");
    }
    return { ...data, remaningEmi: remaining };
  }
);

export const fetchLoans = createAsyncThunk(
  "loans/fetchLoans",
  async (_, { rejectWithValue, getState }) => {
    const {
      auth: { user },
    } = getState();
    if (!user) return [];
    const { data, error } = await supabase
      .from("loan")
      .select("*")
      .eq("user_id", user.id);
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const deleteLoan = createAsyncThunk(
  "loans/deleteLoan",
  async (loanId, { rejectWithValue }) => {
    const { error, data } = await supabase
      .from("loan")
      .delete()
      .eq("id", loanId);
    if (error) return rejectWithValue(error.message);
    return { id: loanId };
  }
);

export const loanDetails = createAsyncThunk(
  "loans/loanDetails",
  async (loanId, { rejectWithValue }) => {
    const { error, data } = await supabase
      .from("loan")
      .select("*")
      .eq("id", loanId)
      .single();
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  currentSchedule: null,
  emiSummary: null,
};

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    computeScheduleFor: (state, action) => {
      const { data, type } = action.payload;
      const { summery, scheduleArr } = genrateEmi(data);

      if (type !== "addLoan") {
        state.currentSchedule = scheduleArr;
        state.emiSummary = summery;
      } else {
        state.emiSummary = summery;
      }
    },
    removeSummery: (state) => {
      state.currentSchedule = null;
      state.emiSummary = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //Fetch Loan
      .addCase(fetchLoans.pending, (s, a) => {
        s.status = "loading";
      })
      .addCase(fetchLoans.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = (a.payload || []).map((loan) => {
          const normalized = normalizeLoan(loan);
          const { summery } = genrateEmi(normalized);
          return { ...normalized, ...summery }; // merged loan object
        });
      })
      .addCase(fetchLoans.rejected, (s, a) => {
        s.status = "failed";
        s.items = a.payload || [];
      })

      //Create Loan
      .addCase(createLoan.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(createLoan.fulfilled, (s, a) => {
        // s.status = "succeeded";
        // s.items.push(normalizeLoan(a.payload));
        // s.currentSchedule = null;
        // s.emiSummary = null;

        s.status = "succeeded";
        const normalized = normalizeLoan(a.payload);
        const { summery } = genrateEmi(normalized);
        s.items.push({ ...normalized, ...summery });
        s.currentSchedule = null;
        s.emiSummary = null;
      })
      .addCase(createLoan.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      //Edit Loan
      .addCase(editLoan.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(editLoan.fulfilled, (s, a) => {
        // s.status = "succeeded";
        // const updated = normalizeLoan(a.payload);
        // const idx = s.items.findIndex((item) => item.id === updated.id);
        // if (idx !== -1) {
        //   s.items[idx] = updated;
        // } else {
        //   s.items.push(updated);
        // }
        // s.currentSchedule = null;
        // s.emiSummary = null;
        s.status = "succeeded";
        const normalized = normalizeLoan(a.payload);
        const { summery } = genrateEmi(normalized);
        const enriched = { ...normalized, ...summery };

        const idx = s.items.findIndex((item) => item.id === enriched.id);
        if (idx !== -1) {
          s.items[idx] = enriched;
        } else {
          s.items.push(enriched);
        }

        s.currentSchedule = null;
        s.emiSummary = null;
      })
      .addCase(editLoan.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      //Delete Loan
      .addCase(deleteLoan.pending, (s, a) => {
        s.status = "loading";
      })
      .addCase(deleteLoan.fulfilled, (s, a) => {
        s.items = s.items.filter((item) => {
          return item.id !== a.payload.id;
        });
        s.status = "idle";
      })
      .addCase(deleteLoan.rejected, (s, a) => {
        s.status = "failed";
      })

      //Loan Details
      .addCase(loanDetails.fulfilled, (s, a) => {})

      .addCase(signOut.fulfilled, () => initialState);
  },
});

////
const selectLoansState = (state) => state.loans;
// export const selectAllLoans = createSelector(
//   [selectLoansState],
//   (loansState) => loansState
// );

export const selectScheduleState = createSelector(
  [selectLoansState],
  (state) => state.currentSchedule
);

export const selectLoanItems = createSelector(
  (state) => state.loans.items,
  (items) => {
    const activeLoans = items.filter((item) => item.loanStatus !== "fullypaid");
    const fullypaidLoans = items.filter(
      (item) => item.loanStatus == "fullypaid"
    );
    const paidM = items.filter(
      (item) => item.emiStatus === "Done" && item.loanStatus !== "fullypaid"
    );
    const remaningM = items.filter(
      (item) => item.emiStatus === "Pending" && item.loanStatus !== "fullypaid"
    );

    return {
      totalLoanAmount: activeLoans.reduce((sum, i) => sum + i.loan_amount, 0),
      totalEmi: activeLoans.reduce((sum, i) => sum + i.emi, 0),
      paidPrincipal: activeLoans.reduce((sum, i) => sum + i.paidPrincipal, 0),
      remainPrincipal: activeLoans.reduce(
        (sum, i) => sum + i.remainingPrincipal,
        0
      ),
      paidInterest: activeLoans.reduce((sum, i) => sum + i.paidInterest, 0),
      remainInterest: activeLoans.reduce(
        (sum, i) => sum + i.remainingInterest,
        0
      ),
      activeLoans,
      fullypaidLoans,
      paidMonth: paidM.reduce((sum, loan) => sum + loan.emi, 0),
      remaningMonth: remaningM.reduce((sum, loan) => sum + loan.emi, 0),
    };
  }
);

export const { computeScheduleFor, removeSummery } = loansSlice.actions;
export default loansSlice.reducer;
