const { Module } = require('module');
const util = require('util');
const execute = util.promisify(require('child_process').exec);

const setInput = (name, value) =>
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] = value;
const getInput = (name) => process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || ''

async function output(exit) {
    let text = '';
    exit.split('\n').forEach(line => {

        text += line + "\n";
        if (text.match(/(::set-output name=)+(.*)(::)(.*)/g)) {
            const split = text.split(/(::set-output name=)+(.*)(::)(.*)/g);
            const key = split[2];
            const value = split[4]
            setInput(key, value)
            text = ''
        }
    })
}
const exec = async(command,env=process.env) => {
    try {
        const { stdout, stderr } = await execute(command,options={env:env});
        await output(stdout);
    } catch (err) {
        console.error(err);
    };
};

const env = async(path = 'env.json') => {
    const fs = require('fs').promises

    reader = await fs.readFile(path, "binary");
    const json = JSON.parse(reader)
    for (key in json) {
        setInput(key, json[key])
    }
}

exports.setInput = setInput;
exports.getInput = getInput;
exports.exec = exec;
exports.env = env;