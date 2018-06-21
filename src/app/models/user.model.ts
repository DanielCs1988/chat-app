export class User {
  constructor(
    public email: string,
    public givenName: string,
    public familyName: string,
    public pictureUrl: string,
    public nickName?: string,
    public introduction?: string
  ) {}
}
