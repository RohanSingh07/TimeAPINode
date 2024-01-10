// Imports for server
const http = require("http");
const {readFileSync} = require('fs');
const https = require("https");

// HTML files
const homepage = readFileSync("./Templates/homepage.html");

// port 
const port = process.env.port || 5000;

// Server
const server = http.createServer((req,res)=>{
    const url = req.url ;
    // Home Page
    if(url ==="/"){
        res.writeHead(200,{'content-type':'text/html'});
        res.write(homepage)
        res.end()
    }
    // API response Page
    else if(url === "/getTimeStories"){
        var time_url = "https://time.com";
        https.get(time_url,function(response){
            let data = "";
            
            // store response result
            response.on("data",function(chunk){
                data += chunk
            })

            // on end
            response.on("end",function(){
                var startIndex = data.search("latest")
                // Cut the data from this index
                data = data.substring(startIndex,)
                // get the until the ul containing all the stories
                data = data.substring(0,data.search("</ul>"))
                // Refine the data to extract list elements
                startIndex = data.search("<ul>")
                data = data.substring(startIndex,)
                var headings = data.split('<h3 class="latest-stories__item-headline">')
                var links = data.split("href")
                var result = []
                for(let i=1;i<7;i++){
                    result.push({"title":headings[i].substring(0,headings[i].search('</h3>')),"link":"https://time.com"+links[i].substring(2,links[i].search('">'))})

                }
                res.writeHead(200,{'content-type':"application/json"})
                res.end(JSON.stringify(result))
            })
        })
        
    }
    // Not Found Page
    else{
        res.writeHead(404,{"content-type":"text/html"});
        res.write("<h1>Page Not Found</h1>");
        res.end();
    }
})

// Listener
server.listen(port,()=>{
    console.log(`Server is listening on port number ${port}`)
})