# PixelNode
Web based Pixelflut server using node.js and socket.io

Inspired by https://github.com/defnull/pixelflut

It's only a bit of fun. His servers are much better ;P

## Setup
Install node.js and download scripts
```
sudo apt-get nodejs git
git clone https://github.com/clerie/pixelnode
cd pixelnode/
nodejs index
```
Open the shown http port in a browser (you can use multiple on multiple machines).
Start playing at the shown input port.

### Default ports
* HTTP (for viewing): `61813`
* INPUT (for plaing): `1337`

Ports can be changed in index.js

## Play
Use PixelNode with the same protocol as Pixelflut:
https://github.com/defnull/pixelflut#pixelflut-protocol

## Currently supported commands
### Set pixel `PX <x> <y> <color>`
Response: `PX <x> <y> <color>`
### Get pixel `PX <x> <y>`
Response: `PX <x> <y> <color>`
### Size `SIZE`
Response: `SIZE <w> <h>`
### Stats `STATS`
Response: `STATS px:<px> conn:<conn>`

### Variables
variable | content | example | description
---------|-------- |-------- | -----------
`<w>` | value defined in index.js | `100`, `1654` | width of display
`<h>` | value defined in index.js | `100`, `1654` | heigth of display
`<x>` | value between `0` and `<w>` | `45`, `2` | x coordinate
`<y>` | value between `0` and `<h>` | `45`, `2` | y coordinate
`<color>` | can be a rgb or rgba color | `fa341b`, `ba32c9a3` | color
`<px>` | | `45`, `231` | pixel change per second
**[BETA]** `<conn>` | | `45`, `231` | currently connected hosts
