export const getHeaderInfo = (type: string) => {
  switch (type) {
    case "name":
      return {
        title: "Update Your Name",
        description:
          "Provide your real name to help us verify your information.",
      };
    case "age":
      return {
        title: "Update Your Age",
        description: "Share your actual age so we can confirm our records.",
      };
    case "dateOfBirth":
      return {
        title: "Update Your Birthdate",
        description:
          "Enter your correct birthdate to ensure our data is accurate.",
      };
    case "email":
      return {
        title: "Update Your Email",
        description:
          "A current email helps us keep you informed with important updates.",
      };
    case "phoneNumber":
      return {
        title: "Update Your Phone Number",
        description:
          "Your latest phone number ensures we can reach you with key info.",
      };
    case "address":
      return {
        title: "Update Your Address",
        description:
          "Keeping your address current lets us deliver important updates to you.",
      };
    default:
      return {
        title: "Profile Settings",
        description: "Adjust your profile details here.",
      };
  }
};

export const getHeaderSnapPoints = (type: string) => {
  switch (type) {
    case "name":
      return ["50%"];
    case "age":
      return ["50%"];
    case "dateOfBirth":
      return ["50%"];
    case "email":
      return ["55%"];
    case "phoneNumber":
      return ["50%"];
    case "address":
      return ["50%"];
    default:
      return ["50%"];
  }
};
