const { getInput, setInput, exec, env } = require('./util');
(async() => {
    const fs = require('fs');
    const dir = './env';
    fs.readdir(dir, async(err, files) => {
        for await (file of files) {
            setInput("env", `./env/${file}`);
            await exec("./actions.js")
        }
    });
})()