from sqlalchemy.orm import Session
from app.models.embarcacion_media import EmbarcacionMedia


class EmbarcacionMediaServicio:

    @staticmethod
    def obtener_por_embarcacion(db: Session, embarcacion_id: int):

        media = (
            db.query(EmbarcacionMedia)
            .filter(
                EmbarcacionMedia.embmed_idembarcacion == embarcacion_id
            )
            .all()
        )

        return media