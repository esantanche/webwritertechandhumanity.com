/**
 * @file Home message view is the view
 * that shows the initial message and the "Go!" button.
 */

"use strict";

/**
 * @class HomeMessageView
 */
function HomeMessageView() {

    // Private constants

    // Private variables

    // These are jQuery objects corresponding to elements
    let $GoToSpiral1;
    let $GoToSpiral2;
    let $HomeMessageView;

    let viewModel;

    // Private functions

    const cacheJQueryObjects = () => {

        $GoToSpiral1 = $('#GoToSpiral1');
        $GoToSpiral2 = $('#GoToSpiral2');
        $HomeMessageView = $('#HomeMessageView');

    };

    const homePageGoToSpiralClickHandler = () => {

        $HomeMessageView.hide();

        viewModel.userClickedOnHomePageButton();

    };

    /**
     * This is about registering handlers for standard events like click
     * @memberOf HomeMessageView
     */
    const setupStandardEventHandlers = () => {

        $GoToSpiral1.bind( "click", () => homePageGoToSpiralClickHandler() );
        $GoToSpiral2.bind( "click", () => homePageGoToSpiralClickHandler() );

    };

    /**
     * registerEventHandlers is the standard name for the function that attaches event handlers
     * I'm talking about my custom jquery events
     * No standard events like click
     *
     * @listens ViewModel#event:ViewModelnonemptypathnameshow
     * @listens ViewModel#event:ViewModelhomegoto
     * @memberOf HomeMessageView
     */
    const registerEventHandlers = () => {

        /**
         * Hiding the home message if the user landed with a non empty pathname like
         * http://localhost/item/9/introducing-articles
         */
        viewModel.attachEventHandler('ViewModel.nonemptypathname.show', () => {

            $HomeMessageView.hide();

        });

        /**
         * We show the home page message when going to the home page.
         * Other views will hide the map and other elements
         */
        viewModel.attachEventHandler('ViewModel.home.goto', () => {

            // Hiding the home message if the user landed with a non empty pathname like
            // http://localhost/item/9/introducing-articles

            $HomeMessageView.show();

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
