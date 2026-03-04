# app/routes/proveedor_routes.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.proveedor import ProveedorRead, ProveedorCreate, ProveedorUpdate
from app.services.proveedor import ProveedorServicio

router = APIRouter(
    prefix="/proveedores",
    tags=["Proveedores"]
)


@router.get("/", response_model=List[ProveedorRead])
def listar_proveedores(db: Session = Depends(get_db)):
    return ProveedorServicio.obtener_todos(db)


@router.get("/{proveedor_id}", response_model=ProveedorRead)
def obtener_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    proveedor = ProveedorServicio.obtener_por_id(db, proveedor_id)

    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    return proveedor

@router.post("/", response_model=ProveedorRead)
def crear_proveedor(proveedor: ProveedorCreate, db: Session = Depends(get_db)):
    proveedor = ProveedorServicio.crear(db, proveedor)
    if not proveedor:
       raise HTTPException(
          status_code=400,
          detail="Error al registrar proveedor"
       )
    
    return proveedor

@router.patch("/{proverdor_id}", response_model=ProveedorRead)
def actualizar_proveedor(prov_id: int, proveedor: ProveedorUpdate, db: Session = Depends(get_db)):
    proveedor = ProveedorServicio.actualizar_proveedor(db, prov_id, proveedor)
    if not proveedor:
        raise HTTPException(
            status_code=400,
            detail="Error actualizando la información del proveedor"
        )
    return proveedor