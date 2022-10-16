import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { CreateAccountInput } from '../../application/auth/dtos/inputs/create-account.input'
import { CreateAdminAccountInput } from '../../application/auth/dtos/inputs/create-admin-account.input'
import { LoginUserInput } from '../../application/auth/dtos/inputs/login.input'
import { AcccessTokenResponseModel } from '../../application/auth/dtos/models/accesstoken-response.model'
import { UserRequest } from '../../application/auth/dtos/response/auth.response'
import { IAuthService } from '../../application/auth/services/auth.service.interface'
import { RolesEnum } from '../../application/common/roles.enum'
import { UserWithInfoModel } from '../../application/user/dtos/models/user-with-info.model'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { GqlLoginAuthGuard } from '../guards/login-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: IAuthService) {}

  @Mutation(() => UserWithInfoModel, { name: 'createAdminAccount' })
  createAdminAccount(@Args('createAdminAccountInput') params: CreateAdminAccountInput) {
    return this.authService.createAdminAccount(params)
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Mutation(() => UserWithInfoModel, { name: 'createCustomerAccount' })
  activeAccount(@Args('createAccountInput') params: CreateAccountInput): Promise<UserWithInfoModel> {
    return this.authService.createCustomerAccount(params)
  }

  @UseGuards(GqlLoginAuthGuard)
  @Mutation(() => AcccessTokenResponseModel, { name: 'login' })
  login(
    @Args('loginUserInput') params: LoginUserInput,
    @Context() context: UserRequest,
  ): Promise<AcccessTokenResponseModel> {
    return this.authService.login(context.user)
  }
}
