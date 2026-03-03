# app/models/embarcacion_media.py

from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey
from app.db.base import Base

if TYPE_CHECKING:
    from .embarcaciones import Embarcacion


class EmbarcacionMedia(Base):
    __tablename__ = "embarcacion_media"

    embmed_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    embmed_idembarcacion: Mapped[int] = mapped_column(
        ForeignKey("embarcaciones.emb_id"),
        nullable=False
    )

    embmed_path: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    embarcacion: Mapped["Embarcacion"] = relationship(
        "Embarcacion",          # 👈 importante usar string aquí también
        back_populates="media"
    )