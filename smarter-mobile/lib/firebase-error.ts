export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password is too weak";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later";
    case "auth/invalid-credential":
      return "Invalid login credentials";
    default:
      return "An error occurred. Please try again";
  }
};
