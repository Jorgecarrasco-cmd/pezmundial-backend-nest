<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Pezmundial Recursos

# Ejecutar en modo desarrollo: 

1. Instalar dependencias de node: 

``` npm i ```

2. Copiar y pegar en el mismo path el archivo .env.template, renombrarlo a .env y asignar valores a las variables de entorno

``` .env.template -> .env ```

3. Agregar archivo que contiene la clave privada de firebase

``` Nombrarlo firebase-service-account.json ````

3. Importar el modulo "Seed" en el AppModule

4. Levantar la base de datos de desarrollo: 

``` docker-compose up -d ```

5. Levantar la aplicacion: 

``` npm run start:dev ```

6. Ejecutar el endpoint seed 

``` localhost:3000/api/v1/seed ``` 