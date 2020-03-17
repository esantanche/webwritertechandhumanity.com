/**
 * @file Utility function to convert a title to a slug.
 * The title belongs to an item. The slug is what we add to the url of the item to
 * help search engines to index the item's page.
 */

"use strict";

// FIXME do I still use this function, or do I calculate the url on the server?

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
function titleToSlug(title) {

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
