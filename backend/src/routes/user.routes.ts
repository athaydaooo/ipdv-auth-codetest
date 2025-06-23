import { UserController, UserControllerProps } from '@controllers/user-controller';
import { Router } from 'express';
import { UserRepository } from '../repositories/user-repository';
import { DeleteUserByIdService } from '../services/user/delete-user-by-id-service/delete-user-by-id-service';
import { GetUserByIdService } from '../services/user/get-user-by-id-service/get-user-by-id-service';
import { GetUsersService } from '../services/user/get-users-service/get-users-service';
import { PostUserService } from '../services/user/post-user-service/post-user-service';
import { UpdatePasswordByIdService } from '../services/user/update-password-by-id-service/update-password-by-id-service';
import { UpdateUserByIdService } from '../services/user/update-user-by-id-service/update-user-by-id-service';
import { UpdateUserRolesByIdService } from '../services/user/update-user-roles-by-id-service/update-user-roles-by-id-service';

const userRepository = new UserRepository();

const getUsersService = new GetUsersService(userRepository);
const deleteUserByIdService = new DeleteUserByIdService(userRepository);
const getUserByIdService = new GetUserByIdService(userRepository);
const postUserService = new PostUserService(userRepository);
const updatePasswordByIdService = new UpdatePasswordByIdService(userRepository);
const updateUserRolesByIdService = new UpdateUserRolesByIdService(userRepository);
const updateUserById = new UpdateUserByIdService(userRepository);

const userProps : UserControllerProps = {
    getUsersService,
    deleteUserByIdService,
    getUserByIdService,
    postUserService,
    updatePasswordByIdService,
    updateUserRolesByIdService,
    updateUserById,
};

const userController = new UserController(userProps);

const userRouter = Router();

userRouter.get('/', userController.getUsers.bind(userController));
userRouter.get('/:id', userController.getUser.bind(userController));
userRouter.post('/', userController.postUser.bind(userController));
userRouter.put('/:id', userController.putUser.bind(userController));
userRouter.put('/:id/password', userController.putPassword.bind(userController));
userRouter.put('/:id/roles', userController.putUserRoles.bind(userController));
userRouter.delete('/:id', userController.deleteUser.bind(userController));


export default userRouter;