// Roles.
export class UserRoles {
  role = '';

  isAdmin() {
    return true;
  }

  isOwner() {
    return false;
  }
}
