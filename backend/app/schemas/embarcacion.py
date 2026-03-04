# app/schemas/embarcacion.py

from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, ConfigDict




class EmbarcacionBase(BaseModel):
    emb_nombre: str
    emb_idtipo: Optional[int] = None
    emb_idproveedor: Optional[int] = None
    emb_capacidad: int
    emb_valorproveedor: Optional[Decimal] = None
    emb_valorclientefinal: Optional[Decimal] = None
    emb_caracteristicas: Optional[str] = None


class EmbarcacionCreate(EmbarcacionBase):
    pass


class EmbarcacionUpdate(BaseModel):
    emb_nombre: Optional[str] = None
    emb_idtipo: Optional[int] = None
    emb_idproveedor: Optional[int] = None
    emb_capacidad: Optional[int] = None
    emb_valorproveedor: Optional[Decimal] = None
    emb_valorclientefinal: Optional[Decimal] = None
    emb_caracteristicas: Optional[str] = None


class EmbarcacionResponse(EmbarcacionBase):
    emb_id: int

    model_config = ConfigDict(from_attributes=True)