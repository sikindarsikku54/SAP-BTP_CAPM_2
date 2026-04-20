const cds = require('@sap/cds')

module.exports = cds.service.impl(async function () {

  const { Vehicles, Orders } = this.entities

  
  //  GENERIC BEFORE CREATE
  
  this.before('CREATE', '*', async (req) => {
    console.log(`Creating entity: ${req.target}`)

    // Basic validation
    for (let field in req.data) {
      if (req.data[field] === null || req.data[field] === '') {
        req.error(400, `${field} cannot be empty`)
      }
    }
  })

  
  //  BEFORE CREATE VEHICLE

  this.before('CREATE', 'Vehicles', async (req) => {

    const dealer = await SELECT.one.from('vehicle.db.Dealers')
      .where({ ID: req.data.dealer_ID })

      // console.log(dealer)

    if (!dealer) req.error(404, 'Dealer not found')

    const state = dealer.location

    // Generate ID based on state
    const count = await SELECT.from(Vehicles).columns('count(*) as total')
    const nextNumber = (count.length + 1).toString().padStart(3, '0')

    req.data.ID = `${state}-${nextNumber}`

    // Tax Calculation
    let tax = 0
    if (state === 'TN') tax = 0.18
    else if (state === 'KA') tax = 0.12

    req.data.price = req.data.basePrice + (req.data.basePrice * tax)
    req.data.status = 'Pending'
  })

 
  //  AFTER CREATE VEHICLE
  
  this.after('CREATE', 'Vehicles', (data) => {
    console.log(`Vehicle ${data.ID} created successfully`)
  })

  
  //  CUSTOM ACTION
 
  this.on('approveVehicle', async (req) => {

    const { vehicleID } = req.data

    const vehicle = await SELECT.one.from(Vehicles)
      .where({ ID: vehicleID })

    if (!vehicle) req.error(404, 'Vehicle not found')

    await UPDATE(Vehicles)
      .set({ status: 'Approved' })
      .where({ ID: vehicleID })

    return `Vehicle ${vehicleID} approved successfully`
  })

 
  //  CUSTOM FUNCTION
  
  this.on('getTotalOrderValue', async (req) => {

    const { vehicleID } = req.data

    const vehicle = await SELECT.one.from(Vehicles)
      .where({ ID: vehicleID })

    if (!vehicle) req.error(404, 'Vehicle not found')

    const orders = await SELECT.from(Orders)
      .where({ vehicle_ID: vehicleID })

      console.log(orders)

    let total=0;
    
     for(let i=0;i<orders.length;i++){
       total += orders[i].quantity * vehicle.price
     }
  

    console.log(total)
    return total
  })

})