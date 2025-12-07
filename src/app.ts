import express from 'express'
import createDB from './config/DataBase'
import { UserRouter } from './Modules/Users/user.router';
import { AuthRouter } from './Modules/Authentication/auth.router';
import { VehicleRouter } from './Modules/Vehicles/vehicles.router';
import { BookingRouter } from './Modules/Bookings/booking.router';

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World')
})

// DataBase Initialization
createDB()


// User Authentication
app.use('/api/v1/auth/',AuthRouter)

//Vehicle Portion
app.use('/api/v1/',VehicleRouter)

//Users
app.use('/api/v1/',UserRouter)

//Bookings
app.use('/api/v1/',BookingRouter)

export default app
