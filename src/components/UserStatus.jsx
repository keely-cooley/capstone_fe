import { useUserContext } from "../context/UserContext";

//shows on login and signup page if current user is logged in.
const UserStatus = () => {
  const { currentUser, handleUpdateUser } = useUserContext();

  if (!currentUser.username) return null; // If no user is logged in, return nothing

  return (
    <div>
      <p>Hi, {currentUser.username}! You are currently logged in.</p>
      <button
        className="button"
        onClick={() => handleUpdateUser({})}
      >
        Log Out
      </button>
    </div>
  );
};

export default UserStatus;