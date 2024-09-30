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
            identifier:"",
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
            this.name = "";
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
        },

        getAssetName() {
            var str;
            var id = this.identifier;

            if (id.toString().length == 1) {
                str = "00".concat(id)
            } else if (id.toString().length == 2) {
                str = "0".concat(id)
            } else if (id == "") {
                str = "AAA | where AAA is a unique numeric item reference for that floor"
            } else {
                str = id
            }
            this.assetName = this.sys + "_" + this.item + "_" + this.selectC + "_" + str
        },

        getPointName() {
            this.pointName = this.selectD + "_" + this.selectE + "_" + this.selectF
        },

    },

    mounted: function () {
        var vueApp = this;
    }
    
});

app.mount('#smartBldgDesign');
