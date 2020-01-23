/**
 * @file The model. It fetches data from the backend
 */

"use strict";

// Reference info for item fields
// Values for field_item_type: Article, Idea, Message, Subject, ContactMe

// This is an example of Item. The body is the item content
// nid	"102"
// field_order_number	"4"
// title	"this is a subject"
// field_coordinate_x	"2710"
// field_coordinate_y	"3780"
// field_image	"/sites/default/files/2019-02/DorothyRowe_0.jpg"
// field_item_type	"Subject"

// This is an example of Item content
// nid	"100"
// body	"<p>article great mother</p>"

/**
 * @class Model
 */
function Model() {

    // Private constants

    // Private variables

    // Use jQuery to handle events
    let events = $({});

    let itemsDetails;

    let itemsDetailsReady = false;

    return {

        init: () => {

            // There may be something to do here in the future

        },

        // This function is to fetch item details
        fetchItemDetails: () => {

            fetch(APP_CONFIGURATION.backendUrl + "/rest/WRT/view/items?_format=json", {
                method: 'GET',
            })
                .then((response) => {
                    if (!response.ok) { throw response }
                    return response.json()
                })
                .then((response) => {

                    // console.log('response',response);

                    itemsDetails = response;

                    itemsDetailsReady = true;
                    events.trigger('Model.itemsDetails.ready');
                })
                .catch((error) => {

                    const error_message = error_message_from_error(error);

                    Sentry.captureMessage(error_message);

                });
        },

        /**
         * To fetch the content of a single item given the order number on the map
         * @param orderNumber
         */
        fetchItemContent: (orderNumber) => {

            const indexOfItemOfWhichToFetchContent = itemsDetails.findIndex(item => { return parseInt(item.field_order_number) === orderNumber; });

            fetch(APP_CONFIGURATION.backendUrl + "/rest/WRT/view/itemcontent?nid=" + itemsDetails[indexOfItemOfWhichToFetchContent].nid + "&_format=json", {
                method: 'GET',
            })
                .then((response) => {
                    if (!response.ok) { throw response }
                    return response.json()
                })
                .then((response) => {

                    itemsDetails[indexOfItemOfWhichToFetchContent].body = response[0].body;

                    events.trigger('Model.itemContent.ready');

                })
                .catch((error) => {

                    const error_message = error_message_from_error(error);

                    Sentry.captureMessage(error_message);

                });

        },

        saveContactMeForm: (fullname, email, message) => {

            const message_node_details = {
                type: [{"target_id": "wrt_contact_me_message"}],
                title: [{"value": "New Message WRT " + fullname}],
                field_name: [{"value": fullname}],
                field_email: [{"value": email}],
                field_message: [{"value": message}]
            };

            fetch(APP_CONFIGURATION.backendUrl + '/node?_format=json', {
                method: 'POST',
                body: JSON.stringify(message_node_details),
                headers: {
                    'Content-Type': 'application/json',
                    'Accepts': 'application/json'
                }
            })
                .then((response) => {
                    if (!response.ok) {

                        throw response;
                    }
                    return response.json()
                })
                .then(function (response_json) {

                    // No error here

                    events.trigger("Model.contactmeform.success");

                })
                .catch(function (error) {

                    const error_message = error_message_from_error(error);

                    Sentry.captureMessage(error_message);

                    events.trigger("Model.contactmeform.error");

                });

        },

        getItemsDetails: () => {

            if (!itemsDetailsReady) {

                return null;
            }

            return itemsDetails;

        },

        attachEventHandler: (event, handler) => {

            events.on(event, handler);

        }

    }

}
