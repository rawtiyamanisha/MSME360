import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useAuthContext();
  
  return {
    user: context.currentUser,
    profile: context.userProfile,
    loading: context.loading,
    login: context.login,
    signup: context.signup,
    logout: context.logout,
    updateProfile: context.updateUserProfile,
    isAuthenticated: !!context.currentUser,
    isCreditOfficer: context.userProfile?.role === "credit_officer",
    isMSMEOwner: context.userProfile?.role === "msme_owner",
    isAdmin: context.userProfile?.role === "administrator",
  };
}
