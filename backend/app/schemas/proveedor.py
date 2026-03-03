from pydantic import BaseModel


class ProveedorRead(BaseModel):
    prov_id: int
    prov_nombre: str
    prov_telefono: str | None

    class Config:
        from_attributes = True  