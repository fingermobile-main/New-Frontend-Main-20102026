import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from typing import Dict, Any, Union

class DataEncryption:
    """
    Ensures comprehensive data encryption for all member data at rest and in transit,
    with robust key management.
    """

    def __init__(self):
        self.aes_keys = {}
        self.rsa_keys = {}
        print("DataEncryption module initialized.")

    def generate_aes_key(self, key_id: str) -> bytes:
        """
        Generates a new 256-bit AES key.
        """
        key = os.urandom(32)  # 256-bit key
        self.aes_keys[key_id] = key
        print(f"AES key {key_id} generated.")
        return key

    def get_aes_key(self, key_id: str) -> bytes:
        """
        Retrieves an AES key by its ID.
        """
        if key_id not in self.aes_keys:
            raise ValueError(f"AES key with ID {key_id} not found.")
        return self.aes_keys[key_id]

    def encrypt_aes(self, data: bytes, key_id: str) -> Dict[str, bytes]:
        """
        Encrypts data using AES-256 in GCM mode.
        """
        key = self.get_aes_key(key_id)
        iv = os.urandom(16)  # Initialization vector
        cipher = Cipher(algorithms.AES(key), modes.GCM(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(data) + encryptor.finalize()
        print(f"Data encrypted with AES key {key_id}.")
        return {"ciphertext": ciphertext, "iv": iv, "tag": encryptor.tag}

    def decrypt_aes(self, encrypted_data: Dict[str, bytes], key_id: str) -> bytes:
        """
        Decrypts data using AES-256 in GCM mode.
        """
        key = self.get_aes_key(key_id)
        cipher = Cipher(algorithms.AES(key), modes.GCM(encrypted_data["iv"], encrypted_data["tag"]), backend=default_backend())
        decryptor = cipher.decryptor()
        plaintext = decryptor.update(encrypted_data["ciphertext"]) + decryptor.finalize()
        print(f"Data decrypted with AES key {key_id}.")
        return plaintext

    def generate_rsa_key_pair(self, key_id: str) -> Dict[str, Union[rsa.RSAPrivateKey, rsa.RSAPublicKey]]:
        """
        Generates an RSA key pair (private and public keys).
        """
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        public_key = private_key.public_key()
        self.rsa_keys[key_id] = {"private": private_key, "public": public_key}
        print(f"RSA key pair {key_id} generated.")
        return {"private": private_key, "public": public_key}

    def get_rsa_public_key(self, key_id: str) -> rsa.RSAPublicKey:
        """
        Retrieves an RSA public key by its ID.
        """
        if key_id not in self.rsa_keys:
            raise ValueError(f"RSA key pair with ID {key_id} not found.")
        return self.rsa_keys[key_id]["public"]

    def get_rsa_private_key(self, key_id: str) -> rsa.RSAPrivateKey:
        """
        Retrieves an RSA private key by its ID.
        """
        if key_id not in self.rsa_keys:
            raise ValueError(f"RSA key pair with ID {key_id} not found.")
        return self.rsa_keys[key_id]["private"]

    def encrypt_rsa(self, data: bytes, public_key_id: str) -> bytes:
        """
        Encrypts data using RSA public key.
        """
        public_key = self.get_rsa_public_key(public_key_id)
        ciphertext = public_key.encrypt(
            data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        print(f"Data encrypted with RSA public key {public_key_id}.")
        return ciphertext

    def decrypt_rsa(self, ciphertext: bytes, private_key_id: str) -> bytes:
        """
        Decrypts data using RSA private key.
        """
        private_key = self.get_rsa_private_key(private_key_id)
        plaintext = private_key.decrypt(
            ciphertext,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        print(f"Data decrypted with RSA private key {private_key_id}.")
        return plaintext

    def secure_key_storage(self, key_id: str, key: bytes, key_type: str):
        """
        Conceptual method for secure key storage.
        In a real system, this would involve HSMs, KMS, or secure enclaves.
        """
        print(f"Key {key_id} of type {key_type} conceptually stored securely.")

    def secure_key_retrieval(self, key_id: str, key_type: str) -> bytes:
        """
        Conceptual method for secure key retrieval.
        """
        print(f"Key {key_id} of type {key_type} conceptually retrieved securely.")
        # For demonstration, we'll return a dummy key if not found in memory
        if key_type == "aes" and key_id in self.aes_keys:
            return self.aes_keys[key_id]
        elif key_type == "rsa_private" and key_id in self.rsa_keys:
            return self.rsa_keys[key_id]["private"]
        elif key_type == "rsa_public" and key_id in self.rsa_keys:
            return self.rsa_keys[key_id]["public"]
        return os.urandom(32) # Dummy key for conceptual retrieval
