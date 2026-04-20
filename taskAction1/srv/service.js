const cds = require('@sap/cds');

module.exports = async (srv) => {
  const { Vehical } = srv.entities;

  // Action : VehicalNotify
  srv.on('vehicalNotify', async (req) => {
    const { ID } = req.data;

    let storeentity = await SELECT.one.from(Vehical).where({ ID })

    console.log(`${storeentity.model} is approved and notify to ${storeentity.dealer} Dealer`)
  })

  // Action : VehicalModel

  srv.on('vehicalModel', async (req) => {
    const { ID } = req.data;

    let existing = await SELECT.one.from(Vehical).where({ ID });

    if (!existing) req.error(404, 'Vehical Model Does Not Exist')


    if (Vehical.status != "Approved") {
      await UPDATE(Vehical)
        .set({ status: 'Approved' })
        .where({ ID })
    }
    await srv.emit('vehicalNotify', { ID })
    return
  })
}

