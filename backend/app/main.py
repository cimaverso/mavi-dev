from fastapi import FastAPI

# 👇 IMPORTACIÓN EXPLÍCITA
import app.models.proveedores
import app.models.embarcaciones
import app.models.embarcacion_media
import app.models.reservas
import app.models.tipo_embarcacion
import app.models.usuarios

from app.routes import proveedor
from app.db.base import Base
from app.core.db import engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(proveedor.router)