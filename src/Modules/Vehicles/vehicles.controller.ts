import { Request, Response } from "express";
import { VehicleServices } from "./vehicles.services";

const AddVehicles = async (req: Request, res: Response) => {
  try {
    const result = await VehicleServices.AddVehicles(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};


const viewVehicles = async(req: Request,res : Response)=>{
    try {
    const result = await VehicleServices.viewVehicles()
    res.status(201).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}



const viewSingleVehicles = async(req: Request,res : Response)=>{
    try {
    const result = await VehicleServices.viewSingleVehicles(req.params.vehicleId!)
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}



const updateVehicle = async(req: Request,res : Response)=>{
    try {
    const result = await VehicleServices.updateVehicle(req.body,req.params.vehicleId!)
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}


const deleteVehicle = async(req: Request,res : Response)=>{
    try {
    const result = await VehicleServices.deleteVehicle(req.params.vehicleId!)
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}



export const VehicleController = {
  AddVehicles,
  viewVehicles,
  viewSingleVehicles,
  updateVehicle,
  deleteVehicle
};
