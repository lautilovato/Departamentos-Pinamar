# Departamentos Pinamar - Deployment Guide

Este proyecto es una aplicación fullstack con NestJS (backend) y React/Vite (frontend) configurada para deployment en Vercel con base de datos Railway PostgreSQL.

## 🎯 Estado Actual
✅ **Backend funcionando** - Conectado a Railway PostgreSQL  
✅ **Frontend funcionando** - React/Vite listo  
✅ **Base de datos Railway** - 3 departamentos de ejemplo creados  
✅ **Configuración Vercel** - Lista para deploy  

## 🚀 Deploy en Vercel

### Variables de Entorno Requeridas en Vercel

**Environment Variables que debes configurar en Vercel:**

```bash
# Backend Database (Railway)
DATABASE_URL=postgresql://postgres:ndFeRFXrzpvBYZHAnEgevpmmWmIncikj@yamabiko.proxy.rlwy.net:55515/railway
NODE_ENV=production

# Frontend API URL (se configurará después del primer deploy)
VITE_API_URL=https://tu-proyecto.vercel.app/api
```

### Pasos para el Deploy

#### 1. Preparar el Repositorio
```bash
git add .
git commit -m "Configure Vercel deployment with Railway database"
git push origin main
```

#### 2. Configurar en Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. Selecciona este repositorio

#### 3. Configurar Variables de Entorno
En la sección "Environment Variables" de Vercel, agrega exactamente:

```
DATABASE_URL=postgresql://postgres:ndFeRFXrzpvBYZHAnEgevpmmWmIncikj@yamabiko.proxy.rlwy.net:55515/railway
NODE_ENV=production
VITE_API_URL=https://tu-proyecto.vercel.app/api
```

⚠️ **Importante**: Reemplaza `tu-proyecto` con el nombre real que Vercel asigne a tu proyecto.

#### 4. Build Settings en Vercel
Vercel debería detectar automáticamente desde `vercel.json`:
- **Build Command**: `cd front && yarn install && yarn build`
- **Install Command**: `cd front && yarn install && cd ../back && yarn install`
- **Output Directory**: `front/dist`

#### 5. Deploy y Actualizar URL
1. Haz clic en "Deploy"
2. Una vez desplegado, copia la URL final (ej: `https://departamentos-pinamar.vercel.app`)
3. **Actualiza** la variable `VITE_API_URL` en Vercel con: `https://tu-url-real.vercel.app/api`
4. **Redeploy** para aplicar los cambios

### 🔧 URLs del Proyecto
- **Frontend**: `https://tu-proyecto.vercel.app`
- **API**: `https://tu-proyecto.vercel.app/api`
- **Salud del backend**: `https://tu-proyecto.vercel.app/api/health`

### 🗄️ Base de Datos
- **Proveedor**: Railway PostgreSQL
- **Host**: `yamabiko.proxy.rlwy.net:55515`
- **Estado**: ✅ Configurada con datos de ejemplo

### 📱 Funcionalidades Disponibles
- **Backend NestJS** con MikroORM
- **Frontend React** con Vite y Tailwind CSS
- **3 Departamentos** de ejemplo ya creados
- **API REST** para gestión de departamentos y reservas
- **CORS** configurado correctamente

### 🐛 Troubleshooting

- **Error 500 en la API**: Verifica que `DATABASE_URL` esté correctamente configurada en Vercel
- **CORS Error**: Asegúrate de que `VITE_API_URL` apunte a tu dominio real de Vercel
- **Build Failed**: Revisa los logs en Vercel, posiblemente falte una dependencia
- **Database Connection**: La URL de Railway ya está probada y funcionando

### 🔄 Después del Deploy
1. Verifica que `https://tu-proyecto.vercel.app/api` responda
2. Prueba el frontend en `https://tu-proyecto.vercel.app`
3. Las migraciones ya están ejecutadas en Railway