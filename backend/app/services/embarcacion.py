# app/services/embarcacion.py

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.embarcaciones import Embarcacion
from app.schemas.embarcacion import EmbarcacionCreate, EmbarcacionUpdate


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
        data: EmbarcacionCreate
    ) -> Embarcacion:

        nueva = Embarcacion(**data.model_dump())

        db.add(nueva)
        db.commit()
        db.refresh(nueva)

        return nueva

    @staticmethod
    def actualizar(
        db: Session,
        embarcacion_id: int,
        data: EmbarcacionUpdate
    ) -> Optional[Embarcacion]:

        embarcacion = db.get(Embarcacion, embarcacion_id)

        if not embarcacion:
            return None

        datos = data.model_dump(exclude_unset=True)

        for key, value in datos.items():
            setattr(embarcacion, key, value)

        db.commit()
        db.refresh(embarcacion)

        return embarcacion