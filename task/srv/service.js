const cds=require('@sap/cds');

module.exports=cds.service.impl( async function () {
    const {Customer , Payment , Shipment}=this.entities;

    //Acton For Customer Number

    this.on('CustomerNumber',async (req)=>{
        const {customer_id}=req.data;

        let existing=await SELECT.one.from(Customer).where({customer_id:customer_id})

        if(!existing) req.error(`with this ID ${customer_id} Customer does not exist`)

        //if Customer there
        
             await UPDATE(Customer)
             .set({phone:9386})
             .where({customer_id:existing.customer_id})

             //return the changed customer

             let updatedcustomer=await SELECT.one.from(Customer).where({customer_id})



             console.log(`Customer ${updatedcustomer.last_name} is Phone number is Changed to ${updatedcustomer.phone}`)

              console.log(updatedcustomer)
              return
    })

    // Action For CustomerAddress

        this.on('CustomeAddress',async(req)=>{
            const {customer_id}=req.data;

            let existing= await SELECT.one.from(Customer).where({customer_id:customer_id})

            if (!existing) req.error(404,'With this id Customer Does not found') ;

            // if Customer is there 

                 await UPDATE(Customer)
                 .set({address:'bengaluru'})
                 .where({customer_id:existing.customer_id})

             let updatedcustomer=await SELECT.one.from(Customer).where({customer_id})

             console.log(`Customer ${updatedcustomer.last_name} Address is changed to ${updatedcustomer.address}`)

             return ;
        })



        // Action For PaymentStatus

        this.on('PaymentStatus',async(req)=>{
            const {payment_id}=req.data;

            let existing= await SELECT.one.from(Payment).where({payment_id:payment_id})

            if (!existing) req.error(404,'With this id Customer Does not found') ;

            // if Customer is there 

                 await UPDATE(Payment)
                 .set({payment_status:'Completed'})
                 .where({payment_id:existing.payment_id})

             let updatedcustomer=await SELECT.one.from(Payment).where({payment_id})

             console.log(`Payment Pending is changed to completed`)

             return ;
        })



        // Action For ShipmentStatus

        this.on('ShipmentStatus',async(req)=>{
            const {shipment_id}=req.data;

            let existing= await SELECT.one.from(Shipment).where({shipment_id:shipment_id})

            if (!existing) req.error(404,'With this id Customer Does not found') ;

            // if Customer is there 

                 await UPDATE(Shipment)
              fthis.se   .set({shipment_status:'Completed'})
                 .where({shipment_id:existing.shipment_id})

             let updatedcustomer=await SELECT.one.from(Shipment).where({shipment_id})

             console.log(`Shipment Pending is changed to completed`)

             return ;
        })


    //function For TotalPayment

        this.on('TotalPayment',async(req)=>{
            const {payment_id}=req.data;
            console.log('this is running')

            let existing = await SELECT.one.from(Payment).where({payment_id:payment_id});

            if(! existing) req.error(404,'This payment Id does not exist');

            //if there 

                let total=existing.quantity * existing.payment_amount;

                console.log(total);

                return total;
                
        })





        //function For MonthlyShipments

        this.on('MonthlyShipment',async(req)=>{
            const {shipment_id}=req.data;
            console.log('this is running')

            let existing = await SELECT.one.from(Shipment).where({shipment_id:shipment_id});

            if(! existing) req.error(404,'This payment Id does not exist');

            //if there 

                let total=existing.daily_shipments * (3*30);

                console.log(total);

                return total;
                
        })


        //function For ShipmentCarring

        this.on('ShipmentCarring',async(req)=>{
            const {shipment_id}=req.data;
            

            let existing = await SELECT.one.from(Shipment).where({shipment_id:shipment_id});

            if(! existing) req.error(404,'This shipment Id does not exist');

            //if there 

                let total=existing.carrier 

                console.log(total);

                return total;
                
        })


})

