export class User {
  constructor(
    public id: number,
    public givenName: string,
    public familyName: string,
    public pictureUrl: string,
    public nickName?: string,
    public introduction?: string
  ) {}
}
