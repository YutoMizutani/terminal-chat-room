var fs = require("fs");
var server = require("http").createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(8080);
var io = require("socket.io").listen(server);

var userHash = {};

io.sockets.on("connection", function (socket) {

  // Connected actions
  socket.on("connected", function (name) {
    console.log("Connected: " + name + " (" + socket.id + ")")
    var msg = name + "さんが入室しました";
    userHash[socket.id] = name;
    io.sockets.emit("publish", {value: msg});
  });

  // Publish message
  socket.on("publish", function (data) {
    console.log("Published: " + data.value)
    io.sockets.emit("publish", {value:data.value});
  });

  // Disconnected actions
  socket.on("disconnect", function () {
    if (userHash[socket.id]) {
      console.log("Disconnected: " + userHash[socket.id] + " (" + socket.id + ")")
      var msg = userHash[socket.id] + "さんが退出しました";
      delete userHash[socket.id];
      io.sockets.emit("publish", {value: msg});
    }
  });
});

console.log('Server running at http://localhost:8080/');
