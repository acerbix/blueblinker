This project uses two tessel boards with BLE

The first board acts as a peripheral and runs the "peripheral.js" code.

The second board acts as central and runs the "central.js" code.

The peripheral decides which led to turn on (using a mod 4 algorithm), turns it on,  and over bluetooh tells central. Central receives that info and turns on that specific led - so the two boards turn the same leds on.
