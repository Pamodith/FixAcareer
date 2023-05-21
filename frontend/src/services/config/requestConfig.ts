let user = JSON.parse(localStorage.getItem("user") || "{}");

if (localStorage.getItem("role") === "admin") {
  user = JSON.parse(localStorage.getItem("admin") || "{}");
}

const requestConfig = {
  headers: {
    authorization: "Bearer " + user.accessToken || "",
    "Content-type": "multipart/form-data",
  },
};

export default requestConfig;
