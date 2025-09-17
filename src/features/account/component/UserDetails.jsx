const UserDetails = ({ user, fname, lname, address }) => {
  return (
    <>
      <p>
        <strong>Name:</strong> {fname}
      </p>
      <p>
        <strong>Last Name:</strong> {lname}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Address:</strong> {address}
      </p>
    </>
  );
};

export default UserDetails;
