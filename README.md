#  Proyecto final Arquitectura Web Universidad de Palermo

Para ejecutar el proyecto localmente, sigue estos pasos:

## Requisitos Previos
- **Node.js**: Asegúrate de tener Node.js instalado. Puedes especificar la versión usando NVM (Node Version Manager) según el archivo `.nvmrc`.
- **Docker**: Asegúrate de que Docker y Docker Compose estén instalados si planeas ejecutar la aplicación con Docker.

## Pasos para Ejecutar en Local

1. **Clonar el Repositorio**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Instalar Dependencias**: Usa npm para instalar todas las dependencias necesarias.
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**:
   - Copia el archivo `.env.example` y renómbralo a `.env`.
   - Completa las variables de entorno en el archivo `.env` con tus configuraciones específicas.

4. **Configuración de la Base de Datos (PostgreSQL)**:
   - Puedes ejecutar una instancia local de PostgreSQL o usar la configuración de Docker proporcionada (ver detalles a continuación).
   - Asegúrate de que las configuraciones de la base de datos en el archivo `.env` coincidan con tu configuración local.

5. **Ejecutar Migraciones de la Base de Datos**:
   - Asegúrate de que tu base de datos esté en ejecución y ejecuta las migraciones para configurar el esquema de la base de datos:
     ```bash
     npm run typeorm:run-migrations
     ```

6. **Ejecutar la Aplicación**:
   - **Modo Desarrollo**: Ejecuta la aplicación en modo de desarrollo con recarga automática.
     ```bash
     npm run start:dev
     ```
   - **Modo Producción**: Construye y ejecuta la aplicación en modo de producción.
     ```bash
     npm run build
     npm run start:prod
     ```

## Ejecución con Docker

1. **Construir y Ejecutar con Docker Compose**:
   - Navega al directorio raíz del proyecto.
   - Usa Docker Compose para construir e iniciar la aplicación junto con la base de datos:
     ```bash
     docker-compose up --build
     ```
   Esto creará y ejecutará contenedores para la aplicación (api) y una base de datos PostgreSQL (postgres).

2. **Acceso a la Aplicación**:
   - El servidor de la API estará disponible en [http://localhost:4000](http://localhost:4000) (ajusta según cualquier cambio en el archivo `docker-compose.yml`).
   - Asegúrate de que la configuración de puertos en `.env` y en los puertos de Docker coincidan para evitar conflictos.

## Acceso a la Aplicación
- **Documentación de la API**: Accede a la documentación de la API Swagger y a la interfaz de prueba en [http://localhost:4000/api](http://localhost:4000/api) una vez que el servidor esté en ejecución.

Siguiendo estos pasos, deberías poder ejecutar la aplicación de NestJS en local para desarrollo, pruebas o propósitos de integración.

## Ejecucion de pruebas E2E y Unitarias
Las pruebas E2E y Unitarias se ejecutan con Jest. Puedes ejecutar las pruebas con los siguientes comandos:

- **Pruebas Unitarias**:
  ```bash
  npm run test
  ```
- **Pruebas E2E**:
  ```bash
  npm run test:e2e
  ```
- **Cobertura de Pruebas**:
  ```bash
  npm run test:cov
  ```

