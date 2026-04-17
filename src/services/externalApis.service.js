const axios = require("axios");

const getGender = (name) => {
  return axios.get(`https://api.genderize.io?name=${name}`);
};

const getAge = (name) => {
  return axios.get(`https://api.agify.io?name=${name}`);
};

const getNationality = (name) => {
  return axios.get(`https://api.nationalize.io?name=${name}`);
};

module.exports = {
  getGender,
  getAge,
  getNationality,
};
