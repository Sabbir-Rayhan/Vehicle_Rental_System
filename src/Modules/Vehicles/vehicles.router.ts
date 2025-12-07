import {Router} from 'express'
import { VehicleController } from './vehicles.controller';
import Authenticate from '../../Middleware/Authintication_Middleware';

const router = Router()



router.post('/vehicles', Authenticate("admin"), VehicleController.AddVehicles);

router.get('/vehicles', Authenticate("admin", "customer"), VehicleController.viewVehicles);

router.get('/vehicles/:vehicleId', Authenticate("admin", "customer"), VehicleController.viewSingleVehicles);

router.put('/vehicles/:vehicleId', Authenticate("admin"), VehicleController.updateVehicle);

router.delete('/vehicles/:vehicleId', Authenticate("admin"), VehicleController.deleteVehicle);


export const VehicleRouter = router;