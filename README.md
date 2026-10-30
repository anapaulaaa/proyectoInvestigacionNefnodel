# NEFNODEL · Investigación de Operaciones

Aplicación web interactiva para presentar y analizar el proyecto de investigación de operaciones de NEFNODEL. Incluye modelos de transporte, cantidad económica de pedido (EOQ), preparación de pedidos y visualizaciones de los resultados.

## Requisitos

- Node.js 18 o una versión posterior
- npm

## Instalación

```bash
npm install
```

## Comandos disponibles

Iniciar el entorno de desarrollo:

```bash
npm run dev
```

Crear la versión de producción:

```bash
npm run build
```

Previsualizar la versión de producción:

```bash
npm run preview
```

Ejecutar las pruebas:

```bash
npm test
```

## Estructura principal

- `src/`: componentes, estilos, modelos y datos de la aplicación.
- `public/`: recursos públicos, incluido el logotipo de UMG.
- `NEFNODEL Investigación de Operaciones.pdf`: documento de investigación.
- `proyecto investigacion de operaciones .docx`: documento editable de la investigación.

## Publicar en GitHub

Este proyecto está preparado para publicarse en:

<https://github.com/anapaulaaa/proyectoInvestigacionNefnodel>

Si el repositorio local todavía no tiene Git configurado, ejecuta desde esta carpeta:

```bash
git init
git add .
git commit -m "Initial project upload"
git branch -M main
git remote add origin https://github.com/anapaulaaa/proyectoInvestigacionNefnodel.git
git push -u origin main
```

Si `origin` ya existe, actualízalo en lugar de volver a agregarlo:

```bash
git remote set-url origin https://github.com/anapaulaaa/proyectoInvestigacionNefnodel.git
git push -u origin main
```

GitHub puede solicitar autenticación. Para HTTPS, utiliza tu usuario de GitHub y un token personal en lugar de tu contraseña.
