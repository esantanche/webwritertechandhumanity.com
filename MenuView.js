/**
 * @file View that shows the menu
 */

"use strict";

/**
 * @class MenuView
 */
function MenuView() {

    // Private constants

    // Private variables

    // These are jQuery objects corresponding to elements

    let $menuButtonContainer;
    let $MenuButton;
    let $Menu;
    let $MenuPane;
    let $closeMenuBUtton;
    let $homeButtonOnMenu;

    let viewModel;
    let itemsDetails;

    // Private functions

    const openMenu = () => {

        $Menu.css('display', 'flex');

        // The three-lines menu button is not needed when the menu is on
        $menuButtonContainer.hide();

        //Now going to build the menu

        itemsDetails = viewModel.getItemsDetails();

        // Sorting the array by field_order_number
        itemsDetails.sort((item1, item2) => { return parseInt(item1.field_order_number) - parseInt(item2.field_order_number); });

        const $unorderedList = $('<ul>');

        $unorderedList.appendTo($MenuPane);

        itemsDetails.map((itemDetails) => {

            const $menuListElement = $('<li>', {
                html: $('<a>', {
                    class: "standard-font-family-text",
                    href: "/item/" + itemDetails.nid + "/" + titleToSlug(itemDetails.title),
                    text: itemDetails.field_order_number + " - " + itemDetails.title,
                })
            });

            $menuListElement.bind('click', closeMenu);

            $menuListElement.appendTo($unorderedList);

        });

        // The URL /privacy-policy actually returns the file privacy-policy.html thanks to a rule in
        // Nginx's configuration. Same for /about-me

        $('<li><a href="/privacy-policy" class="standard-font-family-text">Privacy policy</a></li>').appendTo($unorderedList);
        $('<li><a href="/about-me" class="standard-font-family-text">About me</a></li>').appendTo($unorderedList);

        $('<p>&nbsp;</p>').appendTo($MenuPane);

    };

    const closeMenu = () => {

        $MenuPane.children().remove();

        $Menu.hide();
        $menuButtonContainer.show();

    };

    /**
     * When the user clicks on the home button
     */
    const gotoHome = () => {

        closeMenu();

        viewModel.goToHome();

    };

    const cacheJQueryObjects = () => {

        $menuButtonContainer = $("#MenuButtonContainer");
        $MenuButton = $('#MenuButton');
        $Menu = $('#Menu');
        $MenuPane = $('#MenuPane');
        $closeMenuBUtton = $('#CloseMenuButton');
        $homeButtonOnMenu = $('#HomeButtonOnMenu');

    };

    /**
     * This is about registering handlers for standard events like click
     * @memberOf MenuView
     */
    const setupStandardEventHandlers = () => {

        $MenuButton.bind( "click", () => openMenu() );
        $closeMenuBUtton.bind( "click", () => closeMenu() );
        $homeButtonOnMenu.bind( "click", () => gotoHome() );

    };

    /**
     * registerEventHandlers is the standard name for the function that attaches event handlers
     * I'm talking about my custom jquery events
     * No standard events like click
     * @memberOf MenuView
     */
    const registerEventHandlers = () => {

        const showMenuButton = () => {

            // Delay on showing the three-lines menu button because it would show first the
            // text "menu" and then the three-lines menu icon
            $menuButtonContainer.delay(500).show(0);

        };

        // I get this event when the user clicks on the home button and I have to show the menu button
        // with the map, the items, the arrows, etc
        viewModel.attachEventHandler('ViewModel.menu.showbutton', showMenuButton);

        // I get this event when I'm going back to the home and I need to hide the menu button
        viewModel.attachEventHandler('ViewModel.home.goto', () => {

            $menuButtonContainer.hide();
            $Menu.hide();

        });

        // When showing the item whose node id is in the url, we hide the menu if it was showing
        // and show the three-lines menu button
        viewModel.attachEventHandler('ViewModel.nonemptypathname.show', () => {

            showMenuButton();

            $Menu.hide();

        });

    };

    // Returning the object including public functions and, possibly, public variables
    return {

        // Initialise the view with a DOM node (container) and a model to render.
        // Container is the element containing the input field and the output
        init: (viewModelToUse) => {

            viewModel = viewModelToUse;

            cacheJQueryObjects();

            setupStandardEventHandlers();

            registerEventHandlers();

        },

    }

}
