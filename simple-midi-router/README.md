I had two problems I needed to solve:

- Hooking up a USB-only midi controller to Elektron hardware
- Running out of midi ports without a midi thru expander

All my hardware also had USB support, so I tried putting a Raspberry Pi in the middle to do the routing.


This was inspired by:

http://forums.synthstrom.com/discussion/1271/usb-host-midi-interface-with-raspberry-zero

https://neuma.studio/rpi-midi-complete.html

- had good tips on a systemd unit, udev rule

I set up midi CC mappings for knobs & faders. That was pretty straightforward using the MIDI CC documentation in [Elektron's manual](https://www.elektron.se/wp-content/uploads/2017/06/Digitakt-User-Manual_ENG.pdf). What wasn't obvious was how to use buttons as pads for each of the 8 tracks. The manual states "Of the 128 notes in the standard MIDI range, Note numbers 0–8 correspond to notes C0 through to G0, the leftmost octave (which is sometimes called C-2–G-2 in certain applications)." That didn't line up with Novation's Launch Control XL Editor. `aseqdump` helped me to figure out what notes were actually sent. It turns out that Novation's editor calls these notes C-2 through G-2. That's negative 2! I sent those to the auto channel but any channel probably would have worked. I use the knobs for adjusting some filter and sample parameters so having the extra note button nearby is helpful for trying out changes, even if it's not velocity sensitive.

Issues I'm still having:
- My USB adapter is "2A", but if I plug in all 4 USB devices at once (Elektron Digitone, Digitakt, Arturia Keystep, Novation Launch Control XL) the Raspberry Pi reboots due to low power. The Keystep has a separate 9v power supply plugged in. I guess I need to find a better power supply or not use the micro USB port to power it.