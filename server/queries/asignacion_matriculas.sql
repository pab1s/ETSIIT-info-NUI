# Consulta básica para matricularse en todas las asignaturas de un año y semestre del DGIIM
# Por defecto, toma los grupos A de Teoría y 1 de Practicas.

INSERT INTO matriculas (username, indice)
SELECT 'luiscrespo', a.indice
FROM asignaturas a
INNER JOIN (
    SELECT asignatura, tipo_de_grupo, MIN(profesor) as profesor,
           CASE 
               WHEN tipo_de_grupo = 'Teoria' THEN 'A'
               WHEN tipo_de_grupo = 'Practicas' THEN '1'
           END as grupo
    FROM asignaturas
    WHERE curso = "Segundo curso" 
    AND titulacion = "Grado en Ingenieria Informatica y Matematicas" 
    AND semestre = "Segundo semestre"
    GROUP BY asignatura, tipo_de_grupo
) b ON a.asignatura = b.asignatura 
AND a.tipo_de_grupo = b.tipo_de_grupo 
AND a.profesor = b.profesor
AND a.grupo = b.grupo
WHERE a.curso = "Segundo curso" 
AND a.titulacion = "Grado en Ingenieria Informatica y Matematicas" 
AND a.semestre = "Segundo semestre";