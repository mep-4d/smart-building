const app = Vue.createApp({

    data() {
        return {
            dataObject:"",
            selectA:"",
            selectB:"",
            listA: [
                "General MEP", 
                "HVAC-R", 
                "Electrical Service", 
                "Metering System",
                "Security System",
                "Audio/Visual System",
                "Vertical Transportation",
                "Waste Management",
                "Catering",
                "Smart Sensors",
                "ICT",
                "Fire/Smoke System",
                "Lighting",
                "Renewable Energy",
                "Appliances"
            ],
            listB:"",
            item:"",
            sys:"",
            equipmentReference:"",
            deviceDataT: "",
            deviceDataA: "",
            deviceDataL: "",
            pointsListA: ""
        };
    },

    computed: {
        getPoints() {
            const url = 'https://attain.aeronlabs.com/getPoints';
            fetch(url).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log(data);
                    });
                }
            });
        }
        this.getPoints();
    },

    methods: {
    
        setSystem() {
            var x = this.selectA;
            this.listB = [];
            this.equipmentReference = "";
            url = `https://attain.aeronlabs.com/getDevicesData?sys=${x}`;
            fetch(url).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log(data);
                        this.dataObject = data
                        for (var i=0; i<data[0].length; i++) {
                            this.listB.push(data[0][i][0]);
                        }
                    });
                }
            });
        },

setItem() {
    const x = this.selectB; 
    const y = this.dataObject;
    for (let i = 0; i < y[0].length; i++) {
        if (y[0][i][0] === x) {
            this.item = y[0][i][1];
            this.sys = y[0][i][2];
        }
    }
    
    const z = this.item;
    console.log(z);
    const url = `https://attain.aeronlabs.com/getDeviceConfig?item=${z}`;
    
    fetch(url).then(res => {
        if (res.ok) {  
            return res.json().then(data => {
                console.log(data);
                this.deviceDataT = data.telemetry || {"config": "not defined"};
                this.deviceDataA = data.attributes || {"config": "not defined"};
                this.deviceDataL = data.logic || {"config": "not defined"};
            }).catch(jsonError => {
                console.error("JSON parsing error:", jsonError);
                this.deviceDataT = {"config": "not yet defined, contact Attain"};
                this.deviceDataA = {"config": "not yet defined, contact Attain"};
                this.deviceDataL = {"config": "not yet defined, contact Attain"};
            });
        } else {
            console.warn("Server responded with status:", res.status);
            this.deviceDataT = {"config": "not yet defined, contact Attain"};
            this.deviceDataA = {"config": "not yet defined, contact Attain"};
            this.deviceDataL = {"config": "not yet defined, contact Attain"};
        }
    }).catch(error => {
        console.error("Fetch error:", error);
        this.deviceDataT = {"config": "not yet defined, contact Attain"};
        this.deviceDataA = {"config": "not yet defined, contact Attain"};
        this.deviceDataL = {"config": "not yet defined, contact Attain"};
    });

    this.getAssetName();
},

        getAssetName() {
            const generateString = function() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
              for (let i = 0; i < 3; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
              }    
              return result;
            };
            var type = this.item;
            //var floor = generateString();
            var floor = "FFF-"
            var inst = "NNNN-"
            var proj = "ABCD"
            this.equipmentReference = "Equipment Name : " + type + "-" + floor + inst + proj + " , where FFF is a floor number or zone reference, and NNNN is a unique equipment instance/reference for that floor, and ABCD is the unique Attain project reference"
        }

    }
    
});

app.mount('#smartBldgDesign');
