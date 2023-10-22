# Set up a webhook

Providing that your project is set-up on GitHub, you will need to configure your Strapi Project Repository with a webhook. The following article provides additional information to the steps below: GitHub Creating Webhooks Guide.

You need to access the Settings tab for your Strapi Project Repository:

- Navigate and click to Settings for your repository.
- Click on Webhooks, then click Add Webhook.
- The fields are filled out like this:
```
Payload URL: Enter http://your-ip-address:8080
Content type: Select application/json
Which events would you like to trigger this webhook: Select Just the push event
Secret: Enter YourSecret
Active: Select the checkbox
```
- Review the fields and click Add Webhook.
- Next, you need to create a Webhook Script on your server. These commands create a new file called webhook.js which will hold two variables:

```shell
cd ~
mkdir NodeWebHooks
cd NodeWebHooks
sudo nano webhook.js
```

In the nano editor, copy/paste the following script, but make sure to replace your_secret_key and repo with the values that correspond to your project, then save and exit.
(This script creates a variable called PM2_CMD which is used after pulling from GitHub to update your project. The script first changes to the home directory and then runs the variable PM2_CMD as pm2 restart strapi. The project uses the ecosystem.config.js as the point of starting your application.)

```javascript
var secret = 'your_secret_key'; // Your secret key from Settings in GitHub
var repo = '~/path-to-strapi-root-folder/'; // path to the root of your Strapi project on server

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

const PM2_CMD = 'cd ~ && pm2 startOrRestart ecosystem.config.js';

http.createServer(function(req, res) {
  req.on('data', function(chunk) {
  let sig = 'sha1=' + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

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
}).listen(8080);
```


Allow the port to communicate with outside web traffic for port 8080:
Within your AWS EC2 dashboard:
- In the left hand menu, click on Security Groups,
- Select with the checkbox, the correct Group Name, e.g. strapi,
- At the bottom of the screen, in the Inbound tab, click Edit, and then Add Rule:
```
Type: Custom TCP
Protocol: TCP
Port Range: 8080
Source: Custom 0.0.0.0/0, ::/0
```
- Then Save
- If the ufw firewall is enabled, configure settings to include port 8080 by running the following command:
sudo ufw allow 8080/tcp

Earlier you setup pm2 to start the services (your Strapi project) whenever the EC2 instance reboots or is started. You will now do the same for the webhook script.

Install the webhook as a Systemd service

Run echo $PATH and copy the output for use in the next step.
```shell
cd ~
echo $PATH
```

```
/home/your-name/.npm-global/bin:/home/your-name/bin:/home/your-name/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```


Create a `webhook.service` file:
`sudo nano /etc/systemd/system/webhook.service`

In the nano editor, copy/paste the following script, but make sure to replace ubuntu in two places if you changed the default ubuntu user, and paste the $PATH from above.
```shell
✋ Caution
Delete the #comments before saving, then save and exit.

[Unit]
Description=Github webhook
After=network.target

[Service]
Environment=PATH=/PASTE-PATH_HERE #path from echo $PATH (as above)
Type=simple
User=ubuntu #replace with your name, if changed from default ubuntu user
ExecStart=/usr/bin/node /home/ubuntu/NodeWebHooks/webhook.js #replace with your name, if changed from default ubuntu user
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start the new service, so it starts when the system boots:
- `sudo systemctl enable webhook.service`
- `sudo systemctl start webhook`

Check the status of the webhook:
sudo systemctl status webhook

You may test your webhook by following the instructions here.
