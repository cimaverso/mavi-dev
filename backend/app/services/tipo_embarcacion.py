# app/services/tipo_embarcacion.py

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tipo_embarcacion import TipoEmbarcacion


class TipoEmbarcacionServicio:

    @staticmethod
    def obtener_todos(db: Session) -> List[TipoEmbarcacion]:
        stmt = select(TipoEmbarcacion)
        resultado = db.execute(stmt)
        return resultado.scalars().all()

    @staticmethod
    def obtener_por_id(
        db: Session,
        tipo_id: int
    ) -> Optional[TipoEmbarcacion]:

        stmt = select(TipoEmbarcacion).where(
            TipoEmbarcacion.tp_id == tipo_id
        )

        resultado = db.execute(stmt)
        return resultado.scalars().first()

    @staticmethod
    def crear(
        db: Session,
        tipo: TipoEmbarcacion
    ) -> TipoEmbarcacion:

        db.add(tipo)
        db.commit()
        db.refresh(tipo)
        return tipo

    @staticmethod
    def actualizar(
        db: Session,
        tipo_id: int,
        data: dict
    ) -> Optional[TipoEmbarcacion]:

        tipo = db.get(TipoEmbarcacion, tipo_id)

        if not tipo:
            return None

        for key, value in data.items():
            setattr(tipo, key, value)

        db.commit()
        db.refresh(tipo)
        return tipo

    @staticmethod
    def eliminar(
        db: Session,
        tipo_id: int
    ) -> bool:

        tipo = db.get(TipoEmbarcacion, tipo_id)

        if not tipo:
            return False

        db.delete(tipo)
        db.commit()

        return True