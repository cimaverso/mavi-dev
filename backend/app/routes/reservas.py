# RESERVAS CONTROLLER
# app/routes/reservas.py


from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.reservas import ReservaUpdate, ReservaRead
from app.services.reservas import ReservaServicio

router = APIRouter(
    prefix="/reservas",
    tags=["Reservas"]
)

@router.get("/", response_model=List[ReservaRead])
def listar_reservas(db: Session = Depends(get_db)):
    reserva = ReservaServicio.obtener_reservas(db)
    if not reserva:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron reservas"
        )
    
    return reserva

@router.get("/{rev_id}", response_model=ReservaRead)
def buscar_reserva_id(rev_id: int, db: Session = Depends(get_db)):
    reserva = ReservaServicio.obtener_reserva_id(db, rev_id)
    if not reserva:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron reservas"
        )
    
    return reserva

@router.patch("/{rev_id}", response_model=ReservaRead)
def actualizar_reserva(rev_id: int, rev_data: ReservaUpdate, db: Session = Depends(get_db)):
    reserva = ReservaServicio.actualizar_reserva(db, rev_id, rev_data)
    if not reserva:
        raise HTTPException(
            status_code=400,
            detail="Error al actualizar la reserva"
        )
    
    return reserva