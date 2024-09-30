const app = Vue.createApp({

    data() {
        return {
            dataObject:"",
            selectA:"",
            selectB:"",
            selectC:"",
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
            pointName: "",
        };
    },

    computed: {
    },

    methods: {

        setSystem() {
            var x = this.selectA;
            this.listB = [];
            this.selectC = "";
            url = `https://attain.aeronlabs.com/getDevicesData?sys=${x}`;
            fetch(url).then(res => {
                if (res.status === 200) {
                    // SUCCESS
                    res.json().then(data => {
                        console.log(data);
                        var self = this
                        self.dataObject = data
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
            //console.log(x); 
            //console.log(y); 
            console.log(this.item)
            this.getAssetName()
        },

        getAssetName() {
            var type = this.item;
            var floor = "FFF-";
            var inst = "NNNN-"
            var proj = "ABCD"
            this.equipmentReference = "Equipment Name : " + type + "-" + floor + inst + proj
        }

    },

    mounted: function () {
        var vueApp = this;
    }
    
});

app.mount('#smartBldgDesign');
