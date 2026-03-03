# app/models/usuario.py

from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String
from app.db.base import Base

if TYPE_CHECKING:
    from .reservas import Reserva


class Usuario(Base):
    __tablename__ = "usuarios"

    usu_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    usu_nombre: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    usu_telefono: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    reservas: Mapped[list["Reserva"]] = relationship(
        "Reserva",
        back_populates="usuario"
    )