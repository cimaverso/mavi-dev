# app/schemas/reservas.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.schemas.embarcacion import EmbarcacionResponse

class ReservaBase(BaseModel):
    rev_estado: Optional[str] = None
    rev_fechareserva: Optional[date] = None
    rev_resuelto: Optional[bool] = None

class ReservaUpdate(ReservaBase):
    pass

class ReservaRead(ReservaBase):
    rev_id: int
    rev_idembarcacion: Optional[int] = None
    rev_idusuario: Optional[int] = None
    rev_fecharegistro: datetime

    class Config:
        from_attributes = True  
    