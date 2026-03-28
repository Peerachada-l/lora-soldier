from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import (
    DeviceKeyProvisionRequest,
    DeviceKeyProvisionResponse,
    DeviceKeyLookupResponse,
)
from services.device_key_service import DeviceKeyService, decode_b64, encode_b64

router = APIRouter(prefix="/device-keys", tags=["Device Keys"])


@router.post("/provision", response_model=DeviceKeyProvisionResponse)
def provision_device_key(payload: DeviceKeyProvisionRequest, db: Session = Depends(get_db)):
    service = DeviceKeyService(db)
    mac_address = decode_b64(payload.mac_address_b64, "mac_address_b64")
    lora_key = decode_b64(payload.lora_key_b64, "lora_key_b64") if payload.lora_key_b64 else None

    final_key, generated_new_key = service.provision_device(
        mac_address=mac_address,
        provided_lora_key=lora_key,
    )

    return DeviceKeyProvisionResponse(
        mac_address_b64=encode_b64(mac_address),
        lora_key_b64=encode_b64(final_key),
        generated_new_key=generated_new_key,
    )


@router.get("/key-by-mac/{mac_address_b64}", response_model=DeviceKeyLookupResponse)
def get_key_by_mac(mac_address_b64: str, db: Session = Depends(get_db)):
    service = DeviceKeyService(db)
    mac_address = decode_b64(mac_address_b64, "mac_address_b64")
    lora_key = service.get_key_by_mac(mac_address)

    return DeviceKeyLookupResponse(
        mac_address_b64=encode_b64(mac_address),
        lora_key_b64=encode_b64(lora_key),
    )
