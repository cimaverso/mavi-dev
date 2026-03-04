# Contrato de API REST - Panel Administrativo Cimaverso

## Información General

**Base URL:** `http://localhost:8000` (desarrollo) / `https://api.cimaverso.com` (producción)

**Formato de respuestas:** JSON

**Autenticación:** JWT Token en header `Authorization: Bearer {token}`

**CORS:** Permitir origen del frontend

---

## Estructura de Respuesta Estándar

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... }
}
```

### Respuesta con Error
```json
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

---

## 1. AUTENTICACIÓN

### POST /api/auth/login

**Descripción:** Autenticar usuario y obtener token JWT

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Validaciones:**
- `username`: requerido, min 3 caracteres
- `password`: requerido, min 6 caracteres

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "nombre": "Juan Pérez"
    }
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "error": {
    "message": "Credenciales inválidas",
    "code": "INVALID_CREDENTIALS"
  }
}
```

**IMPORTANTE:** 
- NO enviar campos sensibles como `conversationid`
- Token debe tener expiración (recomendado: 24 horas)

---

## 2. EMBARCACIONES

### GET /api/embarcaciones

**Descripción:** Obtener listado completo de embarcaciones con relaciones

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Yacht Luxury",
      "tipo": {
        "id": 1,
        "nombre": "Yate"
      },
      "proveedor": {
        "id": 1,
        "nombre": "Proveedor Premium"
      },
      "capacidad": 12,
      "valorProveedor": 5000.00,
      "valorCliente": 7000.00,
      "caracteristicas": "Texto largo con características...",
      "media": [
        {
          "id": 1,
          "path": "https://storage.supabase.co/..."
        }
      ]
    }
  ]
}
```

**Mapeo de campos BD → API:**
- `emb_id` → `id`
- `emb_nombre` → `nombre`
- `emb_idtipo` → `tipo.id` (expandir objeto)
- `emb_idproveedor` → `proveedor.id` (expandir objeto)
- `emb_capacidad` → `capacidad`
- `emb_valorproveedor` → `valorProveedor`
- `emb_valorclientefinal` → `valorCliente`
- `emb_caracteristicas` → `caracteristicas`

---

### POST /api/embarcaciones

**Descripción:** Crear nueva embarcación

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "nombre": "Catamarán Paradise",
  "idTipo": 2,
  "idProveedor": 1,
  "capacidad": 20,
  "valorProveedor": 8000.00,
  "valorCliente": 12000.00,
  "caracteristicas": "Descripción completa..."
}
```

**Validaciones:**
- `nombre`: requerido, max 200 caracteres, único
- `idTipo`: requerido, debe existir en tabla `tipos_embarcacion`
- `idProveedor`: requerido, debe existir en tabla `proveedores`
- `capacidad`: requerido, entero, min 1, max 999
- `valorProveedor`: requerido, decimal, min 0
- `valorCliente`: requerido, decimal, min 0, debe ser >= valorProveedor
- `caracteristicas`: opcional, texto largo

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "nombre": "Catamarán Paradise",
    ...
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": {
    "message": "Datos inválidos",
    "code": "VALIDATION_ERROR",
    "details": {
      "nombre": ["Este nombre ya existe"],
      "capacidad": ["Debe ser mayor a 0"]
    }
  }
}
```

---

### PATCH /api/embarcaciones/{id}

**Descripción:** Actualizar campos específicos de una embarcación (para autosave)

**Headers:** `Authorization: Bearer {token}`

**Request Body (parcial):**
```json
{
  "nombre": "Nuevo nombre"
}
```

O:
```json
{
  "capacidad": 15,
  "valorCliente": 8500.00
}
```

**Validaciones:** Las mismas que POST, pero solo para campos enviados

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Nuevo nombre",
    ...
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": {
    "message": "Embarcación no encontrada",
    "code": "NOT_FOUND"
  }
}
```

---

### DELETE /api/embarcaciones/{id}

**Descripción:** Eliminar embarcación

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Embarcación eliminada correctamente"
}
```

**Response 400 (si tiene reservas activas):**
```json
{
  "success": false,
  "error": {
    "message": "No se puede eliminar: tiene reservas asociadas",
    "code": "HAS_DEPENDENCIES"
  }
}
```

---

### POST /api/embarcaciones/{id}/media

**Descripción:** Subir fotos/videos para una embarcación

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```
files: File[]  // Array de archivos (imágenes o videos)
```

**Validaciones:**
- Máximo 10 archivos por request
- Tipos permitidos: jpg, jpeg, png, webp, mp4, mov
- Tamaño máximo por archivo: 10MB

**Proceso Backend:**
1. Validar archivos
2. Subir a Supabase Storage
3. Guardar paths en tabla `embarcacion_media`
4. Retornar URLs públicas

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "path": "https://storage.supabase.co/bucket/embarcaciones/uuid-imagen.jpg"
    },
    {
      "id": 11,
      "path": "https://storage.supabase.co/bucket/embarcaciones/uuid-video.mp4"
    }
  ]
}
```

**IMPORTANTE:**
- El campo `path` debe contener la URL pública completa, no solo el path relativo
- Usar UUIDs para nombres de archivo para evitar colisiones

---

### DELETE /api/embarcaciones/media/{mediaId}

**Descripción:** Eliminar un archivo multimedia

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Archivo eliminado correctamente"
}
```

**Proceso Backend:**
1. Buscar registro en `embarcacion_media`
2. Eliminar archivo de Supabase Storage
3. Eliminar registro de BD

---

## 3. TIPOS DE EMBARCACIÓN

### GET /api/tipos-embarcacion

**Descripción:** Obtener todos los tipos de embarcación

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Yate",
      "descripcion": "Embarcación de lujo..."
    },
    {
      "id": 2,
      "nombre": "Catamarán",
      "descripcion": null
    }
  ]
}
```

**Mapeo BD → API:**
- `tp_id` → `id`
- `tp_nombre` → `nombre`
- `tp_descripcion` → `descripcion`

---

### POST /api/tipos-embarcacion

**Descripción:** Crear nuevo tipo de embarcación (desde el select "+ Agregar tipo")

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "nombre": "Velero",
  "descripcion": "Embarcación a vela..."
}
```

**Validaciones:**
- `nombre`: requerido, max 100 caracteres, único (case-insensitive)
- `descripcion`: opcional, texto largo

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "nombre": "Velero",
    "descripcion": "Embarcación a vela..."
  }
}
```

**Response 409 (conflicto):**
```json
{
  "success": false,
  "error": {
    "message": "Este tipo de embarcación ya existe",
    "code": "DUPLICATE_ENTRY"
  }
}
```

---

## 4. PROVEEDORES

### GET /api/proveedores

**Descripción:** Obtener todos los proveedores

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Proveedor Premium",
      "telefono": "+573001234567"
    }
  ]
}
```

**IMPORTANTE:** NO enviar campo `prov_conversationid`

**Mapeo BD → API:**
- `prov_id` → `id`
- `prov_nombre` → `nombre`
- `prov_telefono` → `telefono`
- `prov_conversationid` → NO ENVIAR

---

### POST /api/proveedores

**Request Body:**
```json
{
  "nombre": "Nuevo Proveedor",
  "telefono": "+573009876543"
}
```

**Validaciones:**
- `nombre`: requerido, max 200 caracteres
- `telefono`: opcional, formato internacional recomendado

**Response 201:** Igual estructura que GET

---

### PATCH /api/proveedores/{id}

**Request Body (parcial):**
```json
{
  "telefono": "+573001111111"
}
```

**Response 200:** Objeto actualizado

---

### DELETE /api/proveedores/{id}

**Response 200:**
```json
{
  "success": true,
  "message": "Proveedor eliminado correctamente"
}
```

**Response 400 (si tiene embarcaciones asociadas):**
```json
{
  "success": false,
  "error": {
    "message": "No se puede eliminar: tiene embarcaciones asociadas",
    "code": "HAS_DEPENDENCIES"
  }
}
```

---

## 5. SERVICIOS

### GET /api/servicios

**Descripción:** Obtener todos los servicios

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Catering Premium",
      "precio": 2500.00
    }
  ]
}
```

**Mapeo BD → API:**
- `serv_id` → `id`
- `serv_nombre` → `nombre`
- `serv_precio` → `precio`

---

### POST /api/servicios

**Request Body:**
```json
{
  "nombre": "Fotografía Profesional",
  "precio": 1500.00
}
```

**Validaciones:**
- `nombre`: requerido, max 200 caracteres, único
- `precio`: requerido, decimal, min 0

**Response 201:** Objeto creado

---

### PATCH /api/servicios/{id}

**Request Body (parcial):**
```json
{
  "precio": 1800.00
}
```

---

### DELETE /api/servicios/{id}

**Response 200:** Mensaje de éxito

---

## 6. RESERVAS

### GET /api/reservas

**Descripción:** Obtener reservas con filtro opcional por mes

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `month` (opcional): formato `YYYY-MM` (ejemplo: `2026-02`)
- `estado` (opcional): `PENDIENTE | CONFIRMADA | CANCELADA`

**Ejemplo:** `/api/reservas?month=2026-02&estado=PENDIENTE`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "embarcacion": {
        "id": 1,
        "nombre": "Yacht Luxury"
      },
      "usuario": {
        "id": 5,
        "nombre": "Cliente Ejemplo"
      },
      "fechaReserva": "2026-02-15",
      "estado": "PENDIENTE",
      "resuelto": false,
      "fechaRegistro": "2026-02-01T10:30:00"
    }
  ]
}
```

**Mapeo BD → API:**
- `rev_id` → `id`
- `rev_idembarcacion` → `embarcacion.id` (expandir con JOIN)
- `rev_idusuario` → `usuario.id` (expandir con JOIN, solo id y nombre)
- `rev_fechareserva` → `fechaReserva`
- `rev_estado` → `estado`
- `rev_resuelto` → `resuelto`
- `rev_fecharegistro` → `fechaRegistro`

**IMPORTANTE:** NO enviar `usu_conversationid` en el objeto usuario

---

### POST /api/reservas

**Descripción:** Crear nueva reserva (normalmente esto lo hace el agente, pero permitimos creación manual)

**Request Body:**
```json
{
  "idEmbarcacion": 1,
  "idUsuario": 5,
  "fechaReserva": "2026-03-20",
  "estado": "PENDIENTE"
}
```

**Validaciones:**
- `idEmbarcacion`: requerido, debe existir
- `idUsuario`: requerido, debe existir
- `fechaReserva`: requerido, formato ISO `YYYY-MM-DD`, no puede ser fecha pasada
- `estado`: opcional, default `PENDIENTE`, valores: `PENDIENTE | CONFIRMADA | CANCELADA`

**Response 201:** Objeto creado con relaciones expandidas

---

### PATCH /api/reservas/{id}

**Descripción:** Actualizar estado o marcar como resuelta

**Request Body:**
```json
{
  "estado": "CONFIRMADA"
}
```

O:
```json
{
  "resuelto": true
}
```

**Validaciones:**
- `estado`: opcional, debe ser uno de: `PENDIENTE | CONFIRMADA | CANCELADA`
- `resuelto`: opcional, boolean

**Response 200:** Objeto actualizado

---

## 7. MÉTRICAS

### GET /api/metrics/embarcaciones

**Descripción:** Obtener métricas de embarcaciones

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "porTipo": [
      {
        "tipo": "Yate",
        "cantidad": 10
      },
      {
        "tipo": "Catamarán",
        "cantidad": 15
      }
    ]
  }
}
```

**Implementación recomendada:**
```sql
SELECT 
  COUNT(*) as total,
  tp.tp_nombre as tipo,
  COUNT(e.emb_id) as cantidad
FROM embarcaciones e
LEFT JOIN tipos_embarcacion tp ON e.emb_idtipo = tp.tp_id
GROUP BY tp.tp_nombre
```

---

### GET /api/metrics/proveedores

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total": 8
  }
}
```

---

### GET /api/metrics/servicios

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total": 12
  }
}
```

---

## 8. SOPORTE (TICKETS)

### POST /api/support/tickets

**Descripción:** Enviar ticket de soporte (genera email a soporte@cimaverso.com)

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```
asunto: string
categoria: string  // "Técnico" | "Información" | "Reclamo"
descripcion: string
adjunto: File (opcional)
```

**Validaciones:**
- `asunto`: requerido, max 200 caracteres
- `categoria`: requerido, debe ser una de las tres opciones
- `descripcion`: requerido, min 10 caracteres
- `adjunto`: opcional, max 5MB, tipos: pdf, jpg, png, docx

**Response 200:**
```json
{
  "success": true,
  "message": "Ticket enviado correctamente. Recibirás respuesta en las próximas 24 horas."
}
```

**Implementación Backend:**
1. Validar datos
2. Si hay adjunto, subirlo a storage temporal
3. Enviar email a `soporte@cimaverso.com` con:
   - Asunto del ticket
   - Categoría
   - Descripción
   - Adjunto (si existe)
   - Datos del usuario que envió (nombre, email si está disponible)
4. Opcionalmente guardar en BD para tracking

---

## 9. CÓDIGOS DE ERROR ESTÁNDAR

| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `INVALID_CREDENTIALS` | Usuario/contraseña incorrectos | 401 |
| `TOKEN_EXPIRED` | Token JWT expirado | 401 |
| `TOKEN_INVALID` | Token JWT inválido | 401 |
| `UNAUTHORIZED` | Sin permisos | 403 |
| `NOT_FOUND` | Recurso no encontrado | 404 |
| `VALIDATION_ERROR` | Error de validación | 400 |
| `DUPLICATE_ENTRY` | Entrada duplicada | 409 |
| `HAS_DEPENDENCIES` | No se puede eliminar por dependencias | 400 |
| `INTERNAL_ERROR` | Error interno del servidor | 500 |

---

## 10. HEADERS REQUERIDOS

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Response Headers:**
```
Content-Type: application/json
Access-Control-Allow-Origin: {frontend_url}
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 11. CONSIDERACIONES DE SEGURIDAD

1. **Nunca exponer campos sensibles:**
   - `conversationid` de usuarios
   - `conversationid` de proveedores
   - Cualquier campo de tabla `n8n_chat_histories`

2. **Validar autenticación en TODOS los endpoints** excepto `/api/auth/login`

3. **Sanitizar inputs** para prevenir SQL injection (usar ORM con parámetros)

4. **Rate limiting:** Considerar límite de 100 requests/minuto por usuario

5. **CORS:** Configurar correctamente el origen del frontend

6. **Passwords:** Hashear con bcrypt (mínimo 10 rounds)

7. **JWT:** 
   - Expiración de 24 horas
   - Incluir solo `user_id` y `username` en payload
   - Firmar con secret fuerte

---

## 12. TESTING RECOMENDADO

Para cada endpoint, probar:

1. Caso exitoso (200/201)
2. Sin autenticación (401)
3. Datos inválidos (400)
4. Recurso no encontrado (404)
5. Duplicado (409 donde aplique)
6. Dependencias (400 en DELETE)

---

## 13. HERRAMIENTAS RECOMENDADAS

- **Pydantic:** Para validación de datos
- **SQLAlchemy:** ORM para PostgreSQL
- **python-jose:** Para manejo de JWT
- **bcrypt:** Para hasheo de passwords
- **python-multipart:** Para uploads de archivos
- **CORS Middleware:** Incluido en FastAPI

---

## CONTACTO

Para dudas sobre el contrato de API:
- Frontend Developer: [Tu nombre]
- Fecha última actualización: 2026-02-01