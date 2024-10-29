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
            deviceDataL: ""
        };
    },

    computed: {
    },

    methods: {

        setSystem() {
            var x = this.selectA;
            this.listB = [];
            this.equipmentReference = "";
            url = `https://attain.aeronlabs.com/getDevicesData?sys=${x}`;
            fetch(url).then(res => {
                if (res.status === 200) {
                    // SUCCESS
                    res.json().then(data => {
                        console.log(data);
                        this.dataObject = data
                        for (var i=0; i<data[0].length; i++) {
                            this.listB.push(data[0][i][0])
                        }
                    });
                }
            });
        },

        setItem() {
            var x = this.selectB; 
            var y = this.dataObject;
            for (var i=0; i<y[0].length; i++) {
                if (y[0][i][0] == x) {
                    this.item = y[0][i][1]
                    this.sys = y[0][i][2]
                }
            }
            var z = this.item;
            console.log(z);
            url = `https://attain.aeronlabs.com/getDeviceConfig?item=${z}`;
            fetch(url).then(res => {
                if (res.status === 200) {
                    // SUCCESS
                    res.json().then(data => {
                        console.log(data);
                        this.deviceDataT = data.telemetry;
                        this.deviceDataA = data.attributes;
                        this.deviceDataL = data.required;
                    });
                }
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
            this.equipmentReference = "Equipment Name : " + type + "-" + floor + inst + proj + " , where FFF is a floor number or reference, and NNNN is a unique equipment instance/reference for that floor, and ABCD is the unique Attain project reference"
        }

    }
    
});

app.mount('#smartBldgDesign');
