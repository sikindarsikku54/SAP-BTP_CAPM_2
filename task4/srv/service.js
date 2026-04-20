const cds = require('@sap/cds');
const axios = require('axios');
const USERNAME = "sikindar";
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    const { Vehicles, Vehiclesid, States, Statesid, Dealers, Customers, Orders } = this.entities;

    this.on('READ', 'Vehiclesid', async (req) => {
        const data = await SELECT.from(Vehiclesid).columns('vehicleId');
        return data;
    })

    this.on('READ', 'Statesid', async (req) => {
        let data = await SELECT.from(Statesid).columns('stateId')
        return data;
    })

    this.on('READ', 'Vehicles', async (req) => {
        const data = await SELECT.from(Vehicles);
        return data;
    })

    this.on('UPDATE', 'Vehicles', async (req) => {
        let { ID, newPrice } = req.data;

        let existing = await SELECT.one.from(Vehicles).where({ ID })

        if (!existing) return req.error(404, "With this Vehicle Id user is not found");

        let updatedPrice = newPrice;

        let store = await UPDATE(Vehicles).
            set({
                oldPrice: existing.newPrice,
                newPrice: updatedPrice
            }
            ).
            where({ ID });

        let updated = await SELECT.from(Vehicles).where({ ID })
        console.log(updated);
        return updated;

    })

    this.on('DELETE', 'Vehicles', async (req) => {

        let ID = req.data.ID;   // ✅ FIXED (IMPORTANT)

        let existing = await SELECT.one.from(Vehicles).where({ ID });

        if (!existing) return req.error(404, 'Vehicle not found');

        await DELETE.from(Vehicles).where({ ID });

        console.log(`Vehicle with ID ${ID} deleted`);

        return { message: "Deleted successfully" };
    });

    // // USER LOGGING FUNCTION
    // async function logUser(req, action){

    //     const user = req.user.id || 'anonymous';

    //     await INSERT.into(APILogs).entries({
    //         userId    : user,
    //         apiName   : req.target.name,
    //         action    : action,
    //         timeStamp : new Date()
    //     });

    // }

    // CREATE VEHICLE
    this.before('CREATE', 'Vehicles', async (req) => {

        // await logUser(req,'CREATE');
        const last = await SELECT.one.from(Vehicles)
            .columns('max(ID) as maxID');

        req.data.ID = (last.maxID || 0) + 1;

        let stateid = await SELECT.one.from(States)
            .where({ ID: req.data.state_ID });

        console.log(stateid);

        let state = stateid.stateId;
        console.log(state);

        let store = Math.trunc(Math.random() * 9999)

        req.data.vehicleId = `${state}-${store}`

        // const stateCode = data.vehicleId.substring(0,2);  

        // const stat = await SELECT.one.from(States)
        // .where({stateId:stateCode});  

        // console.log("running")

        if (!state) {
            req.error(400, "Vehicle ID must start with valid State Code");
        }
        console.log(req.data)
    });


    this.before('*', '*', async (req) => {
        // console.log('Entity Clicked', req.target);
        console.log("Date:", new Date());
        console.log("Action :", req.event)
        const user = req.user.id || 'anonymous';
        console.log("user :", user);

    })


    //States 

    this.before('CREATE', 'States', async (req) => {
        let { ID, stateId, stateName } = req.data;

        if (!stateId || !stateName) {
            return req.error(404, 'stateId And StateName Must need t pass');
        }

        if (stateId.length !== 2) {
            return req.error(400, 'stateId must be 2 characters');
        }

        let existing = await SELECT.one.from(States).where({ stateId });

        if (existing) {
            return req.error(404, `with this ${stateId} state is already exist`)
        }

        const last = await SELECT.one.from(States)
            .columns('max(ID) as maxID');
        console.log(last)

        const newID = (last.maxID || 0) + 1;

        const result = {
            ID: newID,
            stateId,
            stateName
        };

        // await INSERT.into(States).entries(result);

        console.log(result);

        return result;
    })




    this.on('tracklocation', async (req) => {

        let { ID } = req.data;
        console.log(ID);

        let store = await SELECT.one.from(States).where({ ID: ID });

        console.log(store)

        if (!store) {
            return `No state found for ID ${ID}`;
        }

        let city = store.stateName;
        console.log(city);

        try {
            let response = await axios.get(
                `https://task6.cfapps.us10-001.hana.ondemand.com/odata/v4/geoservice/getLocation(city='${city}')`
            );

            console.log(response.data);

            let result = response.data;

            return {
                latitude: parseFloat(result.latitude),
                longitude: parseFloat(result.longitude)
            }

        } catch (error) {
            console.error("API ERROR:", error.message);

            return `External API failed: ${error.message}`;
        }
    });



    this.on('READ', 'States', async (req) => {
        let data = await SELECT.from(States)
        console.log(data);
        return data
    })

    this.on('UPDATE', 'States', async (req) => {

        let ID = req.params[0];

        let existing = await SELECT.one.from(States).where({ ID });

        if (!existing) return req.error(404, 'State Not Found');

        await UPDATE(States).set(req.data).where({ ID });

        return await SELECT.one.from(States).where({ ID });
    });

    this.on('DELETE', 'States', async (req) => {

        let ID = req.data.ID;

        let existing = await SELECT.one.from(States).where({ ID });

        if (!existing) return req.error(404, 'State not found');

        await DELETE.from(States).where({ ID });

        return { message: "Deleted" };
    });


    //Dealers


    this.before('CREATE', 'Dealers', async (req) => {

        let { ID, dealerName, state_ID, parentDealer_ID } = req.data;

        if (!dealerName || !state_ID) {
            return req.error(400, 'dealerName and state_ID are required');
        }

        let existing = await SELECT.one.from(Dealers).where({ ID });

        if (existing) {
            return req.error(400, `Dealer with ID ${ID} already exists`);
        }

        console.log(req.data)

    });

    this.on('READ', 'Dealers', async (req) => {
        let data = await SELECT.from(Dealers)
        console.log(data);
        return data
    })

    this.on('UPDATE', 'Dealers', async (req) => {

        let ID = req.params[0];

        let existing = await SELECT.one.from(Dealers).where({ ID });

        if (!existing) return req.error(404, 'Dealers Not Found');

        await UPDATE(Dealers).set(req.data).where({ ID });

        return await SELECT.one.from(Dealers).where({ ID });
    });



    this.on('DELETE', 'Dealers', async (req) => {

        let ID = req.data.ID;

        let existing = await SELECT.one.from(Dealers).where({ ID });

        if (!existing) return req.error(404, 'Dealer not found');

        await DELETE.from(Dealers).where({ ID });

        return { message: "Deleted" };
    });


    // Customers

    this.before('CREATE', 'Customers', async (req) => {

        let { ID, customerName, state_ID, orders_ID } = req.data;

        if (!customerName || !state_ID) {
            return req.error(400, 'firlds are required');
        }

        let existing = await SELECT.one.from(Customers).where({ ID });

        if (existing) {
            return req.error(400, `Dealer with ID ${ID} already exists`);
        }

        console.log(req.data)

    });


    this.on('READ', 'Customers', async (req) => {
        let data = await SELECT.from(Customers)
        console.log(data);
        return data
    })


    this.on('UPDATE', 'Customers', async (req) => {

        let ID = req.params[0];

        let existing = await SELECT.one.from(Customers).where({ ID });

        if (!existing) return req.error(404, 'Dealers Not Found');

        await UPDATE(Customers).set(req.data).where({ ID });

        return await SELECT.one.from(Customers).where({ ID });
    });

    this.on('DELETE', 'Customers', async (req) => {

        let ID = req.data.ID;

        let existing = await SELECT.one.from(Customers).where({ ID });

        if (!existing) return req.error(404, 'Customer not found');

        await DELETE.from(Customers).where({ ID });

        return { message: "Deleted" };
    });



    // Orders


    this.before('CREATE', 'Orders', async (req) => {

        let { ID, orderDate, customer_ID } = req.data;

        if (!orderDate || !customer_ID) {
            return req.error(400, 'firlds are required');
        }

        let existing = await SELECT.one.from(Orders).where({ ID });

        if (existing) {
            return req.error(400, `Orders with ID ${ID} already exists`);
        }

        console.log(req.data)

    });

    this.on('READ', 'Orders', async (req) => {
        let data = await SELECT.from(Orders)
        console.log(data);
        return data
    })


    this.on('UPDATE', 'Orders', async (req) => {

        let ID = req.params[0];

        let existing = await SELECT.one.from(Orders).where({ ID });

        if (!existing) return req.error(404, 'Orders Not Found');

        await UPDATE(Orders).set(req.data).where({ ID });

        return await SELECT.one.from(Orders).where({ ID });
    });

    this.on('DELETE', 'Orders', async (req) => {

        let ID = req.data.ID;

        let existing = await SELECT.one.from(Orders).where({ ID });

        if (!existing) return req.error(404, 'Order not found');

        await DELETE.from(Orders).where({ ID });

        return { message: "Deleted" };
    });


    // 🔍 SEARCH STATE
    this.on('searchState', async (req) => {

        const name = req.data.name;

        const url = `http://api.geonames.org/searchJSON?q=${name}&country=IN&featureCode=ADM1&maxRows=10&username=${USERNAME}`;

        const res = await axios.get(url);

        return res.data.geonames.map(s => ({
            name: s.name,
            geoId: s.geonameId,
            lat: s.lat,
            lng: s.lng,
            population: s.population || 0
        }));
    });

    // 🔥 UNIVERSAL CHILD FETCH (STATE → DISTRICT → CITY)
    this.on('getChildren', async (req) => {

        const geoId = req.data.geoId;

        const url = `http://api.geonames.org/childrenJSON?geonameId=${geoId}&username=${USERNAME}`;

        const res = await axios.get(url);

        return res.data.geonames.map(p => ({
            name: p.name,
            geoId: p.geonameId,
            lat: p.lat,
            lng: p.lng,
            population: p.population || 0
        }));

    });

});


