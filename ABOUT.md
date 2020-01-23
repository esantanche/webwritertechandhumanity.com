## About

Collections of subjects about which some details are needed to understand.

### Map image

The background is a CSS gradient on a 5000px by 5000px element whose id is
#MapImage.

### Item

It's an express article or an idea or a subject. They have an image associated.
You see them on the map. They have a title and a body and you see them when you
fly with the carpet and get over them.

### Coordinate system

Item have two fields called field_coordinate_x and field_coordinate_y.

x and y are relative to the map image. x=0, y=0 corresponds to the left top corner
of the map. x and y are positive and x=5000, y=5000 is the bottom right corner
of the map.

The top and left attributes of the map are calculated to show the carpet at the centre of the
screen and of the map when the map is first shown.

### How I fixed the problem with viewport on mobile

On mobile the viewport is not correctly taken into account.
1 vh is 1% of the full browser height including the top bar.

On desktop 1 vh is 1% of the actual viewport where the website is rendered.

I just used 100% heights instead of 100vh and everything was fine.

I also added a 100% height to the body.

### How I stopped scrolling on mobile

I didn't use event.preventDefault(). I just gave position fixed to the map:

~~~~
#MapImage {
    display: none;
    height: 7000px;
    width: 7000px;
    position: fixed;
    top: calc(-3500px + 50vh);
    left: calc(-3500px + 50vw);
    background: #007991;
    background: -webkit-linear-gradient(to right, #78ffd6, #007991);
    background: linear-gradient(to right, #78ffd6, #007991);
}
~~~~

