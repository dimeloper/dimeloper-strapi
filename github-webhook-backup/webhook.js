var secret = 'c0Q9w1G8d31tbQN4FV7hwg=='; // Your secret key from Settings in GitHub
var repo = '~/dimeloper-strapi/'; // path to the root of your Strapi project on server

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

const PM2_CMD = 'cd ~/dimeloper-strapi && yarn install && NODE_ENV=production yarn build && cd ~ && pm2 startOrRestart ecosystem.config.js';

http
.createServer(function(req, res) {
  req.on('data', function(chunk) {
    let sig =
      'sha1=' +
      crypto
      .createHmac('sha1', secret)
      .update(chunk.toString())
      .digest('hex');

    if (req.headers['x-hub-signature'] == sig) {
      exec(`cd ${repo} && git pull && ${PM2_CMD}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    }
  });

  res.end();
})
.listen(8080);
