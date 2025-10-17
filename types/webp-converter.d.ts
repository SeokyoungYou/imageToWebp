declare module "webp-converter" {
  type LogFunction = (message: string) => void;

  interface CwebpOptions {
    logging?: LogFunction;
  }

  interface WebpConverter {
    cwebp(
      source: string,
      destination: string,
      options?: string | string[],
      logging?: LogFunction
    ): Promise<string>;
    dwebp(
      source: string,
      destination: string,
      options?: string | string[],
      logging?: LogFunction
    ): Promise<string>;
    grant_permission(): void;
  }

  const webp: WebpConverter;
  export default webp;
}
