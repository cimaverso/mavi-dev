# SERVICIO RESERVAS
# app/services/reservas.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.reservas import Reserva
from app.schemas.reservas import ReservaBase, ReservaRead

class ReservaServicio:

    @staticmethod
    def obtener_reservas(db: Session) -> List[Reserva]:
        stmt = select(Reserva)
        resultado = db.execute(stmt)
        return resultado.scalars().all()
    
    @staticmethod
    def obtener_reserva_id(db: Session, rev_id: int) -> Optional[Reserva]:
        stmt = select(Reserva).where(Reserva.rev_id == rev_id)
        resultado = db.execute(stmt)
        return resultado.scalar_one_or_none()

    @staticmethod
    def actualizar_reserva(db: Session, rev_id: int, rev_data: ReservaBase) -> Reserva:
        res_found = ReservaServicio.obtener_reserva_id(db, rev_id)
        if not res_found:
            return None
        
        datos_actualizar = rev_data.model_dump(exclude_unset=True)
        for key, value in datos_actualizar.items():
            setattr(res_found, key, value)

        db.commit()
        db.refresh(res_found)

        return res_found

