import { useEffect, useState } from "react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

import { useNavigate } from "react-router";
import { getProfile, signOut } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDetails from "./UserDetails";
import CustomModal from "../../../components/CustomModal";
import EditProfileModal from "./EditProfileModal";

const UserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error, user, profile, profileStatus } = useSelector(
    (s) => s.auth
  );

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
  };

  const { fname, lname, address, avatar_url } = profile?.[0] || {};

  const handleLogout = async () => {
    dispatch(signOut());
    navigate("/");
  };

  useEffect(() => {
    if (!user) return;
    if (status === "succeeded" && profileStatus === "idle") {
      dispatch(getProfile());
    }
  }, [dispatch, user, status, profileStatus]);
  return (
    <>
      <h2>My Account</h2>
      <div className="avatar-wrapper">
        <img src={avatar_url} alt="User Avatar" />
        {/* <ProfilePhotoUpload /> */}
      </div>
      <div className="account-card">
        {user && (
          <>
            <UserDetails
              user={user}
              fname={fname}
              lname={lname}
              address={address}
            />
            <div className="btn-wrapper">
              <button className="btn btn-primary-hallow" onClick={onOpenModal}>
                Edit Profile
              </button>
              <button className="btn btn-primary-hallow" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      <CustomModal open={open} onCloseModal={onCloseModal}>
        <EditProfileModal
          onCloseModal={onCloseModal}
          user={user}
          fname={fname}
          lname={lname}
          address={address}
          avatar={avatar_url}
        />
      </CustomModal>
    </>
  );
};

export default UserInfo;
