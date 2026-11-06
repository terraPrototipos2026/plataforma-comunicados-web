declare module 'multer' {
  export function diskStorage(options: {
    destination?: string | ((req: any, file: any, cb: (error: Error | null, destination: string) => void) => void);
    filename?: (req: any, file: any, cb: (error: Error | null, filename: string) => void) => void;
  }): any;
  export function memoryStorage(): any;
  const multer: any;
  export default multer;
}

declare namespace Express {
  namespace Multer {
    export interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}
