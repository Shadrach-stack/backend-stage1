const {
  getGender,
  getAge,
  getNationality,
} = require("./src/services/externalApis.service");

async function test() {
  const name = "ella";

  const gender = await getGender(name);
  const age = await getAge(name);
  const nationality = await getNationality(name);

  console.log("Gender:", gender.data);
  console.log("Age:", age.data);
  console.log("Nationality:", nationality.data);
}

test();
