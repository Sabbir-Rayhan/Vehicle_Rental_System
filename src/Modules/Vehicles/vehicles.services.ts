import { pool } from "../../config/DataBase"

const AddVehicles = async (paylod: Record<string, unknown>) => {
  if (!paylod) {
    throw new Error("Payload Missing...!");
  }
  const {vehicle_name,type,registration_number,daily_rent_price,availability_status } = paylod;


  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [ vehicle_name,type,registration_number,daily_rent_price,availability_status]
  );

  return result;
};

const viewVehicles = async()=>{
    const result = await pool.query(`SELECT * FROM vehicles`)
    return result
}


const viewSingleVehicles = async(ID : string)=>{
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`,[ID])
    return result
}



const updateVehicle = async(payload : Record<string,unknown>,ID : string)=>{

    const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = payload;


    const result = await pool.query(`UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`, [vehicle_name,type,registration_number,daily_rent_price,availability_status,ID])
    return result
}

const deleteVehicle = async(ID : string)=>{

    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`,[ID])
    return result
}





export const VehicleServices = {
  AddVehicles,
  viewVehicles,
  viewSingleVehicles,
  updateVehicle,
  deleteVehicle
};
