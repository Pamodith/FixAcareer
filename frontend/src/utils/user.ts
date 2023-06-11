export const getCurrentUserId = () => {
  const admin = JSON.parse(localStorage.getItem("user") || "{}");
  if (admin && admin._id) return admin._id;
  return null;
};
