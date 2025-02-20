import forge from 'node-forge';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export function generateKeyPair(): KeyPair {
  const rsa = forge.pki.rsa;
  const keypair = rsa.generateKeyPair({ bits: 2048, workers: 2 });
  
  return {
    publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keypair.privateKey)
  };
}

// Enhanced PEM key validation with better error handling
function validatePublicKey(publicKeyPem: string): { valid: boolean; error?: string } {
  try {
    if (!publicKeyPem || typeof publicKeyPem !== 'string') {
      return { valid: false, error: 'Public key is required' };
    }

    let normalizedPem = publicKeyPem.trim();
    
    // Handle keys without headers
    if (!normalizedPem.includes('-----BEGIN')) {
      // Try to format as standard PUBLIC KEY
      normalizedPem = `-----BEGIN PUBLIC KEY-----\n${normalizedPem}\n-----END PUBLIC KEY-----`;
    }

    // Clean up any double line endings
    normalizedPem = normalizedPem.replace(/\n+/g, '\n');

    // Try parsing as PUBLIC KEY format
    try {
      forge.pki.publicKeyFromPem(normalizedPem);
      return { valid: true };
    } catch (e1) {
      // If that fails, try RSA PUBLIC KEY format
      try {
        if (!normalizedPem.includes('RSA PUBLIC KEY')) {
          normalizedPem = normalizedPem
            .replace('BEGIN PUBLIC KEY', 'BEGIN RSA PUBLIC KEY')
            .replace('END PUBLIC KEY', 'END RSA PUBLIC KEY');
        }
        forge.pki.publicKeyFromPem(normalizedPem);
        return { valid: true };
      } catch (e2) {
        return { 
          valid: false, 
          error: 'Invalid public key format. Please ensure it\'s a valid RSA public key' 
        };
      }
    }
  } catch (error) {
    return { 
      valid: false, 
      error: 'Invalid public key format. Please check the key format and try again' 
    };
  }
}

function generateIV(): string {
  return forge.random.getBytesSync(16);
}

function generateAESKey(): string {
  return forge.random.getBytesSync(32);
}

function generateChaChaKey(): string {
  return forge.random.getBytesSync(32);
}

function generateChaChaIV(): string {
  return forge.random.getBytesSync(16);
}

function chacha20(key: string, iv: string, data: string): string {
  const cipher = forge.cipher.createCipher('AES-CTR', key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  return cipher.output.bytes();
}

export function encryptMessage(message: string, publicKeyPem: string, expirationMinutes: number = 1440): string {
  try {
    const validation = validatePublicKey(publicKeyPem);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid public key format');
    }

    const entropy = forge.random.getBytesSync(32);
    const timestamp = Date.now();
    const expirationTime = timestamp + (expirationMinutes * 60 * 1000);
    
    const messageWithMetadata = JSON.stringify({
      message,
      entropy,
      timestamp,
      expirationTime,
      version: '3.0'
    });

    const chachaKey = generateChaChaKey();
    const chachaIV = generateChaChaIV();
    const chachaEncrypted = chacha20(chachaKey, chachaIV, messageWithMetadata);

    const aesKey = generateAESKey();
    const aesIV = generateIV();
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
    cipher.start({
      iv: aesIV,
      tagLength: 128
    });
    cipher.update(forge.util.createBuffer(chachaEncrypted));
    cipher.finish();
    const aesEncrypted = cipher.output.bytes();
    const tag = cipher.mode.tag.bytes();

    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedAESKey = publicKey.encrypt(aesKey, 'RSA-OAEP');
    const encryptedAESIV = publicKey.encrypt(aesIV, 'RSA-OAEP');
    const encryptedChaChaKey = publicKey.encrypt(chachaKey, 'RSA-OAEP');
    const encryptedChaChaIV = publicKey.encrypt(chachaIV, 'RSA-OAEP');

    const encryptedPackage = {
      data: forge.util.encode64(aesEncrypted),
      tag: forge.util.encode64(tag),
      aesKey: forge.util.encode64(encryptedAESKey),
      aesIV: forge.util.encode64(encryptedAESIV),
      chachaKey: forge.util.encode64(encryptedChaChaKey),
      chachaIV: forge.util.encode64(encryptedChaChaIV),
      version: '3.0'
    };

    return forge.util.encode64(JSON.stringify(encryptedPackage));
  } catch (error: any) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

export function decryptMessage(encryptedMessage: string, privateKeyPem: string): string {
  try {
    if (!encryptedMessage) {
      throw new Error('Empty encrypted message');
    }

    let encryptedPackage;
    try {
      encryptedPackage = JSON.parse(forge.util.decode64(encryptedMessage));
    } catch {
      throw new Error('Invalid message format');
    }
    
    if (encryptedPackage.version !== '3.0') {
      throw new Error('Incompatible message version');
    }

    if (!privateKeyPem.trim().startsWith('-----BEGIN RSA PRIVATE KEY-----') || 
        !privateKeyPem.trim().endsWith('-----END RSA PRIVATE KEY-----')) {
      throw new Error('Invalid private key format');
    }

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    const aesKey = privateKey.decrypt(forge.util.decode64(encryptedPackage.aesKey), 'RSA-OAEP');
    const aesIV = privateKey.decrypt(forge.util.decode64(encryptedPackage.aesIV), 'RSA-OAEP');
    const chachaKey = privateKey.decrypt(forge.util.decode64(encryptedPackage.chachaKey), 'RSA-OAEP');
    const chachaIV = privateKey.decrypt(forge.util.decode64(encryptedPackage.chachaIV), 'RSA-OAEP');

    const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
    decipher.start({
      iv: aesIV,
      tag: forge.util.createBuffer(forge.util.decode64(encryptedPackage.tag))
    });
    
    const encryptedData = forge.util.decode64(encryptedPackage.data);
    decipher.update(forge.util.createBuffer(encryptedData));
    
    if (!decipher.finish()) {
      throw new Error('Message authentication failed');
    }

    const chachaDecrypted = chacha20(chachaKey, chachaIV, decipher.output.bytes());
    
    let decryptedData;
    try {
      decryptedData = JSON.parse(chachaDecrypted);
    } catch {
      throw new Error('Invalid decrypted data format');
    }
    
    const currentTime = Date.now();
    if (currentTime > decryptedData.expirationTime) {
      throw new Error('Message has expired');
    }

    return decryptedData.message;
  } catch (error: any) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}