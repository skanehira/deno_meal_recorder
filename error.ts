export class NotFoundMealError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundMealError";
  }
}
