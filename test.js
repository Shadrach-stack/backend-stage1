const axios = require("axios");

axios
  .post("http://localhost:3000/api/profiles", {
    name: "ella",
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.response?.data || err.message);
  });
