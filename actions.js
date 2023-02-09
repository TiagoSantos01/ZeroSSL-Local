const { getInput, setInput, exec, env } = require('./util');
(async() => {
    if (getInput("env"))
        await env(getInput("env"));
    else
        await env();

    await exec('node ./repo/ZeroSSL/CheckCertificate/checkCertificate')
    if (!getInput("id")) {
        console.info("Valid CRS ....")
        await exec('node ./repo/ZeroSSL/ValidCSR/validCSR.js')

        if (getInput("valid")) {
            console.info("Valid CRS success")
            console.info("Create Certificate ...")

            await exec('node ./repo/ZeroSSL/CreateCertificate/createCertificate.js')
            if (getInput("id")) {
                console.info("Create Certificate to success")
                console.info("Set Config DNS ...")

                setInput("name", getInput("cname_validation_p1"))
                setInput("value", getInput("cname_validation_p2"))
                setInput("ttl", getInput("cname_validation_ttl"))
                await exec('node ./repo/Cpanel/DNS/EditZone/editzone.js')
                if (getInput("success")) {
                    console.info("Set Config DNS in success")

                    setInput("ssl-id", getInput("id"))
                    setInput("validation_method", "CNAME_CSR_HASH")
                    console.info("Check Dns ....")

                    await exec('node ./repo/ZeroSSL/CheckDNS/checkDNS.js')
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
        setInput("ssl-id", getInput("id"))
        console.info("Download Certificate in " + getInput("ssl-path"))

        await exec('node ./repo/ZeroSSL/DownloadCertificate/downloadCertificate.js')
    }
})()