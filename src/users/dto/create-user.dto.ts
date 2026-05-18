export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string; // expects an already-hashed value
}
