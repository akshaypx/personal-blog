import fs from "fs";
import http from "http";
import ejs from "ejs";
import { getArticlesList, getArticle } from "./helper.js";
import url from "url";
import base64 from "base-64";

function decodeCredentials(authHeader) {
  //authHeader : Basic --------------
  const encodedCredentials = authHeader.trim().replace(/Basic\s+/i, "");
  const decodedCredentials = base64.decode(encodedCredentials);
  return decodedCredentials.split(":");
}

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

  if (parsedUrl.pathname === "/admin") {
    const [username, password] = decodeCredentials(
      req.headers.authorization || ""
    );

    if (username === "admin" && password === "admin") {
      res.writeHead(200, { "Content-Type": "text/html" });
      let htmlData = fs.readFileSync("views/admin.ejs", "utf-8");
      let htmlRenderized = ejs.render(htmlData, {
        getArticlesList: getArticlesList,
      });
      res.end(htmlRenderized);
    } else {
      res.writeHead(401, { "WWW-Authenticate": "Basic realm='user_pages'" });
      res.end("Authentication Required");
    }
  }
  if (parsedUrl.pathname.startsWith("/edit/")) {
    const [username, password] = decodeCredentials(
      req.headers.authorization || ""
    );

    if (username === "admin" && password === "admin") {
      res.writeHead(200, { "Content-Type": "text/html" });
      let htmlData = fs.readFileSync("views/edit.ejs", "utf-8");
      let articleNumber = parsedUrl.pathname.slice(6);
      // console.log("article number=", articleNumber);
      let htmlRenderized = ejs.render(htmlData, {
        getArticle: getArticle(articleNumber),
      });
      res.end(htmlRenderized);
    } else {
      res.writeHead(401, { "WWW-Authenticate": "Basic realm='user_pages'" });
      res.end("Authentication Required");
    }
  }
});

server.listen(8000);
