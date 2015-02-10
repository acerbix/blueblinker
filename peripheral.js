// BLE Peripheral - Advertisement

var tessel = require('tessel');
var bleLib = require('ble-ble113a');
var bleadvertise = require('bleadvertise');



var packet = {
  flags: [0x02, 0x04], // Connectable, BLE only
  incompleteUUID128 : ['08c8c7a06cc511e3981f0800200c9a66'], // Tessel Firmware Version Service UUID
  shortName : 'Tessel'
}
    

var ad = bleadvertise.serialize(packet);

function lightsoff() {
  for( var i = 0; i < 4; i++) {
    tessel.led[i].output(0);
  }
}

var peripheral = bleLib.use(tessel.port['A'], function(){
  peripheral.setAdvertisingData(ad, function(){
    peripheral.startAdvertising();
    console.log('Now advertising');
  });
  peripheral.on('connect', function(connectionId){
    console.log('Connected to central device');
  });
  peripheral.on( 'remoteNotification', function(connectionId, index){ // Catch when remote subscribes
    console.log('Notifications started');
    var count = 0;
    var modfour = 0;
    setInterval(function(){
      console.log('Mod Four: ' + modfour);
      lightsoff();
      tessel.led[modfour].output(1);
      peripheral.writeLocalValue(index, new Buffer( modfour.toString() )); // Write to [index] transceiver value
      modfour = ++count % 4;
    }, 2000);
  });
});
