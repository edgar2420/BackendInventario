# 📦 Inventario ABD — Sistema de Gestión de Componentes

Este proyecto es una aplicación completa (backend + frontend) para la gestión de componentes en un entorno industrial o de laboratorio. Permite registrar, editar y controlar información clave como clase, tipo, modelo, fabricante, cantidad, y unidad de proceso.

---

## 🚀 Tecnologías Utilizadas

### Backend:
- **Node.js + Express**
- **Supabase (PostgreSQL + Storage)**
- **Sequelize ORM**
- **Autenticación con JWT**

### Frontend:
- **React + Vite**
- **React Router DOM**
- **React Select**
- **React Toastify**
- **Lucide React Icons**
- **CSS personalizado + Tailwind parcial (estilo limpio y responsivo)**

---

## 🔧 Funcionalidades

- ✅ CRUD completo de componentes.
- ✅ Registro de clases, tipos y unidades de proceso.
- ✅ Carga de imágenes a Supabase Storage.
- ✅ Movimientos de entrada/salida (próximamente).
- ✅ Filtros dinámicos por nombre, código, clase, etc.
- ✅ Exportación y visualización optimizada.
- ✅ Diseño responsive y layout con sidebar.

---

## 📁 Estructura del Repositorio

```
📦 inventario-abd
 ┣ 📁 backend
 ┃ ┣ routes/
 ┃ ┣ controllers/
 ┃ ┣ services/
 ┃ ┗ app.js
 ┣ 📁 frontend
 ┃ ┣ src/
 ┃ ┃ ┣ components/
 ┃ ┃ ┣ services/
 ┃ ┃ ┣ styles/
 ┃ ┃ ┗ App.jsx
 ┗ README.md
```

---

## 🧪 Cómo correr el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/tuusuario/inventario-abd.git
cd inventario-abd
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Notas
- Puedes crear tu propio proyecto en [Supabase](https://supabase.io/) y configurar las variables en `.env`.
- El sistema está optimizado para escalar e incluir nuevas entidades como órdenes de trabajo o reportes.

---

## ✨ Autor
**Inventario ABD** desarrollado por Edgar Andres Rojas Apaza.
