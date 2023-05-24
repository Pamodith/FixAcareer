export const getCurrentAdminId = () => {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  if (admin && admin._id) return admin._id;
  return null;
};
