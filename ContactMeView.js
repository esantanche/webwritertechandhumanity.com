/**
 * @file View that shows the contact me form
 *
 * Using http://parsleyjs.org/ for the form
 */

"use strict";

/**
 * @class ContactMeView
 */
function ContactMeView() {

    // Private constants

    // Private variables

    // These are jQuery objects corresponding to elements
    let $ContactMeForm;
    let $ContactMeView;
    let $CloseContactMeButton;
    let $fullnameInput;
    let $emailInput;
    let $messageTextarea;
    let $submitButton;
    let $ContactMeSuccessButton;
    let $BackMask;

    let $ContactMeSuccessMessage;
    let $ContactMeFailureMessage;

    // The viewmodel object to use
    let viewModel;

    // Private functions

    const cacheJQueryObjects = () => {

        $ContactMeForm = $("#ContactMeForm");
        $ContactMeView = $('#ContactMeView');
        $CloseContactMeButton = $('#CloseContactMeButton');
        $BackMask = $('#BackMask');

        $fullnameInput = $("input[name=fullname]");
        $emailInput = $("input[name=email]");
        $messageTextarea = $("textarea[name=message]");
        $submitButton = $("input[type=submit]");
        $ContactMeSuccessButton = $('#ContactMeSuccessButton');

        $ContactMeSuccessMessage = $('#ContactMeSuccessMessage');
        $ContactMeFailureMessage = $('#ContactMeFailureMessage');

    };

    // When clicking on the close button, we hide the dialog
    const closeContactMeView = () => {

        if ($ContactMeView.is(":visible")) {

            $ContactMeView.hide();
            $BackMask.hide();

            viewModel.setContactMeIsBeingShown(false);

        }

    };

    /**
     * registerEventHandlers is the standard name for the function that attaches event handlers
     * I'm talking about my custom jquery events
     * No standard events like click
     * @memberOf ItemContentView
     */
    const registerEventHandlers = () => {

        const hideContactMeDialog = () => {
            $ContactMeView.hide();
            $BackMask.hide();
            viewModel.setContactMeIsBeingShown(false);
        };

        viewModel.attachEventHandler('ViewModel.home.goto', hideContactMeDialog);

        viewModel.attachEventHandler('ViewModel.contactme.close', hideContactMeDialog);

        viewModel.attachEventHandler('ViewModel.contactme.show', () => {

            $BackMask.show();

            $fullnameInput.val('');
            $emailInput.val('');
            $messageTextarea.val('');

            $ContactMeForm.parsley().reset();

            $ContactMeForm.show();
            $ContactMeSuccessMessage.hide();
            $ContactMeFailureMessage.hide();
            $submitButton.prop('disabled', true);

            $ContactMeView.css('display', 'flex');

            $CloseContactMeButton.bind( "click", () => closeContactMeView() );

            // I tell the ViewModel that the contact me is showing so that
            // it can let all other views know
            viewModel.setContactMeIsBeingShown(true);

            $ContactMeForm.parsley().on('field:validated', function() {

                let ok = $('.parsley-error').length === 0;

                if ($messageTextarea.val().length === 0 || $emailInput.val().length === 0 || $fullnameInput.val().length === 0)
                    ok = false;

                // Disabling the submit button if the form is invalid
                $submitButton.prop('disabled', !ok);

            })
                .on('form:submit', function() {

                    // The user clicked the submit button, we tell the ViewModel that they did
                    viewModel.saveContactMeForm($fullnameInput.val(), $emailInput.val(), $messageTextarea.val());

                    return false;
                });

        });

        viewModel.attachEventHandler('ViewModel.contactme.formsuccessfullysaved', () => {

            // The form is no longer needed
            $ContactMeForm.hide();
            // We show the close button and the success message
            $ContactMeSuccessButton.bind( "click", () => closeContactMeView() );
            $ContactMeSuccessMessage.show();

        });

        viewModel.attachEventHandler('ViewModel.contactme.error', () => {

            $ContactMeFailureMessage.show();

        });

    };

    // Returning the object including public functions and, possibly, public variables
    return {

        // Initialise the view with a DOM node (container) and a model to render.
        // Container is the element containing the input field and the output
        init: (viewModelToUse) => {

            viewModel = viewModelToUse;

            cacheJQueryObjects();

            registerEventHandlers();

        },

    }

}
