import { ColumnSortMetaData } from 'primereact/column';
import { IPermissionDto, IPermissionItem, PermissionsEnum } from '~/_submodules/JAIME-SharedInterfaces/permissions';
import { RelationStringValue, RelationValue } from './common';

export interface UserListItem {
  externalId: string;
  email: string;
  displayName: string;
  accessGroups: RelationStringValue[];
  roles: { id: string | number | undefined; value: string; isReadonly?: boolean }[];
  branches: string[];
  powerPlants: string[];
  isActive: boolean;
  id: number;
}

export interface UserRole {
  notes: string;
  isActive: boolean;
  name: string;
  id?: number | string;
  permission?: IPermissionDto;
  numberOfAccess?: number;
  isReadonly?: boolean;
}

export type UserRoleFilters = Partial<Record<keyof UserRole, string[] | string | boolean>>;

export type UserRoleParams = UserRoleFilters & {
  first: number;
  page: number;
  take: number;
  order?: ColumnSortMetaData['order'];
  orderField?: string;
};

export type UserFilters = Partial<Record<keyof UserListItem, string[] | string | boolean>>;

export type AzureUserFilters = Partial<Record<keyof AzureUserList, string[] | string | boolean>>;

export type UserParams = UserFilters & {
  first: number;
  page: number;
  take: number;
  orderField?: string;
  order?: ColumnSortMetaData['order'];
};

export interface UserRoleSectionList extends IPermissionItem {
  key: PermissionsEnum;
}

export interface UserEditValues {
  roles: RelationValue[];
  isActive: boolean;
  branches: string[];
  ppNameAbbrs: string[];
}

export interface AccessGroups {
  groupId: string;
  name: string;
}
export interface PowerPlants {
  key: number;
  branch: string;
  powerPlantAbbr: string;
}

export interface CustomUserRoles extends UserRole {
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permission: Record<string, any[]>;
}

export interface User {
  id: number;
  externalId: string;
  info: {
    firstName: string;
    lastName: string;
    displayName?: string;
  };
  isActive: boolean;
  company: {
    id: number;
    name: string;
    domain: string;
    identityProvider: string;
    location: string;
  };
  email: string;
  roles: CustomUserRoles[];
  accessGroups: AccessGroups[];
  powerPlants: PowerPlants[];
  displayName: string;
}

export interface AzureUser {
  externalId: string;
  info: {
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  needGroup: boolean;
  email: string;
  displayName: string;
  groups?: string[];
}

export interface AzureUserList extends Omit<AzureUser, 'groups'> {
  accessGroups: RelationStringValue[];
}

export interface UserDataPermissions {
  plant: string[];
  branch: string[];
  unit: string[];
}

export interface ProfileUser extends Pick<User, 'id' | 'externalId' | 'info' | 'email' | 'powerPlants'> {
  company: {
    id: number;
    name: string;
  };
  permission: IPermissionDto;
  dataPermission: UserDataPermissions;
}

export type PublicUser = Pick<User, 'id' | 'externalId' | 'info' | 'displayName' | 'isActive'>;

export type UserRefs = Record<string, RelationStringValue[]>;

export interface UserRoleRefs {
  isActive: RelationStringValue[];
  numberOfAccess: RelationStringValue[];
}

interface RefAccessGroup {
  label: string;
  id: string;
}
export interface ProcessedUserRefs {
  branches: string[];
  powerPlants: string[];
  roles: RelationStringValue[];
  accessGroups: RefAccessGroup[];
  isActive: string[];
}

export interface ProcessedUserRoleRefs {
  isActive: string[];
  numberOfAccess: string[];
}

export interface AzureAccessGroup {
  groupId: string;
  name: string;
  isActive: boolean;
}

export interface AzureUserEditValues {
  roles: RelationValue[];
  branches: string[];
  ppNameAbbrs: string[];
}

export interface AzureUsersAddData extends Omit<AzureUserList, 'accessGroups'> {
  ppNameAbbrs: string[];
  roles: number[];
  accessGroups: string[];
  companyId: number;
}

export interface AlarmAssignedEngineer {
  assignType: string;
  controlNumber: string;
  displayName: string;
  ppNameAbbr: string;
  userId: number;
}
