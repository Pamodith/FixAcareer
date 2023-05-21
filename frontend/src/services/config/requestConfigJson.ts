let user = JSON.parse(localStorage.getItem("user") || "{}");

if (localStorage.getItem("role") === "admin") {
  user = JSON.parse(localStorage.getItem("admin") || "{}");
}

const requestConfigJson = {
  headers: {
    authorization: "Bearer " + user.accessToken || "",
    "Content-type": "application/x-www-form-urlencoded",
  },
};

export default requestConfigJson;
