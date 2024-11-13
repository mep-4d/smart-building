const app = Vue.createApp({
    data() {
        return {
            sidebarVisible: false,
            dataObject: "",
            selectA: "",
            selectB: "",
            listA: [
                "Attain HVAC",
                "Attain Metering",
                "General MEP", 
                "HVAC-R", 
                "Electrical Service", 
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
            listB: [],
            item: "",
            sys: "",
            equipmentReference: "",
            deviceDataT: "",
            deviceDataA: "",
            deviceDataL: "",
            pointsListA: [],
            selectP: "",
            endPointString: "select from list",
            assetEndpointListA: [],
            selectedEndpoint: ""
        };
    },

    mounted() {
        this.getPoints(); 
        this.getAssetEndpoints(); 
    },

    methods: {
        toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible;
        },
        closeSidebar() {
            this.sidebarVisible = false;
        },
        
        getPoints() {
            const url = 'https://attain.aeronlabs.com/getPoints';
            fetch(url).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log(data);
                        this.pointsListA = data;
                    });
                }
            });
        },

    syntaxHighlight(json) {
        json = JSON.stringify(json, undefined, 4);
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                cls = /:$/.test(match) ? 'key' : 'string';
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    },

        getAssetEndpoints() {
            const url = 'https://attain.aeronlabs.com/assetEndpointsA';
            fetch(url).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log(data);
                        this.assetEndpointListA = data;
                    });
                }
            });
        },

        getAssetEndpoint() {
            const endP = this.selectP;
            this.endPointString = `https://<host>/api/plugins/telemetry/ASSET/<assetID>/values/attributes?keys=${endP}`;
            const url = `https://attain.aeronlabs.com/assetEndpointsB?endPoint=${endP}`;
            fetch(url).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log(data);
                        this.selectedEndpoint = data;
                    });
                }
            });
        },
    
        setSystem() {
            const x = this.selectA;
            this.listB = [];
            this.equipmentReference = "";
            const url = `https://attain.aeronlabs.com/getDevicesData?sys=${x}`;
            fetch(url).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log(data);
                        this.dataObject = data;
                        for (let i = 0; i < data[0].length; i++) {
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
            const type = this.item;
            const floor = "FFF-";
            const inst = "NNNN-";
            const proj = "ABCD";
            this.equipmentReference = "Equipment Name : " + type + "-" + floor + inst + proj + " , where FFF is a floor number or zone reference, and NNNN is a unique equipment instance/reference for that floor, and ABCD is the unique Attain project reference";
        }
    }
});

app.mount('#smartBldgDesign');
