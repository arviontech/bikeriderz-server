import { config } from '../config';
import { USER_Role } from '../modules/User/user.constants';
import { User } from '../modules/User/user.model';

const superAdminData = {
  name: config.SUPERADMIN.NAME,
  email: config.SUPERADMIN.EMAIL,
  phone: config.SUPERADMIN.PHONE,
  password: config.SUPERADMIN.PASSWORD,
  role: config.SUPERADMIN.ROLE,
  nidCardNo: config.SUPERADMIN.SUPERADMIN_NID,
  // isDeleted: config.SUPERADMIN.IS_DELETED,
};

export const seedingSuperAdmin = async () => {
  try {
    const isSuperAtcAdminExits = await User.findOne({
      role: USER_Role.super_admin,
    });

    if (!isSuperAtcAdminExits) {
      await User.create(superAdminData);
      console.log('Super admin is sedding in database successfully');
    } else {
      console.log('Super admin already exists. Skipping creation.');
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
};
