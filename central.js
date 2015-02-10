// BLE Central - Listener


var tessel = require('tessel');
var bleLib = require('ble-ble113a');

// Turn off all lights
function allOff()
{
    for (i=0; i<4; i++)
        tessel.led[i].output(0);
}

allOff();
var options = { serviceUUIDs : ['08c8c7a06cc511e3981f0800200c9a66'] }; // UUID to filter for
var characteristicUUID = ['883f1e6b76f64da187eb6bdbdb617888'] // Characteristic we will write to
var central = bleLib.use(tessel.port['B'], function(){
  central.startScanning(options); // Start the scanning process
  central.on('discover', function(peripheral){ // Catch the discover event
    peripheral.connect();
  });
  central.on('connect', function(peripheral){
    console.log('Connected to', peripheral.address.toString());
    peripheral.discoverCharacteristics(characteristicUUID, function(err, characteristic) {
      if (characteristic.length){
        characteristic[0].notify(true);
        characteristic[0].on('notification', function(data){
          console.log('Notif Recvd: ', data.toString());
          
            var j = parseInt( data.toString(), 10 );           
            for (var k = 0; k <4; k++)
            {
                if (k == j)
                {
                    tessel.led[k].output(1);
                    console.log ("LED " + k + " is on now" );
                } else
                    tessel.led[k].output(0);
            }

        });
      }
    });
  });
});

allOff();
