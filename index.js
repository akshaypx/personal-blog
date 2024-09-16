import fs from "fs";
import http from "http";
import ejs from "ejs";
import { getArticlesList, getArticle } from "./helper.js";
import url from "url";
import base64 from "base-64";
import queryString from "querystring";

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
  // console.log("before /article/");
  if (parsedUrl.pathname.startsWith("/article/")) {
    res.writeHead(200, { "Content-Type": "text/html" });
    let articleNumber = parsedUrl.pathname.slice(9);
    let htmlData = fs.readFileSync("views/article.ejs", "utf-8");
    let htmlRenderized = ejs.render(htmlData, {
      getArticle: getArticle(articleNumber),
    });
    res.end(htmlRenderized);
  }
  // console.log("before /admin/");
  if (parsedUrl.pathname.startsWith("/admin")) {
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
  // console.log("before /edit/");
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
  // console.log("before /update/");
  if (parsedUrl.pathname.startsWith("/update/")) {
    const [username, password] = decodeCredentials(
      req.headers.authorization || ""
    );

    if (username === "admin" && password === "admin") {
      // res.writeHead(200, { "Content-Type": "text/html" });
      const queryStr = parsedUrl.query;
      const data = {
        id: parseInt(queryStr.id),
        title: queryStr.title,
        date: queryStr.date,
        content: queryStr.content,
      };
      console.log(data);
      //console.log(queryStr.title, queryStr.date, queryStr.content);
      let articles = JSON.parse(fs.readFileSync("data/articles.json", "utf-8"));
      let updatedArticles = articles.map((a, i) => {
        if (a.id === data.id) {
          return data;
        } else return a;
      });
      let updated = 0;
      fs.writeFile(
        "data/articles.json",
        JSON.stringify(updatedArticles),
        (err) => {
          if (err) {
            console.log(err);
            res.end("<h1>Error updating!</h1>");
          } else {
            console.log("Article updated successfully");
            updated = 1;
            res
              .writeHead(301, {
                location: `/admin`,
              })
              .end();
          }
        }
      );
    } else {
      res.writeHead(401, { "WWW-Authenticate": "Basic realm='user_pages'" });
      res.end("Authentication Required");
    }
  }
  // console.log("before /new/");
  if (parsedUrl.pathname.startsWith("/new/")) {
    const [username, password] = decodeCredentials(
      req.headers.authorization || ""
    );

    if (username === "admin" && password === "admin") {
      res.writeHead(200, { "Content-Type": "text/html" });
      let htmlData = fs.readFileSync("views/new.ejs", "utf-8");
      let htmlRenderized = ejs.render(htmlData);
      res.end(htmlRenderized);
    } else {
      res.writeHead(401, { "WWW-Authenticate": "Basic realm='user_pages'" });
      res.end("Authentication Required");
    }
  }
  // console.log("before /addnew/");
  if (parsedUrl.pathname.startsWith("/addnew/")) {
    const [username, password] = decodeCredentials(
      req.headers.authorization || ""
    );

    if (username === "admin" && password === "admin") {
      const queryStr = parsedUrl.query;
      const data = {
        title: queryStr.title,
        date: queryStr.date,
        content: queryStr.content,
      };
      console.log(data);
      //console.log(queryStr.title, queryStr.date, queryStr.content);
      let updatedArticles = [];
      if (fs.existsSync("data/articles.json")) {
        let articles = JSON.parse(
          fs.readFileSync("data/articles.json", "utf-8")
        );
        if (articles.length > 0) {
          updatedArticles = [
            ...articles,
            { ...data, id: articles[articles.length - 1].id + 1 },
          ];
        } else {
          updatedArticles = [...articles, { ...data, id: 1 }];
        }
      } else {
        updatedArticles = [{ ...data, id: 1 }];
      }
      let updated = 0;
      fs.writeFile(
        "data/articles.json",
        JSON.stringify(updatedArticles),
        (err) => {
          if (err) {
            console.log(err);
            res.end("<h1>Error Creating!</h1>");
          } else {
            console.log("Article created successfully");
            updated = 1;
            res
              .writeHead(301, {
                location: `/admin`,
              })
              .end();
          }
        }
      );
    } else {
      res.writeHead(401, { "WWW-Authenticate": "Basic realm='user_pages'" });
      res.end("Authentication Required");
    }
  }

  if (parsedUrl.pathname.startsWith("/delete/")) {
    console.log("Delete route hit");
    const [username, password] = decodeCredentials(
      req.headers.authorization || ""
    );

    if (username === "admin" && password === "admin") {
      let articleNumber = parseInt(parsedUrl.pathname.slice(8), 10);

      if (isNaN(articleNumber)) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>Invalid article number!</h1>");
        return;
      }

      if (fs.existsSync("data/articles.json")) {
        let articles;
        try {
          articles = JSON.parse(fs.readFileSync("data/articles.json", "utf-8"));
          console.log("Articles read from file:", articles);
        } catch (error) {
          console.error("Error reading JSON file:", error);
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("<h1>Error reading articles file!</h1>");
          return;
        }

        // Debug logging for articleNumber and JSON content
        console.log(`Article Number to Delete: ${articleNumber}`);
        console.log("Current Articles:", articles);

        let updatedArticles = articles.filter((a) => a.id !== articleNumber);
        console.log("Filtered Articles:", updatedArticles);

        if (updatedArticles.length === articles.length) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("<h1>Article not found!</h1>");
          return;
        }

        // Write updated articles to file
        fs.writeFile(
          "data/articles.json",
          JSON.stringify(updatedArticles, null, 2),
          (err) => {
            if (err) {
              console.error("Error writing file:", err);
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("<h1>Error deleting article!</h1>");
            } else {
              console.log("Article deleted successfully");
              res.writeHead(301, { location: `/admin/` });
              res.end();
            }
          }
        );
      } else {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>No articles file found!</h1>");
      }
    } else {
      res.writeHead(401, {
        "WWW-Authenticate": "Basic realm='user_pages'",
        "Content-Type": "text/html",
      });
      res.end("Authentication Required");
    }
  }
});

server.listen(8000);
