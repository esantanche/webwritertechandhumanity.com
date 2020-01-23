/**
 * @file Application starting point
 *
 * This code is run first. Here the model, the viewmodel and the views are created and initialized.
 */

"use strict";

// What is MVVM? https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel

// Visit https://sentry.io/organizations/emanuele-santanche-coach
Sentry.init({ dsn: 'https://d250cc5415fe410d9d2ecf0e53af4cb3@sentry.io/1420880' });

// This trick is from https://stackoverflow.com/questions/4888725/referenceerror-cant-find-variable
// It's to make sure that jQuery is actually loaded before using it
$(document).ready(function() {

    // Creating the model
    let appModel = Model();

    // Creating the viewmodel
    let appViewModel = ViewModel();

    // Creating the views
    let appItemView = ItemView();
    let appItemContentView = ItemContentView();
    let appHomeMessageView = HomeMessageView();
    let appMenuView = MenuView();
    let appContactMeView = ContactMeView();

    // Initializing the views

    appItemContentView.init(appViewModel);
    appItemView.init(appViewModel);
    appHomeMessageView.init(appViewModel);
    appMenuView.init(appViewModel);
    appContactMeView.init(appViewModel);

    // Initializing the ViewModel

    appViewModel.init(appModel);

    // Initializing the Model

    appModel.init();

});
