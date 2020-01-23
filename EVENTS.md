# Events Naming convention

Only one class (view, viewmodel or model) provides the function that attaches an event handler to
an event. The class is the owner of the event. The first part of the event's name is the name
of this class.

Only the owner class of an event triggers it.

Any class (view, viewmodel or model) can attach event handlers to events, or,
in other words, can listen to the event.

# Model events

The Model (Model.js) owns these events.

## Event Model.itemsDetails.ready

### Triggered in Model::startFetchingItemDetails

It's when Model has fetched items details and they are ready to be used.

### Handled in ViewModel::registerEventHandlers

ViewModel handles this event to get items details from the Model and then distribute
them to the views.

## Event Model.itemContent.ready

### Triggered in Model::fetchItemContent

When Model completes fetching the content of an item

### Handled in ViewModel::registerEventHandlers

The viewmodel prepares to show a single item and triggers the event
ViewModel.item.show for the views to show the item.

## Event Model.contactmeform.success

### Triggered in Model::saveContactMeForm

When the message in the contact me form is successfully saved to the
backend

### Handled in ViewModel::registerEventHandlers

Triggers event ViewModel.contactme.formsuccessfullysaved for views to use

## Event Model.contactmeform.error

### Triggered in Model::saveContactMeForm

When the message in the contact me form fails to be saved to the
backend

### Handled in ViewModel::registerEventHandlers

Triggers event ViewModel.contactme.error for views to use

# ViewModel events

The ViewModel (ViewModel.js) owns these events.

## Event ViewModel.itemsDetails.ready

### Triggered in ViewModel::requestItemsDetailsFromModel

The ViewModel got from the model the items details needed to build the map

### Handled in ItemView::registerEventHandlers

ItemView starts creating the items on the map.

## Event ViewModel.item.show

### Triggered in ViewModel::registerEventHandlers

The ViewModel got details about an item from the model. It now does some
preparation work to show the item and triggers this event for views to use.

### Handled in ItemContentView::registerEventHandlers

The view ItemContentView actually shows the content of the item.

## Event ViewModel.menu.showbutton

### Triggered in ViewModel::userClickedOnHomePageButton

The user clicked on the "Go!" button on the home page, the one without
the map. Now we have to show the map and we have to tell views that
the three-lines menu button should be visible on the map as well.

### Handled in MenuView::registerEventHandlers

The view MenuView handles this event and shows the menu button, the three-lines one.

## Event ViewModel.itemcontent.beingshown

### Triggered in ViewModel::setContentIsBeingShown

The ViewModel sets the flag that says that the content of an item is currently
shown. It also triggers this event to let the views know.

### Handled in ItemView::registerEventHandlers

The view ItemView hides the arrows (on small screens).

## Event ViewModel.itemcontent.beinghidden

### Triggered in ViewModel::setContentIsBeingShown

The ViewModel sets the flag that says that the content of an item is not
shown any more because the use closed the dialog. 
It also triggers this event to let the views know.

### Handled in ItemView::registerEventHandlers

The view ItemView shows the arrows (on large screens).

## Event ViewModel.contactme.beingshown

### Triggered in ViewModel::setContactMeIsBeingShown

The ViewModel sets the flag that says that the contact me form is currently
shown. It also triggers this event to let the views know.

### Handled in ItemView::registerEventHandlers

The view ItemView hides the arrows (on small screens).

## Event ViewModel.contactme.beinghidden

### Triggered in ViewModel::setContactMeIsBeingShown

The ViewModel sets the flag that says that the contact me form is not
shown any moew. It also triggers this event to let the views know.

### Handled in ItemView::registerEventHandlers

The view ItemView shows the arrows (on large screens).

## Event ViewModel.nonemptypathname.show

### Triggered in ViewModel::showItemContentOnNonEmptyPathname

The ViewModel is the process of showing an item because the url contains
its node id.

It lets the views know because there are many things to do when displaying
an item whose id is in the url.

### Handled in MenuView::registerEventHandlers and HomeMessageView::registerEventHandlers

The view MenuView shows the three-lines menu button because it has to be shown
when building the map to show an item.

The view HomeMessageView hides the home page with the initial message because
it must not show when showing the map.

## Event ViewModel.home.goto

### Triggered in ViewModel::showItemContentOnNonEmptyPathname

We are going back to the home. We let all views know so that they can hide
some elements and show others as needed.

### Handled in HomeMessageView, ItemView, ItemContentView, ContactMeView and MenuView

These views have to show the home page, hide the map, reset some variables used when showing the map, hide the
three-lines menu button. Everything that is needed to go to the home page.

## Event ViewModel.contactme.formsuccessfullysaved

### Triggered in ViewModel::registerEventHandlers

The Model completes saving the contact me details to the backend.
It triggers the event Model.contactmeform.success and the ViewModel triggers
the event ViewModel.contactme.formsuccessfullysaved in turn.

### Handled in ContactMeView::registerEventHandlers

The ContactMeView shows the success message.

## Event ViewModel.contactme.error

### Triggered in ViewModel::registerEventHandlers

The Model tries saving the contact me details to the backend, but it gets
an error.
It triggers the event Model.contactmeform.error and the ViewModel triggers
the event ViewModel.contactme.error in turn.

### Handled in ContactMeView::registerEventHandlers

The ContactMeView shows the failure message.

## Event ViewModel.itemcontent.close

### Triggered in ViewModel::setAnimationToNextItemRunning

When the carpet is moving from an item to another, 
the item content and the contact me dialogs have to be closed.
To do so, the ViewModel triggers
the event ViewModel.itemcontent.close.

### Handled in ItemContentView::registerEventHandlers

The ItemContentView closes the item dialog.

## Event ViewModel.contactme.close

### Triggered in ViewModel::setAnimationToNextItemRunning

When the carpet is moving from an item to another, 
the item content and the contact me dialogs have to be closed.
To do so, the ViewModel triggers
the event ViewModel.contactme.close.

### Handled in ContactMeView::registerEventHandlers

The ContactMeView closes the contact me dialog.

## Event ViewModel.contactme.show

### Triggered in ViewModel::showItem

The ViewModel is preparing the information needed to display
the content of an item.
It realises that the item about to be displayed is the contact me form.
It triggers the event ViewModel.contactme.show.

### Handled in ContactMeView::registerEventHandlers

The view ContactMeView shows the contact me form.
