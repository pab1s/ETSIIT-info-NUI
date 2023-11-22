#!/bin/bash

# Obtiene el nombre de la rama actual
current_branch=$(git symbolic-ref --short HEAD)

# Listado de ramas en las que se realizará git pull
branches=(main develop tramites docencia localizacion menu)


# Recorrer el listado de ramas
for branch in "${branches[@]}"; do
    # Verificar si la rama existe
    if git rev-parse --verify $branch >/dev/null 2>&1; then

        # Realizar git pull en la rama especificada
        git checkout $branch
        git pull origin $branch
    else
        # Mostrar un mensaje de error si la rama no existe
        echo "La rama $branch no existe en el repositorio"
    fi
done

# Realiza un git checkout a la rama en la que estabamos
git checkout $current_branch