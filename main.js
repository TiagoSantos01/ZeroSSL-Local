const fs = require('fs');
const { getInput, setInput, exec, env } = require('./util');
const zerossl = "./repo/ZeroSSL";
const cpanel = "./repo/Cpanel";
(async() => {
    if (fs.existsSync(zerossl))
        await exec(`git pull origin`);
    else
        await exec(`git clone https://github.com/TiagoSantos01/ZeroSSL ${zerossl}`);

    if (fs.existsSync(cpanel))
        await exec(`git pull origin`);
    else
        await exec(`git clone https://github.com/TiagoSantos01/Cpanel ${cpanel}`);

    const dir = './env';
    fs.readdir(dir, async(err, files) => {
        for await (file of files) {
            setInput("env", `./env/${file}`);
            await exec("node ./actions.js");
        }
    });
})()