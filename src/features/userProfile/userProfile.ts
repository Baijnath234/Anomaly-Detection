import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileUser, UserDataPermissions } from '../../models/users';
import { RootStateType } from '../../app/store';
import { IPermissionDto } from '../../_submodules/sharedInfrastucture/permissions';

interface UserState {
  user: ProfileUser | null;
  appMenuState: {
    collapsed: boolean;
    hovered: boolean;
  };
}

const initialState: UserState = {
  user: null,
  appMenuState: {
    collapsed: false,
    hovered: false,
  },
};

const userProfile = createSlice({
  name: 'userProfile',
  initialState: initialState,
  reducers: {
    setUser: (state: UserState, { payload }: PayloadAction<ProfileUser>) => {
      state.user = payload;
    },
    setAppMenuCollapsed: (state: UserState, { payload }: PayloadAction<boolean>) => {
      state.appMenuState.collapsed = payload;
    },
    setAppMenuHovered: (state: UserState, { payload }: PayloadAction<boolean>) => {
      state.appMenuState.hovered = payload;
    },
    resetUser: () => initialState,
  },
});

export const userProfileReducer = userProfile.reducer;

export const { setUser, setAppMenuCollapsed, setAppMenuHovered, resetUser } = userProfile.actions;

export const selectUser = (state: RootStateType): ProfileUser | null => state.userProfile.user;
export const selectUserPermissions = (state: RootStateType): IPermissionDto | undefined =>
  state.userProfile.user?.permission;
export const selectUserDataPermission = (state: RootStateType): UserDataPermissions =>
  state.userProfile.user?.dataPermission || { plant: [], branch: [], unit: [] };
export const selectAppMenuCollapsed = (state: RootStateType): boolean => state.userProfile.appMenuState.collapsed;
export const selectAppMenuHovered = (state: RootStateType): boolean => state.userProfile.appMenuState.hovered;
