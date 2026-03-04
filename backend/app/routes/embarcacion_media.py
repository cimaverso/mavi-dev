from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.embarcacion_media import EmbarcacionMediaRead
from app.services.embarcacion_media import EmbarcacionMediaServicio

from typing import List

router = APIRouter(
    prefix="/embarcaciones-media",
    tags=["Embarcaciones Media"]
)


@router.get("/{embarcacion_id}", response_model=List[EmbarcacionMediaRead])
def obtener_media_embarcacion(
    embarcacion_id: int,
    db: Session = Depends(get_db)
):

    return EmbarcacionMediaServicio.obtener_por_embarcacion(
        db,
        embarcacion_id
    )