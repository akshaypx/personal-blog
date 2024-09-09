import fs from "fs";
import http from "http";
import ejs from "ejs";

var server = http.createServer((req, res) => {
  if (req.url === "/home") {
    res.writeHead(200, { "Content-Type": "text/html" });
    let file = JSON.parse(fs.readFileSync("data/articles.json", "utf-8"));
    let articles = "";
    let div = "";
    file.forEach((f, _) => {
      let article =
        "<span style='display:flex; justify-content:space-between;'}><h2>" +
        f.title +
        "</h2><p>" +
        f.date +
        "</p></span>";
      articles += article;
    });
    div =
      "<div style='display:flex; flex-direction:column; gap:2'><h1>Personal Blog</h1>" +
      articles +
      "</div>";
    // let html = ejs.render();
    res.end(div);
  }
});

server.listen(8000);
