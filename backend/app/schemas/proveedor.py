from pydantic import BaseModel
from typing import Optional


class ProveedorBase(BaseModel):
    prov_nombre: str
    prov_telefono: Optional[str] = None

class ProveedorRead(ProveedorBase):
    prov_id: int

class ProveedorCreate(ProveedorBase):
    pass

class ProveedorUpdate(BaseModel):
    prov_nombre: Optional[str] = None
    prov_telefono: Optional[str] = None

    class Config:
        from_attributes = True  