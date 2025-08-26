import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../services/supabase";
import { addMonths, format } from "date-fns";

// Save only summary to DB
export const createLoan = createAsyncThunk(
  "loans/createLoan",
  async (payload, { rejectWithValue }) => {
    const { error, data } = await supabase
      .from("loan")
      .insert([payload])
      .select()
      .single();
    if (error) return rejectWithValue(error.message);
    return data;
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

const round = (n) => Math.round(n);

export const recalcSchedule = (op) => {
  const {
    emi_date,
    interest_rate,
    loan_amount,
    loan_date,
    tenure_months,
    loan_name,
  } = op;

  const P = parseFloat(loan_amount);
  const annualRate = parseFloat(interest_rate);
  const n = parseInt(tenure_months);
  const r = annualRate / 12 / 100;

  if (!P || !annualRate || !n || !loan_date || !emi_date) {
    alert("Please fill all fields correctly!");
    return;
  }

  const loanStart = new Date(loan_date);
  const firstEmi = new Date(emi_date);

  // ✅ validation: first EMI date should be after loan start date
  if (firstEmi <= loanStart) {
    alert("First EMI Date must be greater than Loan Start Date!");
    return;
  }

  // EMI Formula
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let balance = P;
  let scheduleArr = [];
  let totalInterest = 0;
  let totalPrincipal = 0;

  let startDate = firstEmi;

  for (let i = 1; i <= n; i++) {
    const interestForMonth = balance * r;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;

    totalInterest += interestForMonth;
    totalPrincipal += principalForMonth;

    const emiDueDate = addMonths(startDate, i - 1);

    scheduleArr.push({
      month: format(emiDueDate, "dd MMM yyyy"),
      emi: round(emi),
      principal: round(principalForMonth),
      interest: round(interestForMonth),
      balance: balance > 0 ? round(balance) : 0,
      date: emiDueDate,
      // date1: emiDueDate.toISOString(),
    });
  }

  // Till date EMIs paid
  const today = new Date();
  const paid = scheduleArr.filter((row) => new Date(row.date) <= today).length;
  const remaining = n - paid;

  const paidPrincipal = scheduleArr
    .slice(0, paid)
    .reduce((sum, row) => sum + row.principal, 0);

  const paidInterest = scheduleArr
    .slice(0, paid)
    .reduce((sum, row) => sum + row.interest, 0);

  const remainingPrincipal = round(P - paidPrincipal);
  const remainingInterest = round(totalInterest - paidInterest);

  // setSchedule(scheduleArr);
  const summery = {
    emi: round(emi),
    interest_rate,
    loan_amount,
    tenure_months,
    totalInterest: round(totalInterest),
    totalPayment: round(P + totalInterest),
    paid,
    remaining,
    paidPrincipal: paidPrincipal,
    paidInterest: paidInterest,
    remainingPrincipal,
    remainingInterest,
    loan_name,
  };

  return { summery, scheduleArr };
};

const loansSlice = createSlice({
  name: "loans",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    currentSchedule: null,
    emiSummary: null,
  },
  reducers: {
    computeScheduleFor: (state, action) => {
      const { data, type } = action.payload;
      const { summery, scheduleArr } = recalcSchedule(data);

      if (type !== "addLoan") {
        state.currentSchedule = scheduleArr;
        state.emiSummary = summery;
      }
      state.emiSummary = summery;
    },
    removeSummery: (state) => {
      state.currentSchedule = null;
      state.emiSummary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLoan.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(createLoan.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items.unshift(a.payload);
        s.currentSchedule = null;
        s.emiSummary = null;
      })
      .addCase(createLoan.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      ////
      .addCase(fetchLoans.pending, (s, a) => {
        s.status = "loading";
      })
      .addCase(fetchLoans.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload || [];
      })
      .addCase(fetchLoans.rejected, (s, a) => {
        s.status = "failed";
        s.items = a.payload || [];
      })
      ////
      .addCase(loanDetails.fulfilled, (s, a) => {})
      ////
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
      });
  },
});

export const { computeScheduleFor, removeSummery } = loansSlice.actions;
export default loansSlice.reducer;
