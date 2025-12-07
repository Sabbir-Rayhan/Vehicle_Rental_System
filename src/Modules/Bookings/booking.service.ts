import { pool } from "../../config/DataBase";

const makeBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const isvehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicle_id,
  ]);

  const vehicle = isvehicle.rows[0];

  if (!vehicle) throw new Error("Vehicle not found");

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  const start = new Date(rent_start_date as Date);
  const end = new Date(rent_end_date as Date);

  const diffTime = end.getTime() - start.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (totalDays <= 0) throw new Error("Invalid rental duration");

  const total_price = totalDays * vehicle.daily_rent_price;

  const bookingResult = await pool.query(
    `INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  await pool.query(
    "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
    [vehicle_id]
  );

  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const viewBookings = async () => {
  const result = await pool.query(`SELECT * FROM bookings where status = $1`, [
    "active",
  ]);

  const data = result.rows;

  const mainData = [];

  for (const dt of data) {
    const { customer_id, vehicle_id } = dt;

    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      customer_id,
    ]);

    const customer = user.rows[0];

    const vc = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      vehicle_id,
    ]);

    const vehicle = vc.rows[0];

    mainData.push({
      ...dt,
      customer: {
        name: customer.name,
        email: customer.email,
      },
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
      },
    });
  }

  return mainData;
};

const viewOwnBookings = async (Id: string) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = $2`,
    [Id, "active"]
  );

  const data = result.rows;
  const finalData = [];

  for (const dt of data) {
    const vc = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      dt.vehicle_id,
    ]);

    const vehicle = vc.rows[0];

    finalData.push({
      ...dt,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
        type: vehicle.type,
      },
    });
  }

  return finalData;
};

const updateAdminBooking = async (bookingId: string) => {
  
  const booked = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (booked.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const vehicleId = booked.rows[0].vehicle_id;


  const updatedBooking = await pool.query(
    `UPDATE bookings 
     SET status = 'returned' 
     WHERE id = $1 
     RETURNING *`,
    [bookingId]
  );


  await pool.query(
    `UPDATE vehicles 
     SET availability_status = 'available'
     WHERE id = $1`,
    [vehicleId]
  );

  return {
    ...updatedBooking.rows[0],
    vehicle: {
      availability_status: "available",
    },
  };
};






const updateCustomerBooking = async (bookingId: string, userId: string) => {
  const cancel = await pool.query(
    `SELECT * FROM bookings WHERE id = $1 AND customer_id = $2`,
    [bookingId,userId]
  );

  if (cancel.rows.length === 0) {
    throw new Error("You haven't Booked Yet");
  }

  const updated = await pool.query(
    `UPDATE bookings 
     SET status = 'cancelled'
     WHERE id = $1
     RETURNING *`,
    [bookingId]
  );

  return updated.rows[0];
};

export const BookingService = {
  makeBooking,
  viewBookings,
  viewOwnBookings,
  updateAdminBooking,
  updateCustomerBooking,
};
