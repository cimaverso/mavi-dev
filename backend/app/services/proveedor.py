# app/services/proveedor.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.proveedores import Proveedor


class ProveedorServicio:

    @staticmethod
    def obtener_todos(db: Session) -> List[Proveedor]:
        stmt = select(Proveedor)
        resultado = db.execute(stmt)
        return resultado.scalars().all()

    @staticmethod
    def obtener_por_id(db: Session, proveedor_id: int) -> Optional[Proveedor]:
        return db.get(Proveedor, proveedor_id)

    @staticmethod
    def crear(db: Session, proveedor: Proveedor) -> Proveedor:
        db.add(proveedor)
        db.commit()
        db.refresh(proveedor)
        return proveedor

    @staticmethod
    def eliminar(db: Session, proveedor_id: int) -> bool:
        proveedor = db.get(Proveedor, proveedor_id)

        if not proveedor:
            return False

        db.delete(proveedor)
        db.commit()
        return True