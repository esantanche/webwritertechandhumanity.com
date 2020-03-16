/**
 * @file View that builds the map by showing the items' images at their specified locations.
 */

"use strict";

/**
 * @class ItemView
 */
function ItemView() {

    // Private variables

    // These are jQuery objects corresponding to elements
    let $mapImage;
    let $carpet;
    let $backArrow;
    let $forwardArrow;
    let $avatar;
    let $arrowsAndItemOrderNumbers;
    let $itemOrderNumbers;

    let previousAngle = 0;

    let viewModel;

    let itemsDetails;
    let itemToShowBecauseItIsInTheURL;

    // Private functions

    const cacheJQueryObjects = () => {

        $mapImage = $("#MapImage");
        $carpet = $('#Carpet');
        $arrowsAndItemOrderNumbers = $('#ArrowsAndItemOrderNumbers');
        $backArrow = $('#ArrowBack');
        $forwardArrow = $('#ArrowForward');
        $itemOrderNumbers = $('#ItemOrderNumbers');
        $avatar = $('#Avatar');

    };

    const collectItemDetailsFromMap = () => {

        // {
        //     "nid":"134",
        //     "field_order_number":"35",
        //     "title":"Contact Me",
        //     "field_coordinate_x":"4300",
        //     "field_coordinate_y":"1580",
        //     "field_image":"",
        //     "field_item_type":"ContactMe"
        //  }

        //         el.id === 'user'
        // // el.dataset.id === '1234567890'
        // // el.dataset.user === 'johndoe'
        // // el.dataset.dateOfBirth === ''
        
        let self = this;

        itemsDetails = [];

        const itemElements = document.querySelectorAll("[data-nid]");

        console.log("itemElements", itemElements);

        itemElements.forEach((element) => {

            itemsDetails.push({ "nid": element.dataset.nid, "field_order_number": element.dataset.order });

        });

        //let itemDetails = itemElements.map((element) => {
        //    return { nid: element.dataset.data-nid, field_order_number: element.dataset.data-order };
        //});

        //let itemDetails = itemElements.map((element) => {
        console.log("itemsDetails", itemsDetails);
        // itemsDetails[] = { article.dataset.col }

    }

    const itemOnClick = (order_number) => {

        viewModel.showItem(parseInt(order_number));

    };

    const moveToStartingPointOfSpiral = () => {

        // We are going to move the carpet to the starting point of the spiral

        // We set the animation running. The viewModel will take care of closing
        // the item content panel, if nay. It will also close any contact me form.
        viewModel.setAnimationToNextItemRunning(true);

        const viewport = viewModel.getViewPort();

        // Rotating the carpet to the horizontal position it's supposed to have
        // at the starting point of the spiral
        $carpet.velocity({ transform: ["rotateZ(" + 0 + "deg)", "rotateZ(" + previousAngle + "deg)"] },
            { duration: 1000, easing: "linear", loop: false});

        previousAngle = 0;

        // Now animating the carpet to go to the starting point of the spiral
        $mapImage.animate({ top: viewport.height / 2 - 3500 ,
                left: viewport.width / 2 - 3500 }, 1500, null,
            () => {

                // console.log('animation to spiral starting point completed');

                // Animation completed
                viewModel.setAnimationToNextItemRunning(false);

            }
        );

    };

    const clickOnArrowHandler = (event) => {

        // Only if we are not already flying to the next item, do the following
        if (!viewModel.getAnimationToNextItemRunning()) {

            let itemToVisitNext;

            // Determining the item to visit next
            if (!event && itemToShowBecauseItIsInTheURL) {

                // This is in the case I have to move directly to an item because it's in the URL

                itemToVisitNext = itemToShowBecauseItIsInTheURL;
                itemToShowBecauseItIsInTheURL = undefined;

            } else {

                // the parameter tells if we are going forward or back
                itemToVisitNext = viewModel.getItemToVisitNext(event.target.id === "ArrowForward");

            }

            if (itemToVisitNext) {

                const viewport = viewModel.getViewPort();

                // When performing the animation the View Model needs to know so that it
                // can tell other views
                viewModel.setAnimationToNextItemRunning(true);

                // left and top attributes to give to the map to get to the item
                const positionItemToVisitNext = { left: viewport.width / 2 - itemToVisitNext.field_coordinate_x,
                                                  top: viewport.height / 2 - itemToVisitNext.field_coordinate_y };

                const mapImagePosition = $mapImage.position();

                const currentTop = Math.round(mapImagePosition.top);
                const currentLeft = Math.round(mapImagePosition.left);

                // Differences in x and y we need to travel to get to the item from the current position
                const delta_x = (currentLeft - positionItemToVisitNext.left);
                const delta_y = (currentTop - positionItemToVisitNext.top);

                // The angle of the direction we take to get to the item. Used to rotate the carpet accordingly
                const angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI);

                // Rotating the carpet
                $carpet.velocity({ transform: ["rotateZ(" + angle + "deg)", "rotateZ(" + previousAngle + "deg)"] },
                    { duration: 1000, easing: "linear", loop: false});

                previousAngle = angle;

                const maxDelta = Math.max(Math.abs(delta_x), Math.abs(delta_y));

                // This is to make the carpet stop before covering the image
                // We don't want the carpet to be over the item's image
                const approachingFactor = maxDelta / 100;

                $mapImage.animate({ top: positionItemToVisitNext.top + (delta_y / approachingFactor),
                        left: positionItemToVisitNext.left + (delta_x / approachingFactor)}, 1500, null,
                    () => {

                        viewModel.setAnimationToNextItemRunning(false);

                        updateItemOrderNumbers(itemToVisitNext);
                        viewModel.showItem();

                    }
                );

            }

        }

    };

    /**
     * To update the order number of the item currently visited as shown between the arrows.
     * The total number of items is shown as well.
     *
     * @param item
     */
    const updateItemOrderNumbers = (item) => {

        if (item)
            $itemOrderNumbers.html("<span>" + item.field_order_number + "/" + viewModel.getNumberOfItems() + "</span>");
        else
            $itemOrderNumbers.html("<span>Click right arrow</span>");

    };

    /**
     * This is about registering handlers for standard events like click
     * @memberOf ItemView
     */
    const setupStandardEventHandlers = () => {

        $backArrow.bind('click', clickOnArrowHandler);
        $forwardArrow.bind('click', clickOnArrowHandler);

    };

    /**
     * registerEventHandlers is the standard name for the function that attaches event handlers
     * I'm talking about my custom jquery events
     * No standard events like click
     * @memberOf ItemView
     */
    const registerEventHandlers = () => {

        // Hide the arrows only on small screens. On large screen keep them.
        const hideNavigationArrows = () => {
            if (viewModel.itIsASmallScreen())
                $arrowsAndItemOrderNumbers.hide();
        };

        const showNavigationArrows = () => {

            if (!$arrowsAndItemOrderNumbers.is(":visible") && $mapImage.is(":visible"))
                $arrowsAndItemOrderNumbers.show();

        };

        // We have to hide the arrows when the item content dialog is showing
        viewModel.attachEventHandler('ViewModel.itemcontent.beingshown', hideNavigationArrows);

        // We restore the arrows when the item content dialog is hidden
        viewModel.attachEventHandler('ViewModel.itemcontent.beinghidden', showNavigationArrows);

        viewModel.attachEventHandler('ViewModel.contactme.beingshown', hideNavigationArrows);

        viewModel.attachEventHandler('ViewModel.contactme.beinghidden', showNavigationArrows);

        // Going to the home page. Have to hide the map, reset some variables, center the (hidden) map and more
        viewModel.attachEventHandler('ViewModel.home.goto', () => {

            // Going to the home, hiding everything and resetting some variables

            // Removing all children of mapImage because they will be recreated when the user clicks on "Go"
            // to get to the map again
            $mapImage.children().remove();

            // Moving the map back to the center
            $mapImage.css({top: "calc(-3500px + 50vh)", left: "calc(-3500px + 50vw)"});

            // Rotating back the carpet to horizontal direction
            $carpet.velocity({  transform: ["rotateZ(" + 0 + "deg)", "rotateZ(" + previousAngle + "deg)"] },
                { duration: 1000, easing: "linear", loop: false});

            $mapImage.hide();
            $carpet.hide();
            $arrowsAndItemOrderNumbers.hide();
            $avatar.hide();

            itemToShowBecauseItIsInTheURL = undefined;
            previousAngle = 0;
            updateItemOrderNumbers(null);

        });

        // @see ViewModel::requestItemsDetailsFromModel
        viewModel.attachEventHandler('ViewModel.itemsDetails.ready', () => {

            // We got the items' details and we are going to build the map

            itemsDetails = viewModel.getItemsDetails();

            if (!itemsDetails) {
                // Exception! There is a bug here!

                Sentry.captureMessage("itemsDetails not defined! ViewModel.itemsDetails.ready --- ItemView");

            }

            $mapImage.show();
            $carpet.show();

            $arrowsAndItemOrderNumbers.css('display', 'flex');
            $avatar.show();

            // itemsDetails.map((itemDetails) => {

            //     // field_coordinate_x: "2900"​
            //     // field_coordinate_y: "2700"
            //     // field_image: "/sites/default/files/2019-02/DorothyRowe.jpg"
            //     // field_item_type: "Article"
            //     // field_order_number: "2"
            //     // nid: "100"

            //     let urlImage;
            //     let classNameForClipping = "";

            //     // Articles are shaped as circles, Ideas as diamonds, Subjects as Squares,
            //     // Messages are identified by a standard icon to be chosen.

            //     switch (itemDetails.field_item_type) {
            //         case "Article":
            //             urlImage = APP_CONFIGURATION.backendUrl + itemDetails.field_image;
            //             classNameForClipping = "round-shaped-element-clip";
            //             break;
            //         case "Idea":
            //             urlImage = APP_CONFIGURATION.backendUrl + itemDetails.field_image;
            //             classNameForClipping = "diamond-shaped-element-clip";
            //             break;
            //         case "Message":
            //             urlImage = "/Message.png";
            //             break;
            //         case "Subject":
            //             urlImage = APP_CONFIGURATION.backendUrl + itemDetails.field_image;
            //             break;
            //         case "ContactMe":
            //             urlImage = "/ContactMe.png";
            //             break;
            //         default:
            //     }

            //     const $itemElement = jQuery('<div/>', {
            //         class: `item-image ${classNameForClipping}`,
            //         html: `<img src=${ urlImage }>`,
            //         style: `top: ${itemDetails.field_coordinate_y - 100}px; left: ${itemDetails.field_coordinate_x - 100}px;`
            //     });

            //     // It's possible to click on an item's image to show the content of the item
            //     $itemElement.bind( "click", () => { itemOnClick(itemDetails.field_order_number) } );

            //     $itemElement.appendTo($mapImage);

            // });

            if (document.location.pathname === "/web-writer-tech-and-humanity") {

                // console.log('ViewModel.itemsDetails.ready document.location.pathname',document.location.pathname);

                moveToStartingPointOfSpiral();

            } else {

                // If we are showing a specific item, we need to move the carpet to it

                itemToShowBecauseItIsInTheURL = viewModel.getItemToShowBecauseItIsInTheURL();

                if (itemToShowBecauseItIsInTheURL) {

                    // When showing an item because the user landed directly on the item's url, we simulate a click on an arrow
                    // that will move the carpet to the item
                    clickOnArrowHandler();
                }

            }


        });

    };

    return {

        init: (viewModelToUse) => {

            viewModel = viewModelToUse;

            // FIXME do I get item details here? 
            // yes!! then I call a setItemDetails function in the viewmodel to give the details to it, it needs them



            cacheJQueryObjects();


            setupStandardEventHandlers();

            registerEventHandlers();

            collectItemDetailsFromMap();

        }

    }

}

