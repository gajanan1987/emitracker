import { useState } from "react";
import "../../style/account.scss";
import UserInfo from "./component/UserInfo";

const AccountPage = () => {
  return (
    <div className="account-container">
      <UserInfo />
    </div>
  );
};

export default AccountPage;
