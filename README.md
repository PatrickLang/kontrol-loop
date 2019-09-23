# kontrol-loop

kontrol-loop aims to be a MIDI automation companion for the [Elektron] musical instruments. Right now it's in experimental phases, and is currently based on node.js with the [node-midi] wrapper for RtMidi. 


The goals are to:

- Fit into a "DAWless" workflow. No monitor, mouse or keyboard required. If you're using Overbridge with a laptop, you can sequence in your DAW already.
- Use a tiny form factor such as the Raspberry Pi Zero W with a small LCD or OLED display
- Distribute released software as easy to use Docker containers so minimal Linux experience is required.


These are currently developed and tested with:

- Raspberry Pi 3b
- Raspbian Buster Lite
- Node.js 10
- [Visual Studio Code - Insiders] with [Remote-SSH] plugin
- USB midi

Midi settings used on Elektron synth:

- System
  - USB Config
    - Overbridge: **off**
    - USB Midi: **on**
- Midi Config
  - Sync
    - Clock Receive: **on** - this could be disabled, but I leave it on so I can sync midi clock from another source
    - Clock Send: **on**
    - Prog Ch Receive: **on**
    - Prog Ch Send: **on**
  - Port Config
    - Input From: **midi+usb**
    - Output To: **midi+usb**
    - Output Ch: **auto ch**
    - Param Output: **cc**
  - Channels
    - Fx Control Ch: **9** - this is the default, and I think it may be important. Program change events are sent from the device on channel 9. I'd expect them to use the auto channel, but they don't. If you know why, please share.
    - Auto Channel: **10**
    - Prog Chg In Ch: **auto**
    - Prog Chg Out Ch: **auto**

## Current Experiments

### experiment1

This is a proof of concept that will advance a Digitone (and likely Digitakt) through the first 8 patterns automatically. It may need one manual program change on the Digitone to start the loop.

Running it

```sh
npm install midi
node experiment1.js
```

Example debug console output:

```none
/usr/bin/node --inspect-brk=42022 kontrol-loop/experiment1.js
Debugger listening on ws://127.0.0.1:42022/736e3af0-8b15-4da0-82e6-8c50a68e8260
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
port count: 2, port name: Elektron Digitone:Elektron Digitone MIDI 1 20:0
(node:4506) [INSPECTOR_ASYNC_STACK_TRACES_NOT_AVAILABLE] Warning: Warning: Async stack traces in debugger are not available on 32bit platforms. The feature is disabled.
stopping
24x4 clocks = whole note
stopping
m: program change(0xc9): 1 d: 0.0007268740000000001
m: unknown(b4): 120, 0 d: 0.000012344
24x4 clocks = whole note
playing
sent PC 0xc9, 1
24x4 clocks = whole note
24x4 clocks = whole note
24x4 clocks = whole note
m: program change(0xc9): 0 d: 0.000016927000000000002
sent PC 0xc9, 2
24x4 clocks = whole note
m: program change(0xc9): 2 d: 0.000724376
sent PC 0xc9, 3
24x4 clocks = whole note
24x4 clocks = whole note
24x4 clocks = whole note
m: program change(0xc9): 3 d: 0.000017291
sent PC 0xc9, 4
24x4 clocks = whole note
m: program change(0xc9): 4 d: 0.000742135
sent PC 0xc9, 5
24x4 clocks = whole note
24x4 clocks = whole note
24x4 clocks = whole note
m: program change(0xc9): 5 d: 0.000017083000000000002
sent PC 0xc9, 6
24x4 clocks = whole note
m: program change(0xc9): 6 d: 0.00071526
sent PC 0xc9, 7
24x4 clocks = whole note
24x4 clocks = whole note
24x4 clocks = whole note
m: program change(0xc9): 7 d: 0.000017396
sent PC 0xc9, 0
24x4 clocks = whole note
m: program change(0xc9): 0 d: 0.000778384
stopping
stopping
m: program change(0xc9): 0 d: 0.0007217710000000001
m: unknown(b4): 120, 0 d: 0.00001573
24x4 clocks = whole note
```


## Planned Features

### Song-mode sequencer

Build a very simple interface that can sequence up enough pattern changes to automate a song on the Digitone / Digitakt. 

Why? These instruments allow you to sequence up multiple patterns that will play automatically, but it requires difficult press & hold key combinations. They cannot be saved and played back as part of a project. This can make it hard to keep things moving in a live performance if you want to sequence up the next several patterns but use track mutes and tweak synth parameters as the patterns progress.

[experiment1] was an exercise to be able to determine when midi program changes were sent by the Digitone, and when they needed to be applied for a smooth transition.

To build this into a working setup, a few more things need to be considered:

- [ ] What to do when "stop" is sent from the synth. It sends a midi program change so you can confirm what pattern it stopped on. Should that be used as the starting point for the next patterns?
- [ ] Midi pattern change events take effect immediately, so they need to be sent after the last step in a pattern. If all patterns are the same length, you can count midi clock events to track progress. If they're different lengths, then what?


[experiment1.js]: experiment1.js

[Elektron]: https://www.elektron.se/
[node-midi]: https://github.com/justinlatimer/node-midi
[Visual Studio Code - Insiders]: https://code.visualstudio.com/insiders/
[Remote-SSH]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh