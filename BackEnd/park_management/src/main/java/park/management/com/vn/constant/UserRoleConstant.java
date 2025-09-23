package park.management.com.vn.constant;

public enum UserRoleConstant {
  ADMIN(1), MANAGER(2), STAFF(3), CUSTOMER(4);

  private final int code;

  UserRoleConstant(int code) {
    this.code = code;
  }

  public int getCode() {
    return code;
  }  
}
