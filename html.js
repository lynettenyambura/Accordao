import fetch from 'node-fetch';
import makeFetchCookie from 'fetch-cookie';
import fs from 'fs';
import cheerio from 'cheerio';

const fetchCookie = makeFetchCookie(fetch);
const baseUrl = "https://www.tribunalconstitucional.pt/tc/acordaos/";
const startDate = new Date('2023-01-01');
const endDate = new Date('2024-05-10');

async function fetchHTMLPage(url, filePath) {
    const response = await fetch(url, {
        method: 'GET',
        headers:{
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
    });
    const html = await response.text();
    fs.writeFileSync(filePath, html);
    console.log('HTML saved to', filePath);

    const links = extractLinks(html, url);
    fs.writeFileSync(linksFilePath, links.join('\n'));
    console.log('Links saved to', linksFilePath);
    return links;
}

function extractLinks(html, baseURL) {
    const $ = cheerio.load(html);
    const links = [];

    $('.acac a').each((i, elem) => {
        const link = $(elem).attr('href');
        if (link) {
            links.push(new URL(link, baseURL).href);
        }
    });

    return links;
}

async function pagination(baseUrl, payload, pageNumber) {
    const url = new URL(baseUrl);
    url.searchParams.append('page', pageNumber);

    const response = await fetchCookie(url.href, {
        method: 'POST',
        headers:{
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'cookie': '_ga=GA1.1.35997564.1715405383; AF_SID=3f2e9e08049afb3ab8d99c27e3d9cf19; _ga_Q08M9WSQTT=GS1.1.1716035183.31.1.1716035853.0.0.0',
            'pragma': 'no-cache',
            'priority': 'u=0, i',
            'referer': 'https://www.tribunalconstitucional.pt/tc/acordaos/',
            'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
        
          
        body: new URLSearchParams(payload).toString(),
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];

    $('.ilistashtmlminimal_in .trfundodiff').each((index, element) => {
        const $element = $(element);
        const acordao = $element.find('.acac a').text().trim();
        const processo = $element.find('.processo').text().trim();
        let formacao = $element.find('.seccao').text().trim();
        let especie = $element.find('.especie').text().trim();
        const data = $element.find('.data').text().trim();
        let relator = $element.find('.relator').text().trim();

        if (formacao === "Conf.") {
            formacao = {
                name: "Conferência",
                URL: "http://vlex.com/tc/2000/formacao/conferencia"
            };
        } else if (formacao === "Plen.") {
            formacao = {
                name: "Plenário",
                URL: ""
            };
        }
        if (especie === "Recurso") {
            especie = {
                name: "Recurso",
                URL: "http://vlex.com/tc/2000/especie/recurso"
            };
        }
        relator = relator.replace('Cons. ', ''); 
        relator = {
            name: relator,
            URL: `http://vlex.com/tc/2000/relatores/${encodeURIComponent(relator.toLowerCase().replace(/ /g, '-'))}`
        };
        results.push({ acordao, processo, formacao, especie, data, relator });
    });
    return results;
}

async function searchAcordaos(startDate, endDate) {
    const url = "https://www.tribunalconstitucional.pt/tc/acordaos/";
    const payload = {
        pesquisatipo: "pesquisa",
        acnum: "",
        acano: "",
        procnum: "",
        procano: "",
        datadia: startDate.getDate(),
        datames: startDate.getMonth() + 1,
        dataano: startDate.getFullYear(),
        datadia2: endDate.getDate(),
        datames2: endDate.getMonth() + 1,
        dataano2: endDate.getFullYear(),
        seccao: "",
        especie: "",
        relator: "",
        pesquisa: "",
        pesquisanegativa: "",
        prepesquisa: "",
        submit: "Pesquisar"
    };

    // Fetch data from page 0 to page 5
    const totalPages = 6; // 0 to 5
    const allResults = [];
    for (let i = 0; i < totalPages; i++) {
        const currentPageResults = await pagination(url, payload, i);
        allResults.push(...currentPageResults);
    }

    return allResults;
}

const htmlFilePath = './acordaos.html'; 
const linksFilePath = './links.txt';

fetchHTMLPage(baseUrl, htmlFilePath)
    .then(links => {
        console.log('HTML saved successfully');
        //console.log('Extracted links:', links);
        return searchAcordaos(startDate, endDate);
    })
    .then(results => {
        const json = JSON.stringify(results, null, 2);
        const filename = './acordaos.json';
        fs.writeFileSync(filename, json);
        console.log('Data saved to', filename);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
