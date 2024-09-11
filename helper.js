import fs from "fs";

export const getArticlesList = () => {
  let articles = JSON.parse(fs.readFileSync("data/articles.json", "utf-8"));
  return articles;
};
export const getArticle = (articleId) => {
  let articles = JSON.parse(fs.readFileSync("data/articles.json", "utf-8"));
  let article = articles.filter((a, i) => {
    if (parseInt(a.id) === parseInt(articleId)) return a;
  });
  return article ? article : null;
};
