// Roles.
export class UserRoles {
  role = '';

  isAdmin() {
    return false;
  }

  isOwner() {
    return true;
  }
}
