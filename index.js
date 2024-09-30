// Create object for use by the HTML view
var controller = new App();

// JavaScript "class" containing the model, providing controller "methods" for the HTML view
function App() {
    
    console.log("Creating controller/model");
    
    var devices = [];
    var holder = -1;
    
    // GET DEVICES DATA FROM DATABASE
    fetch("https://api.apispreadsheets.com/data/aTpfoiLmlj4uYKI7/").then(res=>{
	if (res.status === 200){
		// SUCCESS
		res.json().then(data=>{
			var self = globalThis;
			self.deviceData = data;
			console.log(data);
		}).catch(err => console.log(err));
	}
    });

    // SELECT SYSTEM FROM DROPDOWN
    $('#sysSelect').on('click', function () {
    devices = []; holder = -1; // RESET OBJECT
    var self = globalThis;
    self.select = $("#sysSelect").val(); // SET select TO DROPDOWN SELECTION
    console.log(select);
    
    // SET devices TO APPLICABLE SYSTEM DEVICES FROM DATABASE
    for (var i=0; i<deviceData.data.length; i++) {
        if (deviceData.data[i].system === select) {
            devices.push(deviceData.data[i]);
        }
    }
    
    });
    
    this.prevDev = function() { // DECREMENT SYSTEM DEVICE TYPES
        if (holder > 0) {
            holder--;
                $("#deviceInfo001").text(devices[holder].item);
                $("#deviceInfo002").text(devices[holder].manufacturer);
                $("#deviceInfo003").text(devices[holder].model);
        }
    console.log(holder);
    };
    
    this.nextDev = function() { // INCREMENT SYSTEM DEVICE TYPES
        if (holder < (devices.length - 1)) {
            holder++;
                $("#deviceInfo001").text(devices[holder].item);
                $("#deviceInfo002").text(devices[holder].manufacturer);
                $("#deviceInfo003").text(devices[holder].model);
        }
    console.log(holder);
    };
    
}
