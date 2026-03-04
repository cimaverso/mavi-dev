# app/services/embarcacion.py

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.embarcaciones import Embarcacion


class EmbarcacionServicio:

    @staticmethod
    def obtener_todos(db: Session) -> List[Embarcacion]:
        stmt = (
            select(Embarcacion)
            .options(
                selectinload(Embarcacion.tipo),
                selectinload(Embarcacion.proveedor),
                selectinload(Embarcacion.media),
                selectinload(Embarcacion.reservas),
            )
        )

        resultado = db.execute(stmt)
        return resultado.scalars().all()

    @staticmethod
    def obtener_por_id(
        db: Session,
        embarcacion_id: int
    ) -> Optional[Embarcacion]:

        stmt = (
            select(Embarcacion)
            .where(Embarcacion.emb_id == embarcacion_id)
            .options(
                selectinload(Embarcacion.tipo),
                selectinload(Embarcacion.proveedor),
                selectinload(Embarcacion.media),
                selectinload(Embarcacion.reservas),
            )
        )

        resultado = db.execute(stmt)
        return resultado.scalars().first()

    @staticmethod
    def crear(
        db: Session,
        embarcacion: Embarcacion
    ) -> Embarcacion:

        db.add(embarcacion)
        db.commit()
        db.refresh(embarcacion)
        return embarcacion

    @staticmethod
    def eliminar(
        db: Session,
        embarcacion_id: int
    ) -> bool:

        embarcacion = db.get(Embarcacion, embarcacion_id)

        if not embarcacion:
            return False

        db.delete(embarcacion)
        db.commit()
        return True