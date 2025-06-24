import { RoleController, RoleControllerProps } from '@controllers/role-controller';
import { Router } from 'express';
import { RoleRepository } from '../repositories/role-repository';
import { GetRoleByIdService } from '../services/role/get-role-by-id-service/get-user-by-id-service';
import { GetRolesService } from '../services/role/get-roles-service/get-roles-service';
import { PostRoleService } from '../services/role/post-role-service/post-role-service';
import { UpdateRoleByIdService } from '../services/role/update-role-by-id-service/update-user-by-id-service';
import { UpdateRoleModuleByIdService } from '../services/role/update-role-module-by-id-service/update-role-module-by-id-service';

const roleRepository = new RoleRepository();

const getRoleByIdService = new GetRoleByIdService(roleRepository);
const getRolesService = new GetRolesService(roleRepository);
const postRoleService = new PostRoleService(roleRepository);
const updateRoleByIdService = new UpdateRoleByIdService(roleRepository);
const updateRoleModuleByIdService = new UpdateRoleModuleByIdService(roleRepository);

const roleProps: RoleControllerProps = {
    getRoleByIdService,
    getRolesService,
    postRoleService,
    updateRoleByIdService,
    updateRoleModuleByIdService,
};

const roleController = new RoleController(roleProps);

const roleRouter = Router();

roleRouter.get('/', roleController.getRoles.bind(roleController));
roleRouter.get('/:id', roleController.getRoleById.bind(roleController));
roleRouter.post('/', roleController.postRole.bind(roleController));
roleRouter.put('/:id', roleController.putRole.bind(roleController));
roleRouter.put('/:id/modules', roleController.putRoleModules.bind(roleController));

export default roleRouter;