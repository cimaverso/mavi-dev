# app/routes/embarcacion.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.embarcacion import (
    EmbarcacionResponse,
    EmbarcacionCreate,
    EmbarcacionUpdate
)
from app.services.embarcacion import EmbarcacionServicio


router = APIRouter(
    prefix="/embarcaciones",
    tags=["Embarcaciones"]
)


@router.get("/", response_model=List[EmbarcacionResponse])
def listar_embarcaciones(db: Session = Depends(get_db)):
    return EmbarcacionServicio.obtener_todos(db)


@router.get("/{embarcacion_id}", response_model=EmbarcacionResponse)
def obtener_embarcacion(
    embarcacion_id: int,
    db: Session = Depends(get_db)
):
    embarcacion = EmbarcacionServicio.obtener_por_id(db, embarcacion_id)

    if not embarcacion:
        raise HTTPException(
            status_code=404,
            detail="Embarcación no encontrada"
        )

    return embarcacion


@router.post("/", response_model=EmbarcacionResponse)
def crear_embarcacion(
    data: EmbarcacionCreate,
    db: Session = Depends(get_db)
):
    return EmbarcacionServicio.crear(db, data)


@router.put("/{embarcacion_id}", response_model=EmbarcacionResponse)
def actualizar_embarcacion(
    embarcacion_id: int,
    data: EmbarcacionUpdate,
    db: Session = Depends(get_db)
):
    embarcacion = EmbarcacionServicio.actualizar(
        db,
        embarcacion_id,
        data
    )

    if not embarcacion:
        raise HTTPException(
            status_code=404,
            detail="Embarcación no encontrada"
        )

    return embarcacion