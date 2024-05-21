async function fetchPage({ canonicalURL, requestURL, requestOptions, headers }) {
    if (!requestOptions) requestOptions = { method: "GET", headers };
    if (!canonicalURL) canonicalURL = requestURL;
    if (!requestURL) requestURL = canonicalURL;
    return await fetchWithCookies(requestURL, requestOptions)
        .then(response => {
            return {
                canonicalURL,
                request: Object.assign({ URL: requestURL }, requestOptions),
                response
            };
        });
}
async function fetchHTMLPage({ canonicalURL, headers }) {
    let customHeaders = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.tribunalconstitucional.pt/tc/acordaos/',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
    let _headers = Object.assign(customHeaders, headers);
    let method = "GET";
    let requestOptions = { method, headers: _headers };
    let requestURL = null;
    let responsePage = await fetchPage({ canonicalURL, requestURL, requestOptions });
    responsePage.response.headers.set('content-type', 'text/html');
    return responsePage;
}

async function searchAcordaos({startDate, endDate, canonicalURL, headers}) {
    startDate = moment(startDate);
    endDate = moment(endDate);
    const payload = {
        "pesquisatipo": "pesquisa",
        "acnum": "",
        "acano": "",
        "procnum": "",
        "procano": "",
        "datadia": startDate.date(),
        "datames": startDate.month() + 1,
        "dataano": startDate.year(),
        "datadia2": endDate.date(),
        "datames2": endDate.month() + 1,
        "dataano2": endDate.year(),
        "seccao": "",
        "especie": "",
        "relator": "",
        "pesquisa": "",
        "pesquisanegativa": "",
        "prepesquisa": "",
        "submit": "Pesquisar"
    }
    // throw JSON.stringify(payload,null,4)
    let body = querystring.stringify(payload);
    let customHeaders = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.tribunalconstitucional.pt',
        'Pragma': 'no-cache',
        'Referer': 'https://www.tribunalconstitucional.pt/tc/acordaos/',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

    };
    let _headers = Object.assign(customHeaders, headers);
    let method = "POST";
    let requestOptions = { method, headers: _headers, body };
    let requestURL = `https://www.tribunalconstitucional.pt/tc/acordaos/`;
    let responsePage = await fetchPage({ canonicalURL, requestURL, requestOptions });
    responsePage.response.headers.set('content-type', 'text/html');
    return responsePage;
}

async function pagination({ canonicalURL, headers, page, startDate, endDate }) {
    startDate = moment(startDate);
    endDate = moment(endDate);
    const payload = {
        "pesquisatipo": "pesquisa",
        "acnum": "",
        "acano": "",
        "procnum": "",
        "procano": "",
       "datadia": startDate.date(),
        "datames": startDate.month() + 1,
        "dataano": startDate.year(),
        "datadia2": endDate.date(),
        "datames2": endDate.month() + 1,
        "dataano2": endDate.year(),
        "especie": "",
        "relator": "",
        "pesquisa": "",
        "pesquisanegativa": "",
        "prepesquisa": "",
        "submit": "Pesquisar",
        "page": page
    }
    //throw JSON.stringify(payload,null,4)
    let body = JSON.stringify(payload);

    let customHeaders = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.tribunalconstitucional.pt',
        'Pragma': 'no-cache',
        'Referer': 'https://www.tribunalconstitucional.pt/tc/acordaos/',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

    };
    let _headers = Object.assign(customHeaders, headers);
    let method = "POST";
    let requestOptions = { method, headers: _headers, body };
    let requestURL = `https://www.tribunalconstitucional.pt/tc/acordaos/?acnum=&acano=&procnum=&procano=&seccao=&especie=&relator=&datadia=${startDate.date()}&datames=${startDate.month() + 1}&dataano=${startDate.year()}&prepesquisa=&pesquisatipo=pesquisa&pesquisa=&pesquisanegativa=&datadia2=${endDate.date()}&datames2=${endDate.month() + 1}&dataano2=${endDate.year()}&page=${page}`;
   // throw requestURL
    let responsePage = await fetchPage({ canonicalURL, requestURL, requestOptions });
    responsePage.response.headers.set('content-type', 'text/html')
    return responsePage;
}


async function fetchURL({ canonicalURL, headers }) {
    if (canonicalURL.match(/\.html$/)) {
        return [await fetchHTMLPage({ canonicalURL, headers })];
    }

    let match = /startDate=([\d+-]+)&endDate=([\d+-]+)&page=(\d+)/.exec(canonicalURL)
    if (match) {
        let startDate = moment(match[1])
        let endDate = moment(match[2])
        let page = match[3] ? parseInt(match[3]) : 1
        if (page === 1) {
            return [await searchAcordaos({ startDate, endDate, page, canonicalURL, headers })]
        } else {
            return [await pagination({ startDate, endDate, page, canonicalURL, headers })]
        }
        //throw(JSON.stringify({startDate, endDate, page}, null, 4))
    }
}

// https://www.tribunalconstitucional.pt/tc/acordaos/?startDate=2022-01-01&endDate=2022-05-20&page=1
// async function fetchURL({ canonicalURL, headers }) {
//     if (canonicalURL.match(/\.html$/)) {
//         return [await fetchHTMLPage({ canonicalURL, headers })];
//     }
//     let match = canonicalURL.match(/page=(\d+)/);
//     if (match) {
//         let startDateMatch = canonicalURL.match(/startDate=(\d{4})-(\d{2})-(\d{2})/);
//         let endDateMatch = canonicalURL.match(/endDate=(\d{4})-(\d{2})-(\d{2})/);

//         if (startDateMatch && endDateMatch) {
//             let startDate = new Date(${startDateMatch[1]}-${startDateMatch[2]}-${startDateMatch[3]});
//             let endDate = new Date(${endDateMatch[1]}-${endDateMatch[2]}-${endDateMatch[3]});

//             let page = parseInt(match[1]);
//             if (page === 0) {
//                 return [await searchAcordaos(startDate, endDate, canonicalURL, headers)];
//             }
//             return [await pagination({ canonicalURL, headers, page, startDate, endDate })];
//         }
//     }
//     return [];
//  }

// "pesquisatipo": "pesquisa",
        // "acnum": "",
        // "acano": "",
        // "procnum": "",
        // "procano": "",
        // "datadia": 1,
        // "datames": 1,
        // "dataano": startDate.year(),
        // "datadia2": 12,
        // "datames2": 12,
        // "dataano2": endDate.year(),
        // "especie": "",
        // "relator": "",
        // "pesquisa": "",
        // "pesquisanegativa": "",
        // "prepesquisa": "",
        // "submit": "Pesquisar",
        //"page": "1"