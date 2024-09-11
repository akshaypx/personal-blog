import fs from "fs";

function helper() {
  let articles = JSON.parse(fs.readFileSync("data/articles.json", "utf-8"));
  return articles;
}
export default helper;
