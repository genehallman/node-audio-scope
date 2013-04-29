# node-audio-scope

This is a command line ascii audio oscilloscope built in nodejs. It reads from your microphone and shows the amplitude.

![example](https://raw.github.com/genehallman/node-audio-scope/master/scope.png)

# Dependencies

Audio scope depends on baudio which uses [SOX](http://sox.sourceforge.net/).

## Install SOX

On unix:
`sudo apt-get install sox`

On mac (via Homebrew):
`brew install sox`

# Installing
`git clone git://github.com/genehallman/node-audio-scope.git`
`cd node-audio-scope`

# Running the scope
`node scope.js`

