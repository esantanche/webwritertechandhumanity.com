/**
 * @file View that shows the title and body of an item
 */

"use strict";

/**
 * @class ItemContentView
 */
function ItemContentView() {

    // Private constants

    // Private variables

    // These are jQuery objects corresponding to elements
    let $ItemDialog;
    let $itemDialogContent;
    let $closeItemDialogButton;
    let $BackMask;

    let viewModel;

    // Private functions

    const closeItemDialog = () => {

        if ($ItemDialog.is(":visible")) {

            // When clicking on the dialog, we hide it
            $ItemDialog.hide();
            $BackMask.hide();

            viewModel.setContentIsBeingShown(false);
            
        }

    };

    const cacheJQueryObjects = () => {

        $ItemDialog = $("#ItemDialog");
        $itemDialogContent = $("#ContentPane");
        $closeItemDialogButton = $("#CloseDialogButton");
        $BackMask = $('#BackMask');

    };

    /**
     * registerEventHandlers is the standard name for the function that attaches event handlers
     * I'm talking about my custom jquery events
     * No standard events like click
     * @memberOf ItemContentView
     */
    const registerEventHandlers = () => {

        const hideItemDialog = () => {
            $ItemDialog.hide();
            $BackMask.hide();
        };

        viewModel.attachEventHandler('ViewModel.home.goto', hideItemDialog);

        viewModel.attachEventHandler('ViewModel.itemcontent.close', hideItemDialog);

        viewModel.attachEventHandler('ViewModel.item.show', () => {

            const itemToShow = viewModel.getItemToShow();

            // Creating the div that will show the item's content
            const $elementWithItemContent = jQuery(`<div class="standard-font-family-text"><h1>${itemToShow.title}</h1>${itemToShow.body}</div>`);

            $itemDialogContent.children().remove();

            $elementWithItemContent.appendTo($itemDialogContent);

            $ItemDialog.css('display', 'flex');

            $closeItemDialogButton.bind( "click", () => closeItemDialog() );

            $BackMask.show();

            // The ViewModel needs to know that the item's content is displayed
            // so that other views can do their job
            viewModel.setContentIsBeingShown(true);

        });

    };

    // Returning the object including public functions and, possibly, public variables
    return {

        init: (viewModelToUse) => {

            viewModel = viewModelToUse;

            cacheJQueryObjects();

            registerEventHandlers();

        },

    }

}
