import fs from "fs";
import http from "http";
import ejs from "ejs";
import helper from "./helper.js";

var server = http.createServer((req, res) => {
  if (req.url === "/home") {
    res.writeHead(200, { "Content-Type": "text/html" });
    let htmlData = fs.readFileSync("views/home.ejs", "utf-8");
    let htmlRenderized = ejs.render(htmlData, { helper: helper });
    res.end(htmlRenderized);
  }
});

server.listen(8000);
