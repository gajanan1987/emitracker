import supabase from "./supabase";

//Signup New User
export async function addNewUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error("Demo did not be lodaded");
  }
  return data;
}

//Login User
export async function loginUser(user, pwd) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: user,
    password: pwd,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

//Update User
export async function updateUser({ email, password }) {
  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
  });

  if (error) {
    throw new Error("Demo did not be lodaded");
  }
  return data;
}

export async function addLoan(
  id,
  loanAmount,
  interestRate,
  tenure,
  emi,
  loanDate,
  emiDate,
  loanName
) {
  const { data, error } = await supabase
    .from("loan")
    .insert([
      {
        user_id: id, // Replace with logged-in user
        loan_amount: loanAmount,
        interest_rate: interestRate,
        tenure_months: tenure,
        emi_amount: emi,
        loan_date: loanDate,
        emi_date: emiDate,
        loan_name: loanName,
      },
    ])
    .select();

  if (error) {
    throw new Error("Demo did not be lodaded");
  }
  return data;
}

export async function getAllLoanDetails() {
  const { data, error } = await supabase.from("loan").select("*");

  if (error) {
    throw new Error("data not be lodaded");
  }
  return data;
}

export async function getUserLoanDetailsbyId(uid) {
  const { data, error } = await supabase.from("loan").select("*").eq("id", uid);

  if (error) {
    throw new Error("data not be lodaded");
  }
  return data;
}

export async function getUserLoan(id) {
  const { data, error } = await supabase
    .from("loan")
    .select("*")
    .eq("user_id", id);

  if (error) {
    // throw new Error("data not be lodaded", { error });
    return error.message;
  }
  return data;
}

//Logout User
export async function logoutUser() {
  let { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Demo did not be lodaded");
  }
}

export async function getUser() {
  const { data } = await supabase.auth.getSession();
  return data;
}
