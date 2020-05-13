// This is the template of the index.html page
// the script writer-home-page-generator.js uses it to generate the index.html page

module.exports = (map) => `
<!doctype html>

<html lang="en">
    <head>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-71688245-3"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-71688245-3');
        </script>

        <meta charset="utf-8">

        <title>Emanuele Santanche, writer</title>

        <!--This is needed otherwise mobile browsers may ignore media queries-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Used for buttons -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">

        <link href="/style.css" rel="stylesheet">

        <link href="/parsley.css" rel="stylesheet">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

        <script src="/velocity.min.js"></script>

        <script src="/parsley.min.js"></script>

        <script src="https://browser.sentry-cdn.com/4.6.4/bundle.min.js" crossorigin="anonymous"></script>

        <!-- https://github.com/insites/cookieconsent-->

        <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.css" />

        <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js"></script>

    </head>

    <body>

        <div id="HomeMessageView" class="home-message-text standard-font-family-text centred-pane">
            <div class="paper-sheet">
                <div class="img-container"> <!-- Block parent element -->
                    <img alt="Emanuele Santanche" data-align="left" data-entity-type="file" data-entity-uuid="1073b488-5df7-4758-ad22-de51dcd3cc52"
                         height="191" width="191"
                         src="https://backend.emanuelesantanche.com/sites/default/files/inline-images/Photo4ProfilesGreenSquare.JPG" />
                </div>
                <p><i>Hello, my name is Emanuele.</i></p>
                <p><i>I am a web writer specialising in technology and humanity.</i></p>
                <p><i>I write about Human Energy (self-help,
                    education, sociology and psychology) and Software Development (languages, methodologies, project
                    management, algorithms and frameworks).</i></p>
                <p><i>Thanks to my 5-rewrite writing process, I can write for you crystal clear articles that will improve your reputation as a great communicator.</i></p>
                <p><i>I have deep experience and broad knowledge in my chosen fields. My articles will make your website even more valuable in your readers' eyes.</i></p>
                <p><i>You can visit my <a href="javascript:void(0);" id="GoToSpiral1">gallery</a> &mdash;
                    it's more of a spiral than a gallery &mdash;
                    to have a glimpse at my articles, ideas and subjects. Being a writer, I am also a poet.
                    You will see me <a href="javascript:void(0);" id="GoToSpiral2">flying</a> on a carpet of words.</i></p>
                <p><i>Have a look, then <a href="/item/134/contact-me">contact me</a> for a chat.</i></p>
                <p><i>Enjoy!</i></p>
                <p><i>Best,</i></p>
                <p><i>Emanuele</i></p>
            </div>
            <div>&nbsp;</div>
        </div>

        <div>

            ${map}

            <div id="Carpet">
                <img class="carpet-image" src="/Carpet.gif">
            </div>

            <div id="Avatar">
                <img src="/Avatar.png">
            </div>

            <div class="arrows-container">
                <div id="ArrowsAndItemOrderNumbers">
                    <img id="ArrowBack" class="arrows-size arrow blinking" src="/ArrowBack.png">
                    <div id="ItemOrderNumbers" class="home-message-text standard-font-family-text">Click right arrow</div>
                    <img id="ArrowForward" class="arrows-size arrow blinking" src="/ArrowForward.png">
                </div>
            </div>

            <div id="MenuButtonContainer">
                <i id="MenuButton" class="material-icons menu-icon-text blinking">menu</i>
            </div>

            <div id="Menu">
                <div class="home-and-close-buttons-on-menu">
                    <i id="HomeButtonOnMenu" class="material-icons menu-icon-text menu-buttons-color">home</i>
                    <i id="CloseMenuButton" class="material-icons menu-icon-text menu-buttons-color">close</i>
                </div>
                <div id="MenuPane"></div>
            </div>

        </div>

        <div id="ItemDialog">

            <i id="CloseDialogButton" class="material-icons">close</i>

            <div id="ContentPane"></div>

        </div>

        <div id="BackMask">

        </div>

        <div id="ContactMeView">

            <i id="CloseContactMeButton" class="material-icons">close</i>

            <div id="ContactMePane">

                <form id="ContactMeForm" data-parsley-validate="" class="contact-me-form-font-size standard-font-family-text">

                    <div>&nbsp;</div>

                    <div>
                        <label for="fullname" class="display-block-pane">Full Name</label>
                        <input id="fullname" type="text"
                               class="form-control standard-font-family-text display-block-pane contact-me-form-font-size" name="fullname"
                               data-parsley-trigger="change" required="">
                    </div>

                    <div>&nbsp;</div>

                    <div>
                        <label for="email" class="display-block-pane">Email</label>
                        <input id="email" type="email"
                               class="form-control standard-font-family-text display-block-pane contact-me-form-font-size" name="email"
                               data-parsley-trigger="change" required="">
                    </div>

                    <div>&nbsp;</div>

                    <div>
                        <label for="message" class="display-block-pane">Message</label>
                        <textarea id="message" class="form-control standard-font-family-text display-block-pane contact-me-form-font-size"
                                  name="message" rows="5" data-parsley-trigger="keyup" required=""
                                  data-parsley-required-message="Please insert a message"
                                  data-parsley-validation-threshold="1">
                        </textarea>
                    </div>

                    <div>&nbsp;</div>

                    <div>
                        <input type="submit" class="btn btn-default display-block-pane standard-button contact-me-form-font-size" value="Go!">
                    </div>
                </form>

                <div id="ContactMeSuccessMessage" class="standard-font-family-text">
                    <p>&nbsp;</p>
                    <p>Thank you for your message!</p>
                    <p>I'll be in touch shortly.</p>
                    <button id="ContactMeSuccessButton" class="standard-button"><strong>Close</strong></button>
                </div>

                <div id="ContactMeFailureMessage" class="standard-font-family-text">
                    <p>Unfortunately something went wrong.</p>
                    <p>Save your message, check your internet connection, reload the page and try again.</p>
                </div>

            </div>

        </div>

        <script src="/errorMessages.js"></script>
        <script src="/appConfiguration.js"></script>
        <script src="/Model.js"></script>
        <script src="/ViewModel.js"></script>
        <script src="/ItemView.js"></script>
        <script src="/ItemContentView.js"></script>
        <script src="/HomeMessageView.js"></script>
        <script src="/MenuView.js"></script>
        <script src="/ContactMeView.js"></script>
        <script src="/App.js"></script>

        <script>
            window.addEventListener("load", function(){
                window.cookieconsent.initialise({
                    "palette": {
                        "popup": {
                            "background": "#000"
                        },
                        "button": {
                            "background": "#f1d600"
                        }
                    },
                    "theme": "classic",
                    "content": {
                        "dismiss": "I understand"
                    }
                })});
        </script>

    </body>
</html>
`