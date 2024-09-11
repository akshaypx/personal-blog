import fs from "fs";
import http from "http";
import ejs from "ejs";
import { getArticlesList, getArticle } from "./helper.js";
import url from "url";

var server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === "/home") {
    res.writeHead(200, { "Content-Type": "text/html" });
    let htmlData = fs.readFileSync("views/home.ejs", "utf-8");
    let htmlRenderized = ejs.render(htmlData, {
      getArticlesList: getArticlesList,
    });
    res.end(htmlRenderized);
  }

  if (parsedUrl.pathname.startsWith("/article/")) {
    res.writeHead(200, { "Content-Type": "text/html" });
    let articleNumber = parsedUrl.pathname.slice(9);
    let htmlData = fs.readFileSync("views/article.ejs", "utf-8");
    let htmlRenderized = ejs.render(htmlData, {
      getArticle: getArticle(articleNumber),
    });
    res.end(htmlRenderized);
  }
});

server.listen(8000);
