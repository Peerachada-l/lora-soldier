import base64
import os
import secrets
from typing import Optional

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import DeviceKey


def decode_b64(raw_value: str, field_name: str) -> bytes:
    try:
        return base64.b64decode(raw_value, validate=True)
    except Exception as exc:  # pragma: no cover - defensive decoding
        raise HTTPException(status_code=400, detail=f"Invalid base64 in {field_name}") from exc


def encode_b64(raw_value: bytes) -> str:
    return base64.b64encode(raw_value).decode("ascii")


class DeviceKeyService:
    def __init__(self, db: Session):
        self.db = db
        self._kek = self._load_kek()
        self._aesgcm = AESGCM(self._kek)

    def _load_kek(self) -> bytes:
        """Load key-encryption-key from env as base64-encoded 32 bytes."""
        kek_b64 = os.getenv("DEVICE_KEK_BASE64")
        if not kek_b64:
            raise HTTPException(
                status_code=500,
                detail="Server misconfigured: DEVICE_KEK_BASE64 is missing",
            )

        kek = decode_b64(kek_b64, "DEVICE_KEK_BASE64")
        if len(kek) != 32:
            raise HTTPException(
                status_code=500,
                detail="Server misconfigured: DEVICE_KEK_BASE64 must decode to 32 bytes",
            )
        return kek

    def _encrypt_lora_key(self, mac_address: bytes, lora_key: bytes) -> tuple[bytes, bytes]:
        nonce = os.urandom(12)
        ciphertext = self._aesgcm.encrypt(nonce, lora_key, associated_data=mac_address)
        return ciphertext, nonce

    def _decrypt_lora_key(self, mac_address: bytes, ciphertext: bytes, nonce: bytes) -> bytes:
        try:
            return self._aesgcm.decrypt(nonce, ciphertext, associated_data=mac_address)
        except Exception as exc:  # pragma: no cover - cryptographic error path
            raise HTTPException(status_code=500, detail="Failed to decrypt LoRa key") from exc

    def provision_device(self, mac_address: bytes, provided_lora_key: Optional[bytes]) -> tuple[bytes, bool]:
        if len(mac_address) != 4:
            raise HTTPException(status_code=400, detail="mac_address must be exactly 4 bytes")

        if provided_lora_key is None:
            lora_key = secrets.token_bytes(32)
            generated_new_key = True
        else:
            lora_key = provided_lora_key
            generated_new_key = False

        if len(lora_key) != 32:
            raise HTTPException(status_code=400, detail="lora_key must be exactly 32 bytes")

        ciphertext, nonce = self._encrypt_lora_key(mac_address, lora_key)
        device = self.db.query(DeviceKey).filter(DeviceKey.mac_address == mac_address).first()

        if device:
            device.key_ciphertext = ciphertext
            device.key_nonce = nonce
        else:
            device = DeviceKey(
                mac_address=mac_address,
                key_ciphertext=ciphertext,
                key_nonce=nonce,
            )
            self.db.add(device)

        self.db.commit()
        return lora_key, generated_new_key

    def get_key_by_mac(self, mac_address: bytes) -> bytes:
        if len(mac_address) != 4:
            raise HTTPException(status_code=400, detail="mac_address must be exactly 4 bytes")

        device = self.db.query(DeviceKey).filter(DeviceKey.mac_address == mac_address).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device MAC address not found")

        return self._decrypt_lora_key(mac_address, device.key_ciphertext, device.key_nonce)
