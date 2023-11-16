export class User {
  public id: number;
  public userId: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public password: string;
  public email: string;
  public profileImage: string;
  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  public role: string;
  public authorities: [];
  public active: boolean;
  public notLocked: boolean;

  constructor() {
    this.id = 0;
    this.userId = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    //this.password = '';
    this.email = '';
    this.profileImage = '';
    this.lastLoginDate = null;
    this.lastLoginDateDisplay = null;
    this.joinDate = null;
    this.role = '';
    this.authorities = [];
    this.active = false;
    this.notLocked = false;
  }

}
