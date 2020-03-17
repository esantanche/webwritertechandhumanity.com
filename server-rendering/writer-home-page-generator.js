#!/usr/bin/env node

var fs = require("fs");

const fetch = require('/usr/lib/node_modules/node-fetch');

const backendUrl = "https://backend.emanuelesantanche.com";

/**
 * This function produces a slug from the title of an article.
 *
 * Converts this:
 * How do I protect my investment in bespoke software?
 * into this:
 * how-do-i-protect-my-investment-in-bespoke-software
 *
 * A slug is better suited to be part of a URL than the original title.
 * It has no whitespaces, all chars are lowercase and everything that is not
 * alphanumeric is stripped away.
 *
 * @param {string} title The title we have to convert into a slug
 * @returns {string} The slug
 */
const titleToSlug = (title) => {

    // Some special chars like 'à' are translated in less troublesome ones like 'a'

    const specialChars = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;';
    const correspondingStandardChars = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------';
    const regularExpressionToFindSpecialChars = new RegExp(specialChars.split('').join('|'), 'g');

    return title.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(regularExpressionToFindSpecialChars, c => correspondingStandardChars.charAt(specialChars.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

const produceElementHtmlForItem = (item) => {

    let classNameForClipping = "";
    let dataAttributes = "";

    // Articles are shaped as circles, Ideas as diamonds, Subjects as squares,
    // Messages are identified by a standard icon (Message.png)
    // Same for the contact me page (ContactMe.png)

    switch (item.field_item_type) {
        case "Article":
            urlImage = backendUrl + item.field_image;
            classNameForClipping = "round-shaped-element-clip";
            break;
        case "Idea":
            urlImage = backendUrl + item.field_image;
            classNameForClipping = "diamond-shaped-element-clip";
            break;
        case "Message":
            urlImage = "/Message.png";
            break;
        case "Subject":
            urlImage = backendUrl + item.field_image;
            // These get no classNameForClipping because they are squares
            break;
        case "ContactMe":
            urlImage = "/ContactMe.png";
            break;
        default:
    }

    // Creating the data attributes the javascript running in the browser will
    // will use for animations, to set the url of an item, etc.

    dataAttributes = `data-nid="${item.nid}" 
        data-order="${item.field_order_number}" 
        data-title="${item.title}"
        data-x-coord="${item.field_coordinate_x}"
        data-y-coord="${item.field_coordinate_y}"
        data-type="${item.field_item_type}"
        data-path="${"/item/" + item.nid + "/" + titleToSlug(item.title)}"`;

    // Returning the html for the item passed as argument

    return `
    <div class="item-image ${classNameForClipping}" 
         style="top: ${item.field_coordinate_y - 100}px; left: ${item.field_coordinate_x - 100}px"
         ${dataAttributes}>
        <img src=${urlImage}>
    </div>`;

}

let mapHtml = "";

// createIndexHtml will be a function that takes a single parameter, replaces it in the template of the index.html
// page and returns the finished index.html page as a string
const createIndexHtml = require('../indextemplate.js');

// Opening the stream to write the index.html file
var indexhtmlstream = fs.createWriteStream("../index.html", {flags:'w'});

// Going to fetch the items from the backend
fetch("https://backend.emanuelesantanche.com/rest/WRT/view/items?_format=json", {
        method: 'GET',
    })
        .then((response) => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then((response) => {

            response.map((item) =>  {

                // Calculating the html code for each item and adding it to the
                // variable mapHtml
                mapHtml += produceElementHtmlForItem(item);

            });

            // the variable indexhtmlString will contain the full index.html file
            // as a string
            indexhtmlString = createIndexHtml(`<div id="MapImage">${mapHtml}</div>`)

            indexhtmlstream.write(indexhtmlString);
            indexhtmlstream.end();

        })
        .catch((error) => {

            console.error(error);
        });
