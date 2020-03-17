/**
 * @file The view model of the application.
 * All views "talk" to the view model and the view model "talks" to all views.
 * The views "talk" to the view model by calling its functions.
 * The view model "talks" to views by triggering events.
 */

"use strict";

/**
 * The view model of the application.
 *
 * @class ViewModel
 * @fires ViewModel#ViewModelnonemptypathnameshow
 * @fires ViewModel#ViewModelhomegoto
 */
function ViewModel() {

    // Private variables

    // Use jQuery to handle events
    let events = $({});
    let model;
    let itemsDetails;
    let orderNumberItemCurrentlyVisited;
    let orderNumberClickedItem;
    let orderNumberOfItemOfWhichToShowContent;

    let viewportWidth;
    let viewportHeight;

    let animationToNextItemRunning;
    let itemToShow;
    let nidOfItemToShow;
    let rebuildingPageOnPopStateEvent;

    // const requestItemsDetailsFromModel = () => {

    //     // We are in the process of building the map here

    //     // See registerEventHandlers for event handling

    //     model.fetchItemDetails();

    //     // FIXME just do it here because it's the viewmodel that has the map element
    //     // FIXME better, it's ItemView that owns the map

    // };

    const determineOrderNumberOfItemOfWhichToShowContent = () => {

        // We need the order number of the item we are going to show
        // There are two cases:
        // 1. The user clicked on an item
        // 2. The user clicked on an arrow and we are going to the next or to the previous item

        let orderNumberOfItemToShow;

        if (orderNumberClickedItem) {

            // The user clicked on an item

            orderNumberOfItemToShow = orderNumberClickedItem;

            orderNumberClickedItem = undefined;

        } else {

            // The users clicked on an arrow

            orderNumberOfItemToShow = orderNumberItemCurrentlyVisited;

        }

        return orderNumberOfItemToShow;

    };

    /**
     * When we move to an item we need to change the URL to match it
     * @param itemCurrentlyShown
     */
    const changeURLToMatchItemWhoseContentIsShown = (itemCurrentlyShown) => {

        const urlForItemCurrentlyShown = "/item/" + itemCurrentlyShown.nid + "/" + titleToSlug(itemCurrentlyShown.title);

        // Only if the url is not the same as the one shown, we push the new url
        // to the history
        if (urlForItemCurrentlyShown !== document.location.pathname) {

            history.pushState(null, null, urlForItemCurrentlyShown);

        }

    };

    const changePageTitle = (title) => {

        if (title)
            document.title = `Emanuele Santanche, writer — ${title}`;
        else
            document.title = "Emanuele Santanche, writer";

    };

    /**
     * Used to rebuild the page on popstate event
     *
     * @see registerBrowserNavigationEventHandler
     * @param pathnameWhereToGo
     */
    const rebuildPageOnChangeOfURL = (pathnameWhereToGo) => {

        rebuildingPageOnPopStateEvent = true;

        showItemContentOnNonEmptyPathname(pathnameWhereToGo);

    };

    const registerBrowserNavigationEventHandler = () => {

        // When the user clicks on the back or the forward buttons,
        // we get a popstate event here
        // The URL changes and we need to rebuild the page to show the item
        // the URL is about (it can be the home as well)

        // Sometimes there is no popstate event, but that's fine

        window.onpopstate = function() {

            console.log('onpopstate document.location.pathname', document.location.pathname);

            rebuildPageOnChangeOfURL(document.location.pathname);

        };

    };


    // FIXME comments
    const preparingToShowTheMap = () => {

        // This is the case in which the url is about an item (/item/99/slug-here)
        // We need to set orderNumberItemCurrentlyVisited otherwise the item's content
        // doesn't show up
        if (nidOfItemToShow) {
            const item = itemsDetails.filter(item => {
                return parseInt(item.nid) === nidOfItemToShow;
            })[0];

            orderNumberItemCurrentlyVisited = parseInt(item.field_order_number);
        } else {

            // In this case we are on the starting point of the spiral, to which
            // we assign url /web-writer-tech-and-humanity

            const urlWebWriterTechAndHumanity = "/web-writer-tech-and-humanity";

            if (urlWebWriterTechAndHumanity !== document.location.pathname) {
                history.pushState(null, null, urlWebWriterTechAndHumanity);
            }

        }

        // Telling views that the items are ready to be used to build the map
        events.trigger('ViewModel.map.show');


        // When the user clicks on the home page button we show the map, the items,
        // the arrows and we show the menu button as well
        events.trigger('ViewModel.menu.showbutton');

    }


    

    /**
     * It's where we rebuild the page when the url is about an item or when we need to
     * go to the home
     *
     * @memberOf ViewModel
     * @param {string} pathname The URL of the item to show or "/" for the home
     */
    const showItemContentOnNonEmptyPathname = (pathname) => {

        // The user landed on a non-empty URL. It's not the home they landed on
        // The url is something like http://localhost/item/99/introducing-articles

        // This means that I now hide the home page, show the map, draw the items, move to the item
        // whose nid is in the url, show the item's content, etc

        // The non-empty URL can be /web-writer-tech-and-humanity, which is the starting point of the spiral

        if (/^\/item\/\d+\//.test(pathname) || /^\/web-writer-tech-and-humanity/.test(pathname)) {

            if (/^\/item\/\d+\//.test(pathname))
                nidOfItemToShow = parseInt(pathname.match(/^\/item\/(\d+)\//)[1]);
            else
                nidOfItemToShow = undefined; // case of /web-writer-tech-and-humanity

            /**
             * Event triggered when the page is loaded with a non-empty pathname.
             *
             * @event ViewModel#ViewModelnonemptypathnameshow
             * @memberOf ViewModel
             */
            events.trigger('ViewModel.nonemptypathname.show');
            //requestItemsDetailsFromModel();

            preparingToShowTheMap();

            // if (nidOfItemToShow) {
            //     const item = itemsDetails.filter(item => {
            //         return parseInt(item.nid) === nidOfItemToShow;
            //     })[0];

            //     orderNumberItemCurrentlyVisited = parseInt(item.field_order_number);
            // } else {

            //     // In this case we are on the starting point of the spiral, to which
            //     // we assign url /web-writer-tech-and-humanity

            //     const urlWebWriterTechAndHumanity = "/web-writer-tech-and-humanity";

            //     if (urlWebWriterTechAndHumanity !== document.location.pathname) {
            //         history.pushState(null, null, urlWebWriterTechAndHumanity);
            //     }

            // }

            // // Telling views that the items are ready to be used to build the map
            // events.trigger('ViewModel.itemsDetails.ready');


        } else if (pathname === "/") {

            // Oops, in this case it's really the home page we have to go to

            // Need to reset variables and trigger
            // events to hide some elements and show others

            orderNumberItemCurrentlyVisited = 0;
            animationToNextItemRunning = false;
            rebuildingPageOnPopStateEvent = false;
            orderNumberClickedItem = undefined;
            orderNumberOfItemOfWhichToShowContent = undefined;
            itemToShow = undefined;
            nidOfItemToShow = undefined;

            changePageTitle();

            // This will tell HomeMessageView.js to show the home
            // It will tell ItemView.js to hide carpet, map and everything
            // It will tell ItemContentView.js to hide the item content dialog

            /**
             * Event triggered when we need to go to the home page
             *
             * @event ViewModel#ViewModelhomegoto
             * @memberOf ViewModel
             */
            events.trigger("ViewModel.home.goto");

        } else {

            Sentry.captureMessage("The url is wrong " + pathname);

        }

    };

    /**
     * registerEventHandlers is the standard name for the function that attaches event handlers
     * I'm talking about my custom jquery events
     * No standard events like click
     * @memberOf ViewModel
     */
    const registerEventHandlers = () => {

        model.attachEventHandler('Model.itemContent.ready', () => {

            // The Model has just fetched the content of the item we have to display
            // We put in itemToShow the item the appropriate view has to show

            //itemsDetails = model.getItemsDetails();

            itemToShow = itemsDetails.filter(item => {
                return parseInt(item.field_order_number) === orderNumberOfItemOfWhichToShowContent;
            })[0];

            // If we fetched the item's content because the user clicked on an arrow, we need
            // to change the url to reflect the item currently shown
            // If the url was already there and we got a popstate event, we don't need to change the
            // url. The current one is already the correct one
            if (!rebuildingPageOnPopStateEvent)
                changeURLToMatchItemWhoseContentIsShown(itemToShow);

            changePageTitle(itemToShow.title);

            rebuildingPageOnPopStateEvent = false;

            // Letting know the views that the item itemToShow is ready
            events.trigger('ViewModel.item.show');

        });

        // This is what will happen when the model triggers the event of items details ready
        // model.attachEventHandler('Model.itemsDetails.ready', () => {

        //     //itemsDetails = model.getItemsDetails();

        //     // This is the case in which the url is about an item (/item/99/slug-here)
        //     // We need to set orderNumberItemCurrentlyVisited otherwise the item's content
        //     // doesn't show up
        //     if (nidOfItemToShow) {
        //         const item = itemsDetails.filter(item => {
        //             return parseInt(item.nid) === nidOfItemToShow;
        //         })[0];

        //         orderNumberItemCurrentlyVisited = parseInt(item.field_order_number);
        //     } else {

        //         // In this case we are on the starting point of the spiral, to which
        //         // we assign url /web-writer-tech-and-humanity

        //         const urlWebWriterTechAndHumanity = "/web-writer-tech-and-humanity";

        //         if (urlWebWriterTechAndHumanity !== document.location.pathname) {
        //             history.pushState(null, null, urlWebWriterTechAndHumanity);
        //         }

        //     }

        //     // Telling views that the items are ready to be used to build the map
        //     events.trigger('ViewModel.itemsDetails.ready');

        // });

        // This is what will happen if the model triggers the error event when fetching
        // items details
        // model.attachEventHandler('Model.itemsDetails.error', () => {

        //     Sentry.captureMessage("ViewModel - Error in requesting item details");

        // });

        model.attachEventHandler('Model.contactmeform.success', () => {

            // Letting views know that the contact me form details have been
            // successfully sent to the backend
            events.trigger("ViewModel.contactme.formsuccessfullysaved");

        });

        model.attachEventHandler('Model.contactmeform.error', () => {

            // Letting views know that there has been an error when sending
            // the contact me form details to the backend
            events.trigger("ViewModel.contactme.error");

        });

    };

    return {

        init: (modelToUse) => {

            model = modelToUse;

            if (itemsDetails)
                model.setItemsDetails(itemsDetails);
            else
                Sentry.captureMessage("itemsDetails not defined in ViewModel::init");

            viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            orderNumberItemCurrentlyVisited = 0;
            animationToNextItemRunning = false;
            rebuildingPageOnPopStateEvent = false;

            registerBrowserNavigationEventHandler();

            registerEventHandlers();

            // The URL is not just the home, it's the URL of an item
            if (window.location.pathname !== "/") {

                showItemContentOnNonEmptyPathname(window.location.pathname);

            } else {

                // FIXME now we start with display none for the home?

                events.trigger("ViewModel.home.goto");

            }

        },

        setItemsDetails: (itemsDetailsFromItemView) => {

            itemsDetails = itemsDetailsFromItemView;

        },

        getItemsDetails: () => {

            return itemsDetails;
        },

        getNumberOfItems: () => {

            return itemsDetails.length;
        },

        getViewPort: () => {

            return { width: viewportWidth, height: viewportHeight };
        },

        itIsASmallScreen: () => {

            return viewportWidth < APP_CONFIGURATION.smallScreenWidth;
        },

        attachEventHandler: (event, handler) => {

            events.on(event, handler);

        },

        userClickedOnHomePageButton: () => {

            // When the user clicks on the home page button, I have to tell ItemView
            // that it can show the map and populate it with the items that the model will provide

            // FIXME everything to change
            // FIXME no need for details from the model

            // FIXME requestItemsDetailsFromModel();


            // FIXME does this work?

            // FIXME am i duplicating this?

            preparingToShowTheMap();

            // // This is the case in which the url is about an item (/item/99/slug-here)
            // // We need to set orderNumberItemCurrentlyVisited otherwise the item's content
            // // doesn't show up
            // if (nidOfItemToShow) {
            //     const item = itemsDetails.filter(item => {
            //         return parseInt(item.nid) === nidOfItemToShow;
            //     })[0];

            //     orderNumberItemCurrentlyVisited = parseInt(item.field_order_number);
            // } else {

            //     // In this case we are on the starting point of the spiral, to which
            //     // we assign url /web-writer-tech-and-humanity

            //     const urlWebWriterTechAndHumanity = "/web-writer-tech-and-humanity";

            //     if (urlWebWriterTechAndHumanity !== document.location.pathname) {
            //         history.pushState(null, null, urlWebWriterTechAndHumanity);
            //     }

            // }

            // // FIXME is this event actually used?

            // // Telling views that the items are ready to be used to build the map
            // events.trigger('ViewModel.itemsDetails.ready');


            // When the user clicks on the home page button we show the map, the items,
            // the arrows and we show the menu button as well

        },

        getItemToVisitNext: (giveMeTheNextItemNotThePrevious = true) => {

            if (giveMeTheNextItemNotThePrevious)
                orderNumberItemCurrentlyVisited++;
            else {
                orderNumberItemCurrentlyVisited--;
                if (orderNumberItemCurrentlyVisited < 1)
                    orderNumberItemCurrentlyVisited = 1;
            }

            // Sure there is one only item with id orderNumberItemCurrentlyVisited,
            // but the method filter returns an array anyway
            let arrayCurrentlyVisitedItem = itemsDetails.filter(item => {
                return parseInt(item.field_order_number) === orderNumberItemCurrentlyVisited;
            });

            // If the item has not been found, it's because the order number
            // orderNumberItemCurrentlyVisited is too high. We go back to item number 1
            if (arrayCurrentlyVisitedItem.length === 0) {

                // Back to the item 1
                orderNumberItemCurrentlyVisited = 1;

                return itemsDetails.filter(item => {
                    return parseInt(item.field_order_number) === 1;
                })[0];
            }
            else
                return arrayCurrentlyVisitedItem[0];

        },

        setAnimationToNextItemRunning: (animationRunning) => {

            animationToNextItemRunning = animationRunning;

            // When the carpet is moving from an item to another,
            // the item content and the contact me dialogs have to be closed
            events.trigger("ViewModel.itemcontent.close");
            events.trigger("ViewModel.contactme.close");

        },

        getAnimationToNextItemRunning: () => {

            return animationToNextItemRunning;
        },

        showItem: (order_number) => {

            if (order_number)
                orderNumberClickedItem = order_number;

            // If order_number is not defined, we need to show the current item
            // The function determineOrderNumberOfItemOfWhichToShowContent will return the item currently visited

            orderNumberOfItemOfWhichToShowContent = determineOrderNumberOfItemOfWhichToShowContent();

            itemToShow = itemsDetails.filter(item => {
                return parseInt(item.field_order_number) === orderNumberOfItemOfWhichToShowContent;
            })[0];

            if (itemToShow.field_item_type === "ContactMe") {

                // If we got to the contact me page because the user clicked on an arrow, we need
                // to change the url to reflect the item currently shown, the contact me form
                // If the url was already there and we got a popstate event, we don't need to change the
                // url. The current one is already the correct one
                if (!rebuildingPageOnPopStateEvent)
                    changeURLToMatchItemWhoseContentIsShown(itemToShow);

                changePageTitle(itemToShow.title);

                rebuildingPageOnPopStateEvent = false;

                events.trigger("ViewModel.contactme.show");

            } else {

                model.fetchItemContent(orderNumberOfItemOfWhichToShowContent);

                // Now go to have a look at function registerEventHandlers that handles the event Model.itemContent.ready
                // It's the event that the model will trigger after it gets the item's content

            }

        },

        getItemToShow: () => {

            const itemToReturn = itemToShow;

            itemToShow = undefined;

            return itemToReturn;
        },

        setContentIsBeingShown: (contentIsBeingShown) => {

            if (contentIsBeingShown)
                events.trigger('ViewModel.itemcontent.beingshown');
            else
                events.trigger('ViewModel.itemcontent.beinghidden');

        },

        setContactMeIsBeingShown: (contactMeIsBeingShown) => {

            if (contactMeIsBeingShown)
                events.trigger('ViewModel.contactme.beingshown');
            else
                events.trigger('ViewModel.contactme.beinghidden');

        },

        getItemToShowBecauseItIsInTheURL: () => {

            let itemToShowBecauseItIsInTheURL = null;

            if (nidOfItemToShow) {

                itemToShowBecauseItIsInTheURL = itemsDetails.filter(item => {
                    return parseInt(item.nid) === nidOfItemToShow;
                })[0];

                nidOfItemToShow = undefined;

            }

            return itemToShowBecauseItIsInTheURL;
        },

        // This function is used by MenuView.js to go to the home
        // when the home button on the menu is clicked
        // It may be used somewhere else as well
        goToHome: () => {

            history.pushState(null, null, "/");
            rebuildPageOnChangeOfURL("/");

        },

        saveContactMeForm: (fullname, email, message) => {

            model.saveContactMeForm(fullname, email, message);

        }

    }

}
