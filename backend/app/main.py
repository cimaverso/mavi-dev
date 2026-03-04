from fastapi import FastAPI

import app.models.proveedores
import app.models.embarcaciones
import app.models.embarcacion_media
import app.models.reservas
import app.models.tipo_embarcacion
import app.models.usuarios

from app.routes import proveedor, embarcacion
from app.db.base import Base
from app.core.db import engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(proveedor.router)
app.include_router(embarcacion.router)