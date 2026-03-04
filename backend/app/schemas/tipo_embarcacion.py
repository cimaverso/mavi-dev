# app/schemas/tipo_embarcacion.py

from typing import Optional
from pydantic import BaseModel


class TipoEmbarcacionBase(BaseModel):
    tp_nombre: str
    tp_descripcion: Optional[str] = None


class TipoEmbarcacionCreate(TipoEmbarcacionBase):
    pass


class TipoEmbarcacionUpdate(BaseModel):
    tp_nombre: Optional[str] = None
    tp_descripcion: Optional[str] = None


class TipoEmbarcacionResponse(TipoEmbarcacionBase):
    tp_id: int

    class Config:
        from_attributes = True