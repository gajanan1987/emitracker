import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import supabase from "../services/supabase";
import { signOut } from "./authSlice";
import { normalizeLoan } from "../utils/normalizeLoan";
import { genrateEmi } from "../utils/genrateEmi";

// 🔧 Helpers
const enrichLoan = (loan) => {
  const normalized = normalizeLoan(loan);
  const { summery } = genrateEmi(normalized);
  return { ...normalized, ...summery };
};

// ✅ Create Loan
export const createLoan = createAsyncThunk(
  "loans/createLoan",
  async ({ loan, remaining }, { rejectWithValue }) => {
    const { error, data } = await supabase
      .from("loan")
      .insert([loan])
      .select()
      .single();
    if (error) return rejectWithValue(error.message);
    return { ...data, remainingEmi: remaining };
  }
);

// ✅ Edit Loan
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
    if (!data) return rejectWithValue("No loan found with that ID");
    return { ...data, remainingEmi: remaining };
  }
);

// ✅ Fetch Loans
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

// ✅ Delete Loan
export const deleteLoan = createAsyncThunk(
  "loans/deleteLoan",
  async (loanId, { rejectWithValue }) => {
    const { error } = await supabase.from("loan").delete().eq("id", loanId);
    if (error) return rejectWithValue(error.message);
    return { id: loanId };
  }
);

// ✅ Loan Details
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

      state.emiSummary = summery;
      if (type !== "addLoan") state.currentSchedule = scheduleArr;
    },
    removeSummery: (state) => {
      state.currentSchedule = null;
      state.emiSummary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchLoans.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchLoans.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = (a.payload || []).map(enrichLoan);
      })
      .addCase(fetchLoans.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // Create
      .addCase(createLoan.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(createLoan.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items.push(enrichLoan(a.payload));
        s.currentSchedule = null;
        s.emiSummary = null;
      })
      .addCase(createLoan.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // Edit
      .addCase(editLoan.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(editLoan.fulfilled, (s, a) => {
        s.status = "succeeded";
        const updated = enrichLoan(a.payload);
        const idx = s.items.findIndex((item) => item.id === updated.id);
        if (idx !== -1) {
          s.items[idx] = updated;
        } else {
          s.items.push(updated);
        }
        s.currentSchedule = null;
        s.emiSummary = null;
      })
      .addCase(editLoan.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // Delete
      .addCase(deleteLoan.pending, (s) => {
        s.status = "loading";
      })
      .addCase(deleteLoan.fulfilled, (s, a) => {
        s.items = s.items.filter((item) => item.id !== a.payload.id);
        s.status = "idle";
      })
      .addCase(deleteLoan.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // Loan Details
      .addCase(loanDetails.fulfilled, (s, a) => {
        // Here we could enrich loan if needed
        s.currentSchedule = null;
        s.emiSummary = null;
      })

      // Sign out
      .addCase(signOut.fulfilled, () => initialState);
  },
});

//// ✅ Selectors
const selectLoansState = (state) => state.loans;

export const selectScheduleState = createSelector(
  [selectLoansState],
  (state) => state.currentSchedule
);

export const selectLoanItems = createSelector(
  (state) => state.loans.items,
  (items) => {
    const activeLoans = items.filter((i) => i.loanStatus !== "fullypaid");
    const fullypaidLoans = items.filter((i) => i.loanStatus === "fullypaid");

    const paidM = items.filter(
      (i) => i.emiStatus === "Done" && i.loanStatus !== "fullypaid"
    );
    const remaningM = items.filter(
      (i) => i.emiStatus === "Pending" && i.loanStatus !== "fullypaid"
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
