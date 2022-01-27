import http, { createServer } from "http";
import fs from "fs";
import { parse } from "querystring";

const empdata = () => {
  let body = "";
  let data = fs.readFileSync("empdetails.txt").toString();
  body = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Fetched Form-Value</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
            </head>
            <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-dark">
            <a class="navbar-brand text-warning" href="#">Employeee-Portal</a>
            
              <ul class="navbar-nav">
                <li class="nav-item active">
                  <a class="nav-link text-light" href="http://localhost:3000">Home </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-light" href="http://localhost:3000/addemployee">Add-Employee</a>
                </li>
                
              </ul>
          </nav>
            <h1>Employee Details</h1>
            <table class="text-center table  table-hover" >
              <thead>
                <tr>
                <th >Employee Name </th>
                <th>Employee Contact </th>
                <th>Employee Email </th>
                </tr>
              </thead>
              <tbody>
              ${data}
              </tbody>
                <table>
            </body>
            </html> `;
  return body;
};

const server = createServer((req, res) => {
  if (req.url == "/") {
    //load details
    res.write(empdata());
  } else if (req.method === "POST" && req.url == "/addemployee") {
    //submitted data adding
    let body = "";
    req.on("data", (data) => {
      body = parse(data.toString());
    });
    console.log(body);
    req.on("data", (data) => {
      res.writeHead(200, { "Content-type": "text/html" });
      console.log(body);
      fs.appendFileSync(
        "empdetails.txt",
        `<tr>
      
      <td> ${body.name}</td>
      <td> ${body.phone}</td>
      <td> ${body.mail}</td>
      </tr>`,
        (err) => {
          if (err) throw err;
          console.log("Appended succesfully");
        }
      );
    });
    res.writeHead(301, { Location: "http://localhost:3000" });
  } else if (req.url == "/addemployee") {
    let data = fs.readFileSync("EmployeeForm.html").toString();
    res.write(data);
  }
  res.end();
});
server.listen(3000);
