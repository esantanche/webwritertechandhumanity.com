#!/usr/bin/env node

var fs = require("fs");

const APP_CONFIGURATION = {
    // The base url of the backend
    backendUrl: 'https://backend.emanuelesantanche.com',
    smallScreenWidth: 600
};

// field_coordinate_x: "2900"​
//             //     // field_coordinate_y: "2700"
//             //     // field_image: "/sites/default/files/2019-02/DorothyRowe.jpg"
//             //     // field_item_type: "Article"
//             //     // field_order_number: "2"
//             //     // nid: "100"

const produceElementHtmlForItem = (item) => {

    let classNameForClipping = "";
    let dataAttributes = "";

    // Articles are shaped as circles, Ideas as diamonds, Subjects as Squares,
    // Messages are identified by a standard icon to be chosen.

    switch (item.field_item_type) {
        case "Article":
            urlImage = APP_CONFIGURATION.backendUrl + item.field_image;
            classNameForClipping = "round-shaped-element-clip";
            break;
        case "Idea":
            urlImage = APP_CONFIGURATION.backendUrl + item.field_image;
            classNameForClipping = "diamond-shaped-element-clip";
            break;
        case "Message":
            urlImage = "/Message.png";
            break;
        case "Subject":
            urlImage = APP_CONFIGURATION.backendUrl + item.field_image;
            break;
        case "ContactMe":
            urlImage = "/ContactMe.png";
            break;
        default:
    }

    //"nid":"134","field_order_number":"35","title":"Contact Me","field_coordinate_x":"4300","field_coordinate_y":"1580","field_image":"",
    // "field_item_type":"ContactMe

    // FIXME should I add a data for the url? so that I don't have to calculate it on the client side?

    dataAttributes = `data-nid="${item.nid}" 
        data-order="${item.field_order_number}" 
        data-title="${item.title}"
        data-x-coord="${item.field_coordinate_x}"
        data-y-coord="${item.field_coordinate_y}"
        data-type="${item.field_item_type}"`;

    return `
    <div class="item-image ${classNameForClipping}" 
         style="top: ${item.field_coordinate_y - 100}px; left: ${item.field_coordinate_x - 100}px"
         ${dataAttributes}>
        <img src=${urlImage}>
    </div>`;

}


let mapHtml = "";

const fetch = require('/usr/lib/node_modules/node-fetch');

// FIXME fix names!
const createString = require('../indextemplate.js');


//console.log(indexhtmlString);

var indexhtmlstream = fs.createWriteStream("../index.html", {flags:'w'});


fetch("https://backend.emanuelesantanche.com/rest/WRT/view/items?_format=json", {
        method: 'GET',
    })
        .then((response) => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then((response) => {

            // TODO what about the other pages? the contact me? 
            // TODO what about the diamonds, the rounds?

            console.log(response);

            response.map((item) =>  {

    
                // http://localhost/item/99/introducing-articles

                // FIXME need this? const itemURL = writerSiteURL + "item/" + item.nid + "/" + titleToSlug(item.title);

                mapHtml += produceElementHtmlForItem(item);

            });

            //writeLineToSitemapFile(sitemapFooter);

            indexhtmlString = createString(`<div id="MapImage">${mapHtml}</div>`)

            indexhtmlstream.write(indexhtmlString);
            indexhtmlstream.end();

            //stream.end();

        })
        .catch((error) => {

            console.error(error);
        });

// FIXME This script generates the map for the writer website (https://webwritertechandhumanity.com/)
// FIXME it means that it generates the index.html file

// const writerSiteURL = "https://webwritertechandhumanity.com/";

// const sitemapHeader = '<?xml version="1.0" encoding="UTF-8"?> \n\
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

// const sitemapFooter = '\n</urlset>\n';

// const fetch = require('/usr/lib/node_modules/node-fetch');
// var fs = require("fs");
// var os = require("os");

// var stream = fs.createWriteStream("/srv/sites/webwritertechandhumanity.com/sitemap.xml", {flags:'w'});

// const titleToSlug = (title) => {

//     // Some special chars like 'à' are translated in less troublesome ones like 'a'

//     const specialChars = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;';
//     const correspondingStandardChars = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------';
//     const regularExpressionToFindSpecialChars = new RegExp(specialChars.split('').join('|'), 'g');

//     return title.toString().toLowerCase()
//         .replace(/\s+/g, '-') // Replace spaces with -
//         .replace(regularExpressionToFindSpecialChars, c => correspondingStandardChars.charAt(specialChars.indexOf(c))) // Replace special characters
//         .replace(/&/g, '-and-') // Replace & with 'and'
//         .replace(/[^\w\-]+/g, '') // Remove all non-word characters
//         .replace(/\-\-+/g, '-') // Replace multiple - with single -
//         .replace(/^-+/, '') // Trim - from start of text
//         .replace(/-+$/, '') // Trim - from end of text
// }

// const produceSitemapURLelementFromArticleURL = (articleURL) => {

//     return `
// <url>
//      <loc>${articleURL}</loc>
//      <priority>.5</priority>
//      <changefreq>weekly</changefreq>
// </url>`;
// }

// const reportError = (error) => {

//     console.error("Error from script: " + __filename);
//     console.error("Host: " + os.hostname());
//     console.error(error);

// }

// const writeLineToSitemapFile = (line) => {

//     try {
//         stream.write(line);
//     }
//     catch(error) {
//         reportError(error);
//     }

// }

// const urlsToAddToTheSitemap = [

//     "https://webwritertechandhumanity.com/",
//     "https://webwritertechandhumanity.com/privacy-policy",
//     "https://webwritertechandhumanity.com/about-me",
//     "https://webwritertechandhumanity.com/web-writer-tech-and-humanity"

// ];

// fetch("https://backend.emanuelesantanche.com/rest/WRT/view/items?_format=json", {
//         method: 'GET',
//     })
//         .then((response) => {
//             if (!response.ok) { throw response }
//             return response.json()
//         })
//         .then((response) => {

//             writeLineToSitemapFile(sitemapHeader);

// 	        urlsToAddToTheSitemap.map((urlToAddToTheSiteMap) => {

//                 writeLineToSitemapFile(produceSitemapURLelementFromArticleURL(urlToAddToTheSiteMap));

//             });

//             response.map((item) =>  {

//                 // http://localhost/item/99/introducing-articles

//                 const itemURL = writerSiteURL + "item/" + item.nid + "/" + titleToSlug(item.title);

//                 writeLineToSitemapFile(produceSitemapURLelementFromArticleURL(itemURL));

//             });

//             writeLineToSitemapFile(sitemapFooter);

//             stream.end();

//         })
//         .catch((error) => {

//             reportError(error);
//         });





