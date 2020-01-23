/**
 * @file Helper to produce human readable error messages
 */

"use strict";

/**
 * Obtaining a human readable error message from an error object.
 *
 * @param {object} error An error object. Many exception handling processes return such an object.
 * @returns {string} The error message
 */
function error_message_from_error(error) {

    if (error.status) {

        // In this case the error is a response from http query performed using a fetch instruction

        return "status: " + error.status + " --- statusText: " + error.statusText + " --- url: " + error.url;

    } else {

        // Here there may be other ways to convert error to text according to other types of errors

        return "";
    }

}

