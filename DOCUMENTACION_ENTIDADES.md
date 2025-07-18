# 📋 Documentación de Entidades - Sistema Loracafe

## 🎯 Descripción General
Este documento describe las entidades principales del sistema de gestión de café Loracafe, incluyendo sus atributos, relaciones y funcionalidades.

---

## 👥 Entidades Principales

### 1. **USUARIO** 👤
**Descripción:** Entidad central que maneja todos los usuarios del sistema (clientes, administradores, empleados).

**Atributos:**
- `id` (PK): Identificador único del usuario
- `nombre`: Nombre del usuario
- `apellido`: Apellido del usuario
- `email` (UK): Correo electrónico único
- `password`: Contraseña encriptada
- `telefono`: Número de teléfono
- `direccion`: Dirección de entrega
- `rol` (enum): CLIENTE, ADMIN, EMPLEADO
- `fecha_registro`: Fecha de creación de la cuenta
- `activo`: Estado de la cuenta (true/false)

**Relaciones:**
- Un usuario puede tener muchos pedidos (1:N)
- Un usuario puede tener un carrito con múltiples productos (1:N)

---

### 2. **PRODUCTO** ☕
**Descripción:** Representa todos los productos disponibles en el catálogo (cafés, postres, etc.).

**Atributos:**
- `id` (PK): Identificador único del producto
- `nombre`: Nombre del producto
- `descripcion`: Descripción detallada
- `precio`: Precio unitario
- `categoria`: Categoría del producto
- `imagen_url`: URL de la imagen del producto
- `disponible`: Si está disponible para venta
- `stock`: Cantidad disponible
- `fecha_creacion`: Fecha de creación del producto

**Relaciones:**
- Un producto puede estar en muchos detalles de pedido (1:N)
- Un producto puede estar en el carrito de muchos usuarios (1:N)
- Un producto pertenece a una categoría (N:1)
- Un producto puede tener múltiples promociones (N:M)

---

### 3. **PEDIDO** 📦
**Descripción:** Representa una orden de compra realizada por un cliente.

**Atributos:**
- `id` (PK): Identificador único del pedido
- `usuario_id` (FK): Referencia al usuario que realizó el pedido
- `total`: Monto total del pedido
- `estado` (enum): PENDIENTE, CONFIRMADO, EN_PREPARACION, EN_CAMINO, ENTREGADO, CANCELADO
- `direccion_entrega`: Dirección de entrega
- `fecha_pedido`: Fecha y hora del pedido
- `fecha_entrega`: Fecha y hora de entrega estimada
- `notas`: Notas adicionales del cliente

**Relaciones:**
- Un pedido pertenece a un usuario (N:1)
- Un pedido tiene un pago asociado (1:1)
- Un pedido contiene múltiples detalles (1:N)

---

### 4. **DETALLE_PEDIDO** 📝
**Descripción:** Tabla intermedia que relaciona pedidos con productos y sus cantidades.

**Atributos:**
- `id` (PK): Identificador único del detalle
- `pedido_id` (FK): Referencia al pedido
- `producto_id` (FK): Referencia al producto
- `cantidad`: Cantidad del producto
- `precio_unitario`: Precio por unidad al momento de la compra
- `subtotal`: Subtotal del detalle (cantidad * precio_unitario)

**Relaciones:**
- Un detalle pertenece a un pedido (N:1)
- Un detalle referencia un producto (N:1)

---

### 5. **CARRITO** 🛒
**Descripción:** Carrito de compras temporal de cada usuario.

**Atributos:**
- `id` (PK): Identificador único del item en carrito
- `usuario_id` (FK): Referencia al usuario
- `producto_id` (FK): Referencia al producto
- `cantidad`: Cantidad del producto en el carrito
- `fecha_agregado`: Fecha cuando se agregó al carrito

**Relaciones:**
- Un item del carrito pertenece a un usuario (N:1)
- Un item del carrito referencia un producto (N:1)

---

### 6. **PAGO** 💳
**Descripción:** Información de pago asociada a cada pedido.

**Atributos:**
- `id` (PK): Identificador único del pago
- `pedido_id` (FK): Referencia al pedido
- `monto`: Monto pagado
- `metodo_pago` (enum): EFECTIVO, TARJETA, TRANSFERENCIA, PAYPAL
- `estado` (enum): PENDIENTE, PROCESANDO, COMPLETADO, FALLIDO
- `referencia`: Número de referencia del pago
- `fecha_pago`: Fecha y hora del pago

**Relaciones:**
- Un pago pertenece a un pedido (N:1)

---

### 7. **CATEGORIA** 📂
**Descripción:** Categorías para organizar los productos.

**Atributos:**
- `id` (PK): Identificador único de la categoría
- `nombre`: Nombre de la categoría
- `descripcion`: Descripción de la categoría
- `imagen_url`: URL de la imagen representativa
- `activa`: Si la categoría está activa

**Relaciones:**
- Una categoría puede contener múltiples productos (1:N)

---

### 8. **PROMOCION** 🎉
**Descripción:** Promociones y descuentos aplicables a productos.

**Atributos:**
- `id` (PK): Identificador único de la promoción
- `nombre`: Nombre de la promoción
- `descripcion`: Descripción de la promoción
- `descuento`: Porcentaje o monto de descuento
- `tipo` (enum): PORCENTAJE, MONTO_FIJO, DESCUENTO_2X1
- `fecha_inicio`: Fecha de inicio de la promoción
- `fecha_fin`: Fecha de fin de la promoción
- `activa`: Si la promoción está activa

**Relaciones:**
- Una promoción puede aplicarse a múltiples productos (N:M)

---

### 9. **PRODUCTO_PROMOCION** 🔗
**Descripción:** Tabla intermedia para la relación muchos a muchos entre productos y promociones.

**Atributos:**
- `id` (PK): Identificador único de la relación
- `producto_id` (FK): Referencia al producto
- `promocion_id` (FK): Referencia a la promoción

---

## 🔄 Flujo de Datos Principal

1. **Registro de Usuario** → Se crea un registro en `USUARIO`
2. **Navegación del Catálogo** → Consulta de `PRODUCTO` y `CATEGORIA`
3. **Agregar al Carrito** → Se crea registro en `CARRITO`
4. **Realizar Pedido** → Se crea `PEDIDO` y `DETALLE_PEDIDO`
5. **Procesar Pago** → Se crea registro en `PAGO`
6. **Aplicar Promociones** → Consulta de `PROMOCION` y `PRODUCTO_PROMOCION`

---

## 🛠️ Consideraciones de Implementación

### Enums Sugeridos:

**Rol de Usuario:**
- CLIENTE
- ADMIN
- EMPLEADO

**Estado de Pedido:**
- PENDIENTE
- CONFIRMADO
- EN_PREPARACION
- EN_CAMINO
- ENTREGADO
- CANCELADO

**Método de Pago:**
- EFECTIVO
- TARJETA
- TRANSFERENCIA
- PAYPAL

**Estado de Pago:**
- PENDIENTE
- PROCESANDO
- COMPLETADO
- FALLIDO

**Tipo de Promoción:**
- PORCENTAJE
- MONTO_FIJO
- DESCUENTO_2X1

---

## 📊 Índices Recomendados

```sql
-- Índices para optimizar consultas frecuentes
CREATE INDEX idx_usuario_email ON USUARIO(email);
CREATE INDEX idx_producto_categoria ON PRODUCTO(categoria);
CREATE INDEX idx_pedido_usuario ON PEDIDO(usuario_id);
CREATE INDEX idx_pedido_estado ON PEDIDO(estado);
CREATE INDEX idx_pedido_fecha ON PEDIDO(fecha_pedido);
CREATE INDEX idx_carrito_usuario ON CARRITO(usuario_id);
CREATE INDEX idx_pago_pedido ON PAGO(pedido_id);
```

---

## 🎯 Próximos Pasos

1. **Crear las entidades JPA** en el paquete `model`
2. **Implementar los repositorios** en el paquete `repository`
3. **Desarrollar los controladores** en el paquete `controller`
4. **Configurar la base de datos** en `application.properties`
5. **Implementar la lógica de negocio** en servicios
6. **Crear las vistas** para el frontend

---

*Este diagrama te ayudará a organizar tu proyecto y entender las relaciones entre las diferentes entidades del sistema Loracafe.* 