export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64); // Decodifica de Base64 para string binária
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }


export function stringToUint8Array(byteString: string): Uint8Array {
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }
    return bytes;
  }