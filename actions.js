const { getInput, setInput, exec, env } = require('./util');
(async() => {
    const path=process.argv[2]

    if (path)
        await env(path);
    else
        await env();
        envs = process.env

    await exec('node repo/ZeroSSL/CheckCertificate/checkCertificate.js',envs)

    if (!getInput("id")) {
        console.info("Valid CRS ....")
        await exec('node ./repo/ZeroSSL/ValidCSR/validCSR.js',envs)
        if (getInput("valid")) {
            console.info("Valid CRS success")
            console.info("Create Certificate ...")

            await exec('node ./repo/ZeroSSL/CreateCertificate/createCertificate.js',envs)
            if (getInput("id")) {
                console.info("Create Certificate to success")
                console.info("Set Config DNS ...")

                setInput("name", getInput("cname_validation_p1"))
                setInput("value", getInput("cname_validation_p2"))
                setInput("ttl", getInput("cname_validation_ttl"))
                await exec('node ./repo/Cpanel/DNS/EditZone/editzone.js',envs)
                if (getInput("success")) {
                    console.info("Set Config DNS in success")

                    setInput("ssl_id", getInput("id"))
                    setInput("validation_method", "CNAME_CSR_HASH")
                    console.info("Check Dns ....")

                    await exec('node ./repo/ZeroSSL/CheckDNS/checkDNS.js',envs)
                    if (getInput("valid") == 'true') {
                        console.info("Check Dns in success")

                        return
                    }
                    console.error("Fail valid DNS")
                    return
                }
                console.error("Fail in Config DNS")
                return
            }
            console.error("Create Certificate fail")
            return
        }
        console.error("Valid CRS fail")
        return
    }
    if (getInput("id") && (getInput("valid") == '' || getInput("valid") == 'true')) {
        setInput("ssl_id", getInput("id"))
        console.info("Download Certificate in " + getInput("ssl_path"))

        await exec('node ./repo/ZeroSSL/DownloadCertificate/downloadCertificate.js',envs)
    }
})()