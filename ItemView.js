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
    let performAnimations;

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

    /**
     * FIXME
     * Now I don't fetch item details from the backend because the index.html file comes with
     * them ready to use. I collect the details from the elements.
     * 
     * See server-rendering/writer-home-page-generator.js to know how the details are incorporated
     * in the page.
     */
    const collectItemDetailsFromMap = () => {
        
        itemsDetails = [];

        const itemElements = document.querySelectorAll("[data-nid]");

        itemElements.forEach((element) => {

            itemsDetails.push({ "nid": element.dataset.nid, 
                                "field_order_number": element.dataset.order,
                                "title": element.dataset.title,
                                "field_coordinate_x": element.dataset.xCoord,
                                "field_coordinate_y": element.dataset.yCoord,
                                "field_item_type": element.dataset.type,
                                "path": element.dataset.path });

        });

        // the viewModel needs to know about the items details as well
        viewModel.setItemsDetails(itemsDetails);

    }
    
    const moveToStartingPointOfSpiral = () => {

        // We are going to move the carpet to the starting point of the spiral

        // We set the animation running. The viewModel will take care of closing
        // the item content panel, if any. It will also close any contact me form.
        viewModel.setAnimationToNextItemRunning(true);

        const viewport = viewModel.getViewPort();

        // Rotating the carpet to the horizontal position it's supposed to have
        // at the starting point of the spiral
        $carpet.velocity({ transform: ["rotateZ(" + 0 + "deg)", "rotateZ(" + previousAngle + "deg)"] },
            { duration: 1000, easing: "linear", loop: false});

        previousAngle = 0;

        const mapImagePosition = $mapImage.position();

        const currentTop = Math.round(mapImagePosition.top);
        const currentLeft = Math.round(mapImagePosition.left);

        let animationDuration = 1500;

        // If the carpet is already very near the place it's going to,
        // I want to get there very quickly so that the user can
        // click on the arrows with no delay
        // If I have the animation last 1500ms, the user may click on an arrow and
        // nothing happens
        if (Math.abs(currentTop - (viewport.height / 2 - 3500)) < 200 && 
            Math.abs(currentLeft - (viewport.width / 2 - 3500)) < 200) {
            animationDuration = 100; 
        }

        // Now animating the carpet to go to the starting point of the spiral
        $mapImage.animate({ top: viewport.height / 2 - 3500 ,
                left: viewport.width / 2 - 3500 }, animationDuration, null,
            () => {

                // console.log('animation to spiral starting point completed');

                // Animation completed
                viewModel.setAnimationToNextItemRunning(false);

            }
        );

    };

    const clickOnArrowHandler = (event) => {

        // console.log(event);

        // console.log(viewModel.getAnimationToNextItemRunning());

        // Only if we are not already flying to the next item, do the following
        if (!viewModel.getAnimationToNextItemRunning()) {

            let itemToVisitNext;

            // Determining the item to visit next
            if (!event && itemToShowBecauseItIsInTheURL) {

                // This is in the case I have to move directly to an item because it's in the URL

                itemToVisitNext = itemToShowBecauseItIsInTheURL;
                itemToShowBecauseItIsInTheURL = undefined;
                performAnimations = false;

                // console.log("clickOnArrowHandler, itemToShowBecauseItIsInTheURL ", itemToShowBecauseItIsInTheURL);
                // console.log("performAnimations ", performAnimations);

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

                if (performAnimations) {

                    // Rotating the carpet
                    $carpet.velocity({ transform: ["rotateZ(" + angle + "deg)", "rotateZ(" + previousAngle + "deg)"] },
                    { duration: 1000, easing: "linear", loop: false});

                } else {
                    
                    // Rotate the carpet with no animation
                    $carpet.css("transform", "rotateZ(" + angle + "deg)");

                }

                previousAngle = angle;

                const maxDelta = Math.max(Math.abs(delta_x), Math.abs(delta_y));

                // This is to make the carpet stop before covering the image
                // We don't want the carpet to be over the item's image
                const approachingFactor = maxDelta / 100;

                const showingItemAtTheEndOfTheAnimation = () => {
                    viewModel.setAnimationToNextItemRunning(false);

                    updateItemOrderNumbers(itemToVisitNext);
                    viewModel.showItem();
                }

                if (performAnimations) {

                    $mapImage.animate({ top: positionItemToVisitNext.top + (delta_y / approachingFactor),
                        left: positionItemToVisitNext.left + (delta_x / approachingFactor)}, 1500, null,
                        () => {
                            showingItemAtTheEndOfTheAnimation();
                        }
                    );

                } else {

                    $mapImage.css("top", positionItemToVisitNext.top + (delta_y / approachingFactor));
                    $mapImage.css("left", positionItemToVisitNext.left + (delta_x / approachingFactor));

                    showingItemAtTheEndOfTheAnimation();

                    // Now I can finally reset performAnimations to true to restart doing animations
                    performAnimations = true;

                }

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

        //console.log("binding events");

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

        // Hide the arrows only on small screens. On large screens keep them.
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
        viewModel.attachEventHandler('ViewModel.map.show', () => {

            if (!itemsDetails) {
                // Exception! There is a bug here!

                Sentry.captureMessage("itemsDetails not defined! ViewModel.map.show --- ItemView");

            }

            $mapImage.show();
            $carpet.show();

            $arrowsAndItemOrderNumbers.css('display', 'flex');
            $avatar.show();

            if (document.location.pathname === "/web-writer-tech-and-humanity") {

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

            performAnimations = true;

            cacheJQueryObjects();

            setupStandardEventHandlers();

            registerEventHandlers();

            collectItemDetailsFromMap();

        }

    }

}

