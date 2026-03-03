# app/models/proveedor.py

from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String
from app.db.base import Base

if TYPE_CHECKING:
    from .embarcaciones import Embarcacion


class Proveedor(Base):
    __tablename__ = "proveedores"

    prov_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    prov_nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    prov_telefono: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    embarcaciones: Mapped[list["Embarcacion"]] = relationship(
        "Embarcacion",
        back_populates="proveedor",
        cascade="all, delete-orphan"
    )