# 🏦 KinRural API Documentation

![Build Status](https://img.shields.io/badge/build-v1.0.0-brightgreen)
![Node](https://img.shields.io/badge/node-v16+-green)
![Express](https://img.shields.io/badge/express-v5.2.1-blue)
![Sequelize](https://img.shields.io/badge/sequelize-v6.37.7-blue)
![PostgreSQL](https://img.shields.io/badge/postgresql-v8.18.0-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

> Sistema bancario rural de portal de clientes, desplegado con Docker.

---

## 📋 Tabla de Contenidos

- [Instalación y Configuración](#-instalación-y-configuración)
- [Panel Cliente (User API)](#-panel-cliente-user-api)
  - [Perfil](#-perfil)
  - [Mis Cuentas](#-mis-cuentas)
  - [Mis Solicitudes](#-mis-solicitudes)
  - [Beneficiarios](#-beneficiarios)
  - [Tarjetas (Usuario)](#-tarjetas-usuario)
  - [Préstamos (Usuario)](#-préstamos-usuario)
  - [Movimientos](#-movimientos)
  - [Transacciones (Usuario)](#-transacciones-usuario)
- [Reglas de Negocio](#️-reglas-de-negocio)

---

## 🚀 Instalación y Configuración

### 1. Crear carpeta principal

```bash
mkdir kinrural
cd kinrural
```

### 2. Clonar repositorios

```bash
# Servidor Admin
git clone https://github.com/breynerbd/kinRural-server-admin.git kinRural-server-admin

# Servidor User
git clone https://github.com/breynerbd/kinRural-server-user.git kinRural-server-user
```

### 3. Instalar dependencias

**📱 User Service**

```bash
cd ./kinRural-server-user/
npm install
```

**🛠️ Admin Service**

```bash
cd ../kinRural-server-admin/
npm install
```

### 4. Levantar contenedor Docker

```bash
docker compose up --build
```

> ✅ Esto levantará automáticamente:
> - API Admin
> - API User
> - Base de datos
>
> Todo dentro de contenedores Docker.

---

## 📱 Panel Cliente (User API)

**Base URL:**

```
http://localhost:3006/kinrural/v1/user
```

---

### 👤 Perfil

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `GET` | `/users` | Ver mi perfil | User | — |
| `PUT` | `/users` | Actualizar perfil | User | `{ "nombre", "apellido", "telefono", "direccion", "ingresos_mensuales" }` |

**Ejemplo — Actualizar perfil (`PUT /users`):**

```json
{
  "nombre": "Diego",
  "apellido": "Leiva",
  "telefono": "12345678",
  "direccion": "El Naranjo",
  "ingresos_mensuales": 8000
}
```

---

### 💰 Mis Cuentas

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `GET` | `/accounts` | Ver mis cuentas | User | — |

---

### 📩 Mis Solicitudes

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `GET` | `/account-requests` | Ver mis solicitudes | User | — |
| `POST` | `/account-requests` | Solicitar apertura de cuenta | User | `{ "tipo", "dpi", "nombre_completo", "telefono", "correo" }` |

**Ejemplo — Solicitar apertura de cuenta (`POST /account-requests`):**

```json
{
  "tipo": "AHORRO",
  "dpi": "1234567890123",
  "nombre_completo": "Breyner Benitez",
  "telefono": "55551234",
  "correo": "bb@gmail.com"
}
```

> 💡 El campo `tipo` acepta los valores: `AHORRO` o `MONETARIA`.

---

### 👥 Beneficiarios

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `POST` | `/beneficiaries` | Agregar beneficiario | User | `{ "cuenta_id", "alias" }` |
| `GET` | `/beneficiaries` | Listar beneficiarios | User | — |
| `PUT` | `/beneficiaries/:id` | Actualizar beneficiario | User | `{ "alias" }` |
| `DELETE` | `/beneficiaries/:id` | Eliminar beneficiario | User | — |

**Ejemplo — Agregar beneficiario (`POST /beneficiaries`):**

```json
{
  "cuenta_id": 1,
  "alias": "El águila"
}
```

**Ejemplo — Actualizar beneficiario (`PUT /beneficiaries/:id`):**

```json
{
  "alias": "nuevo_alias"
}
```

> 💡 El `alias` debe ser único por usuario y se utiliza para identificar al destinatario en transferencias.

---

### 💳 Tarjetas (Usuario)

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `POST` | `/cards` | Solicitar tarjeta | User | `{ "cuenta_id", "tipo" }` |
| `GET` | `/cards` | Ver mis tarjetas | User | — |

**Ejemplo — Solicitar tarjeta (`POST /cards`):**

```json
{
  "cuenta_id": 1,
  "tipo": "DEBITO"
}
```

> 💡 El campo `tipo` acepta: `DEBITO` o `CREDITO`.

---

### 📝 Préstamos (Usuario)

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `POST` | `/loans/quote` | Simular préstamo | User | `{ "monto", "tasa_interes", "plazo_meses" }` |
| `POST` | `/loans/request` | Solicitar préstamo | User | `{ "user_id", "cuenta_id", "monto", "tasa_interes", "plazo_meses", "tipo_tasa", "meses_recalculo" }` |
| `GET` | `/loans/user/:user_id` | Ver mis préstamos | User | — |

**Ejemplo — Simular préstamo (`POST /loans/quote`):**

```json
{
  "monto": 10000,
  "tasa_interes": 12,
  "plazo_meses": 12
}
```

**Ejemplo — Solicitar préstamo (`POST /loans/request`):**

```json
{
  "user_id": 5,
  "cuenta_id": 1,
  "monto": 5000,
  "tasa_interes": 12,
  "plazo_meses": 12,
  "tipo_tasa": "FIJA",
  "meses_recalculo": null
}
```

> 💡 El campo `tipo_tasa` acepta: `FIJA` o `VARIABLE`. Si es `FIJA`, `meses_recalculo` debe enviarse como `null`.

---

### 💸 Movimientos

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `GET` | `/movements` | Historial de movimientos | User | — |

---

### 💳 Transacciones (Usuario)

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| `POST` | `/transactions` | Depósito | User | `{ "tipo": "DEPOSITO", "monto" }` |
| `POST` | `/transactions` | Retiro | User | `{ "tipo": "RETIRO", "monto" }` |
| `POST` | `/transactions` | Transferencia por alias | User | `{ "tipo": "TRANSFERENCIA", "monto", "alias" }` |
| `POST` | `/transactions` | Transferencia por ID de cuenta | User | `{ "tipo": "TRANSFERENCIA", "monto", "cuenta_destino_id" }` |

**Ejemplo — Depósito (`POST /transactions`):**

```json
{
  "tipo": "DEPOSITO",
  "monto": 100.50
}
```

**Ejemplo — Retiro (`POST /transactions`):**

```json
{
  "tipo": "RETIRO",
  "monto": 50.00
}
```

**Ejemplo — Transferencia por alias (`POST /transactions`):**

```json
{
  "tipo": "TRANSFERENCIA",
  "monto": 150.00,
  "alias": "El águila"
}
```

**Ejemplo — Transferencia por ID de cuenta (`POST /transactions`):**

```json
{
  "tipo": "TRANSFERENCIA",
  "monto": 150.00,
  "cuenta_destino_id": 123
}
```

> 💡 Para transferencias usa **`alias`** o **`cuenta_destino_id`**, nunca ambos a la vez.

---

## ⚙️ Reglas de Negocio

| Regla | Detalle |
|-------|---------|
| 📈 **Interés anual** | 5% sobre cuentas de ahorro |
| ⚠️ **Mora** | Después de 30 días → estado `EN_MORA` + 3% de recargo |
| 🏦 **Límite de cuentas** | Máx. **2 cuentas de ahorro** y **1 monetaria** por usuario |
| 💸 **Transferencias** | Límite de **Q10,000 diarios** |

> ⚠️ **Importante:** El estado `EN_MORA` se activa automáticamente. Ejecute `POST /loans/check-mora` periódicamente para mantener los estados actualizados.

---

*Documentación generada para el proyecto **KinRural** — Sistema Bancario Rural* 🌾
