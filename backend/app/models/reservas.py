# app/models/reserva.py

from typing import TYPE_CHECKING
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, Date, DateTime, Boolean
from app.db.base import Base

if TYPE_CHECKING:
    from .embarcaciones import Embarcacion
    from .usuarios import Usuario


class Reserva(Base):
    __tablename__ = "reservas"

    rev_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    rev_idembarcacion: Mapped[int | None] = mapped_column(
        ForeignKey("embarcaciones.emb_id"),
        nullable=True
    )

    rev_idusuario: Mapped[int | None] = mapped_column(
        ForeignKey("usuarios.usu_id"),
        nullable=True
    )

    rev_estado: Mapped[str | None] = mapped_column(
        String(50),
        default="PENDIENTE"
    )

    rev_fechareserva: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    rev_fecharegistro: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    rev_resuelto: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    embarcacion: Mapped["Embarcacion"] = relationship(
        "Embarcacion",
        back_populates="reservas"
    )

    usuario: Mapped["Usuario"] = relationship(
        "Usuario",
        back_populates="reservas"
    )