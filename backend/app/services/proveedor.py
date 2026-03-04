# app/services/proveedor.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.proveedores import Proveedor
from app.schemas.proveedor import ProveedorUpdate, ProveedorCreate


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
    def crear(db: Session, proveedor: ProveedorCreate) -> Proveedor:

        nuevo_proveedor = Proveedor(
            prov_nombre=proveedor.prov_nombre,
            prov_telefono=proveedor.prov_telefono
        )
        db.add(nuevo_proveedor)
        db.commit()
        db.refresh(nuevo_proveedor)
        return nuevo_proveedor
    
    @staticmethod
    def actualizar_proveedor(db: Session, prov_id:int, prov_data: ProveedorUpdate):
        proveedor_encontrado = ProveedorServicio.obtener_por_id(db, prov_id)
        if not proveedor_encontrado:
            None

        if prov_data.prov_nombre is not None:
            proveedor_encontrado.prov_nombre = prov_data.prov_nombre
        
        if prov_data.prov_telefono is not None:
            proveedor_encontrado.prov_telefono = prov_data.prov_telefono
        
        db.commit()
        db.refresh(proveedor_encontrado)

        return proveedor_encontrado

    @staticmethod
    def eliminar(db: Session, proveedor_id: int) -> bool:
        proveedor = db.get(Proveedor, proveedor_id)

        if not proveedor:
            return False

        db.delete(proveedor)
        db.commit()
        return True