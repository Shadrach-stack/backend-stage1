const {
  getGender,
  getAge,
  getNationality,
} = require("./src/services/externalApis.service");

async function test() {
  console.log("Testing APIs...");

  const g = await getGender("ella");
  console.log("Gender OK");

  const a = await getAge("ella");
  console.log("Age OK");

  const n = await getNationality("ella");
  console.log("Nationality OK");

  console.log("ALL DONE");
}

test();
