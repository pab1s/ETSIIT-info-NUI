# ETSIIT-info-NUI
## Organización del proyecto en GitHub
### Pasos a tener en cuenta a la hora de trabajar con las ramas.

La ramificación del proyecto está pensada para mantener un flujo de trabajo organizado. 
El proyecto actualmente está dividido en 6 ramas:

 - `main`: es la rama principal y no se debe escribir en ella. Solo de lectura.
 - `develop`: todos los cambios que sean comunes a la totalidad o mayoría del proyecto se realizarán aquí (cambios en el servidor, en las pantallas de inicio o comunes, leap motion, QRs, etc).
 - `tramites`: rama para avanzar en aquellas implementaciones que solo estén relacionadas con citas y trámites.
 - `menu`: rama para avanzar en aquellas implementaciones que solo estén relacionadas con comendores y el menú.
 - `localizacion`: rama para avanzar en aquellas implementaciones que solo estén relacionadas con la localización de aulas y espacios diversos.
 - `docencia`: rama para avanzar en aquellas implementaciones que solo estén relacionadas con alumnos y sus perfiles en docencia.

En GitHub hemos montado *GitHub Workflows* que realizan las siguientes acciones:

 - La rama `main` es **solo de lectura**. Esta rama reflejará todos los cambios que se realicen en el proyecto. De esta forma, se puede probar la totalidad del programa desde esta rama.
 - Los cambios que se hagan en la rama `develop` se retransmitirán a **todas los demás ramas**. De esta forma, cuando cambiemos algo común se aplicará a todo.
 - Las ramas de características específicas aplicarán sus cambios en su propia rama y en la rama `main`.
 - 
*Nota*: Estos cambios **no hay que aplicarlos manualmente a cada rama**. Basta que apliques los cambios en la rama correspondiente en la que hayas hecho los cambios. *GitHub Workflows* se encargará de propagar los cambios a las demás ramas.

### Comandos de Git a tener en cuenta

 - Ver estado (rama, cambios pendientes, si hay que hacer pull):
```shell
git status
```
 - Seleccionar una rama:
```shell
git checkout 'rama'
```
 - Descargar cambios de la rama de GitHub (desde la rama que quieras poner al día):
```shell
git pull
```
 - Si no te aclaras con los pull en cada rama puedes usar el script en la carpeta raíz para actualizar todas las ramas
```shell
./git_pull.sh
```
 - Aplicar cambios concretos en la rama (pueden ser carpetas o archivos):
```shell
git add './carpeta/o/archivo.txt'
```
 - Hacer los cambios anteriores permanentes:
```shell
git commit -m "Mensaje breve descriptivo del cambio realizado"
```
 - Subir cambios a la misma rama de GitHub (desde la rama que quieras poner al día):
```shell
git push
```
 - Añadir los cambios de otra rama **a la actual**. **NO HACER, PREGUNTAR PREVIAMENTE**:
```shell
git merge 'la_otra_rama'
```
### Comandos del servidor a tener en cuenta

 - Los modulos no sabemos porque al cambiar de ordenador funcionan mal, para reinstalar todo si se quiere ejecutar el servidor
```shell
npm rebuild
```
 - Hay un error en el servidor que no sabemos solucionar así que hay que meterse en la carpeta del servidor antes de ejecutarlo.
```shell
cd server
```
```shell
node server.js
```
 - Despues de ejecutar esto escribiendo http://localhost:3000 en internet deberías poder ver tu pagina web y navegar por el resto. Aclaración, **solo navegas por las paginas de tu rama si lo quieres probar en el global del proyecto vete a la rama main y vuelve a hacer lo mismo.**
