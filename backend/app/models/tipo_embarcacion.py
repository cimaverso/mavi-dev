# app/models/tipo_embarcacion.py

from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text
from app.db.base import Base

if TYPE_CHECKING:
    from .embarcaciones import Embarcacion


class TipoEmbarcacion(Base):
    __tablename__ = "tipos_embarcacion"

    tp_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    tp_nombre: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False
    )

    tp_descripcion: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    embarcaciones: Mapped[list["Embarcacion"]] = relationship(
        "Embarcacion",
        back_populates="tipo"
    )