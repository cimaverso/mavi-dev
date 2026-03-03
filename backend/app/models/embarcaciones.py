# app/models/embarcacion.py

from typing import TYPE_CHECKING
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, Numeric, Text
from app.db.base import Base

if TYPE_CHECKING:
    from .tipo_embarcacion import TipoEmbarcacion
    from .proveedores import Proveedor
    from .embarcacion_media import EmbarcacionMedia
    from .reservas import Reserva


class Embarcacion(Base):
    __tablename__ = "embarcaciones"

    emb_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    emb_nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    emb_idtipo: Mapped[int | None] = mapped_column(
        ForeignKey("tipos_embarcacion.tp_id"),
        nullable=True
    )

    emb_idproveedor: Mapped[int | None] = mapped_column(
        ForeignKey("proveedores.prov_id"),
        nullable=True
    )

    emb_capacidad: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    emb_valorproveedor: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    emb_valorclientefinal: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    emb_caracteristicas: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # Relaciones
    tipo: Mapped["TipoEmbarcacion"] = relationship(
        "TipoEmbarcacion",
        back_populates="embarcaciones"
    )

    proveedor: Mapped["Proveedor"] = relationship(
        "Proveedor",
        back_populates="embarcaciones"
    )

    media: Mapped[list["EmbarcacionMedia"]] = relationship(
        "EmbarcacionMedia",
        back_populates="embarcacion",
        cascade="all, delete-orphan"
    )

    reservas: Mapped[list["Reserva"]] = relationship(
        "Reserva",
        back_populates="embarcacion"
    )