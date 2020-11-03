# wizard-with-a-shotgun

> My 2020 entry for the Major Project, WIZARD WITH A SHOTGUN.

> To play the Game [click here](wizard-with-shotgun.surge.sh) or visit [wizard-with-shotgun.surge.sh](wizard-with-shotgun.surge.sh)

## INSTRUCTIONS

In this top-down 2D shooter, help the Wizard recover the missing pages of the Shotgun Arcana from the dungeon by blasting everything you see.

Play on desktop using any browser. Controls: mouse & keyboard.

NOTE: Firefox may experience some slowdowns.


### Features

There's a few things I'm really proud of in this game that are new enough or unique enough (for me) that I want to highlight them!

 - The first is my approach to _canvas size_. This game is intended to look like a classic 2D pixel art game, so I selected `480x270` as my desired "display pixels". Then, what I do is I make the canvas element take up the full size of the browser, and I select the smallest _scale_ that would fill the canvas horizontally and vertically. Now, what I end up with a 2D context that is always _roughly_ 480x270, but it might be less wide or tall depending on the browser's dimensions. If you want to see what I'm describing, try playing my game and dragging your browser window around to resize it -- you'll see that the ratio stays fixed and the scale will adjust to give you as much playing real estate as possible while still looking nice. I'm pretty happy with this and will likely keep the algorithm for my future games.

 - The second is the collision response. This year I chose to simplify and use "bounding circles" instead of rectangles, which meant I needed some math for circle-rectangle (walls) and circle-circle (player/enemy) collision detection. I'm pretty proud of the result, which is quite a bit of code, but allows you to be totally surrounded by multiple jostling enemies and still "push" your way out of them, all while looking about like you'd want it to look. The same math applies to _any moving object_ with a position and velocity, which meant I accomplished what I could not last year - chunks of enemies bouncing off walls :tada:.  Some of this math is reusable if I need it next year :).

 - I tried a new thing in the code which is purely technical - I used _three different_ "pixel spaces". In the code, I try to religiously use `u,v` to refer to pixels displayed on the canvas, I use `x,y` to refer to pixels in map space (which are the same dimensions but just translated by the camera), and `q,r` to refer to "map coordinates" (i.e. tiles in the map). This was hard to get used to, but functions `xy2uv` and `xy2qr` are now meaningful ways to swap between coordinates, and you can tell just by a function's parameters whether it thinks about "stuff on screen" or "stuff in the map". This experiment worked really well and I'll probably try to keep a similar scheme in future games.

 - Another thing I tried and am happy with is breaking up logic into "systems" - it's not full entity-component-system or anything, but my upgrade loop now works in specific stages - first `Behavior` (where each entity thinks), then `Movement` (where velocity is applied and collision detection happens), then `Damage` (damage queued up by the first 2 rounds is now "applied" to each entity, potentially killing it). Last "culled" entities are cleaned up. (Entities aren't "culled" until they process their own "dead" state, which gives them a chance to do appropriate things, like spit out a bunch of blood or spawn some pages, etc.) This made it easier to figure out where to put logic, and helps keep the main game update function nice and clean.

 - I didn't want to mess with a level editor, so I used Aseprite to [draw the map](src/maps/map.png), and then my gulp build turns it into [level data](src/js/Map-gen.js). Each room is color-coded to represent a particular "pattern number", which controls the types and quantities of enemies in the room. This wouldn't cut it if I had multiple tiles and entities and decorative objects to place, but for this game it worked pretty well!

### Technical Stack

- HTML
- CSS
- javascript
- gulp.js
- Aseprite Editor


## THE MAKING OF

### Influences/References

_NOTE: May contain spoilers if you haven't finished the game!_

- The main character is intended to be sort of a wise-cracking, street-smart wizard - think Harry Dresden, not Harry Potter. (Dresden carries a staff, not a shotgun, and doesn't wear purple wizard robes, but it's the attitude that counts.) Unfortunately, I discovered that dialog is VERY expensive in the final zip file, so I had to cut a lot of my planned lines.

- The game opens with a reference to Lovecraft (Shoggoths show up in the first episode of Lovecraft Country on HBO - I'm biased because I work there, but check it out if you love anything horror-related!)

- The game's ending is an homage to the ending of Episode 1 of the original DOOM (the final teleport into an endless stream of enemies and the opening paragraph). If I'd had a little more space, I was going to play the opening notes to E1M8 _Sign of Evil_ to make the reference even stronger... maybe in an updated version!

- A few seconds after the final teleport your page count (404) turns red and reads 666. Of course this number shows up lots of places but I had in mind the red 666 from the second-most-famous id game Quake, where your health would read 666 after picking up an Invulnerability glyph.

- The biggest influence on gameplay is Hotline Miami - I was going for the same kind of hectic top-down shooter feel, although bite-size since I had limited space for enemies, level design, etc.

- I didn't want dying to be hard stop in this game, so I adopted the Minecraft approach of just dropping all your "stuff" where you died. You could potentially be carrying hundreds of pages, so to avoid lagging the game horribly, the game renders it as up to 7 floating pages, but each one will be worth roughly 1/7 of the pages you were carrying. (Similar to Minecraft's stacks, although I didn't have the space for logic to render them that way.)




