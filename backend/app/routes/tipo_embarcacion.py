# app/routes/tipo_embarcacion.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.tipo_embarcacion import (
    TipoEmbarcacionCreate,
    TipoEmbarcacionResponse,
    TipoEmbarcacionUpdate
)
from app.models.tipo_embarcacion import TipoEmbarcacion
from app.services.tipo_embarcacion import TipoEmbarcacionServicio


router = APIRouter(
    prefix="/tipos_embarcacion",
    tags=["Tipos Embarcación"]
)


@router.get("/", response_model=List[TipoEmbarcacionResponse])
def listar_tipos(db: Session = Depends(get_db)):
    return TipoEmbarcacionServicio.obtener_todos(db)


@router.get("/{tipo_id}", response_model=TipoEmbarcacionResponse)
def obtener_tipo(tipo_id: int, db: Session = Depends(get_db)):

    tipo = TipoEmbarcacionServicio.obtener_por_id(db, tipo_id)

    if not tipo:
        raise HTTPException(
            status_code=404,
            detail="Tipo de embarcación no encontrado"
        )

    return tipo


@router.post("/", response_model=TipoEmbarcacionResponse)
def crear_tipo(
    data: TipoEmbarcacionCreate,
    db: Session = Depends(get_db)
):

    tipo = TipoEmbarcacion(**data.model_dump())

    return TipoEmbarcacionServicio.crear(db, tipo)


@router.patch("/{tipo_id}", response_model=TipoEmbarcacionResponse)
def actualizar_tipo(
    tipo_id: int,
    data: TipoEmbarcacionUpdate,
    db: Session = Depends(get_db)
):

    tipo = TipoEmbarcacionServicio.actualizar(
        db,
        tipo_id,
        data.model_dump(exclude_unset=True)
    )

    if not tipo:
        raise HTTPException(
            status_code=404,
            detail="Tipo no encontrado"
        )

    return tipo


