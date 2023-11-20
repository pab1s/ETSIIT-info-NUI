"""
This script scrapes data from the University of Granada's website for undergraduate degree programs in either Spanish or English. It retrieves information about courses, professors, schedules, and more, and stores it in a CSV file. The script uses the requests, BeautifulSoup, csv, and unidecode libraries to accomplish this.

The script starts by defining the base URL and degree programs for the selected language. It then defines the CSV header and creates an index. The script iterates through the degree programs, makes a GET request to each program's page, and parses the HTML content. It then extracts the program name, course sections, and course information, including course name, specialty, professor, schedule, and more. Finally, it stores the data in a CSV file.

The script takes one argument, the language, which can be either 'es' for Spanish or 'en' for English. If an invalid language is provided, the script raises a ValueError.
"""
import requests
from bs4 import BeautifulSoup
import csv
from unidecode import unidecode

# Choose the language (es for Spanish, en for English)
language = 'en'  # Change to 'en' for English

# Define URLs based on the selected language
if language == 'es':
    base_url = 'https://www.ugr.es/estudiantes/grados/'
    grados = ['grado-ingenieria-informatica', 'grado-ingenieria-tecnologias-telecomunicacion',
             'grado-ingenieria-informatica-matematicas', 'grado-inga-informatica-administ-direcc-empresas']
    # Define days abbreviations for Spanish
    dias_abreviaturas = {
        'L': 'Lunes',
        'M': 'Martes',
        'X': 'Miercoles',
        'J': 'Jueves',
        'V': 'Viernes'
    }
elif language == 'en':
    base_url = 'https://www.ugr.es/en/study/undergraduate/'
    grados = ['bachelors-degree-computer-engineering-1', 'bachelors-degree-telecommunications-engineering',
             'gradobachelors-degreein-computer-sciencegradobachelors-degreein-business-administand-managem',
             'double-grado-computer-engineering-and-mathematics']
    # Define days abbreviations for English
    dias_abreviaturas = {
        'L': 'Monday',
        'M': 'Tuesday',
        'X': 'Wednesday',
        'J': 'Thursday',
        'V': 'Friday'
    }
else:
    raise ValueError("Invalid language choice. Use 'es' for Spanish or 'en' for English.")

# Define el encabezado del archivo CSV
csv_header = [
    "indice",
    "titulacion",
    "asignatura",
    "especialidad",
    "curso",
    "semestre",
    "grupo",
    "tipo_de_grupo",
    "profesor",
    "dia_de_la_semana",
    "hora_inicio",
    "hora_fin"
]

# Agrega el encabezado a la lista de datos
data = []
data.append(csv_header)

# Crea un índice
index = 0

# Itera a través de los programas de grado
for grado in grados:
    # Realiza una solicitud GET a la página
    response = requests.get(base_url + grado)

    # Analiza el contenido HTML de la página
    soup = BeautifulSoup(response.text, 'html.parser')

    # Obtiene el encabezado h1, que es el nombre del programa de grado
    nombre_titulacion = soup.find('h1', class_='page-title').text.strip()
    nombre_titulacion = nombre_titulacion.replace('+', 'plus')
    nombre_titulacion = nombre_titulacion.replace("'", '')
    # Encuentra todas las secciones de cursos
    secciones_cursos = soup.find_all(
        'div', class_='block-views-blockpeople-subject-asignatura-persona')

    # Itera a través de las secciones de cursos
    for seccion_curso in secciones_cursos:
        # Obtiene el número del curso
        curso = seccion_curso.find('h2').text.strip()

        # Obtiene las asignaturas por semestre
        tabla_semestres = seccion_curso.find_all(
            'table', class_='tabla-semestre')

        for tabla in tabla_semestres:
            semestre = tabla.find('caption').text.strip()

            asignaturas = tabla.find_all('td', class_='asignatura')

            for asignatura in asignaturas:
                # Obtiene el enlace a la asignatura
                enlace_asignatura = asignatura.a['href']

                # Obtiene el contenido de la asignatura
                asignatura = asignatura.text.strip()
                asignatura = asignatura.replace('-', ' ')

                # Obtiene la especialidad de la asignatura
                inicio = asignatura.find('(')
                fin = asignatura.find(')', inicio)

                if inicio != -1 and fin != -1:
                    especialidad = asignatura[inicio + 1:fin]
                    asignatura = asignatura[:inicio] + asignatura[fin + 1:]
                else:
                    especialidad = ''

                # Elimina espacios en blanco repetidos
                asignatura = ' '.join(asignatura.split())

                # Realiza una solicitud GET al enlace de la asignatura
                response_asignatura = requests.get(enlace_asignatura)

                # Analiza el contenido HTML de la página de la asignatura
                soup_asignatura = BeautifulSoup(
                    response_asignatura.text, 'html.parser')

                # Encuentra la sección de profesorado
                seccion_profesorado = soup_asignatura.find_all(
                    'div', class_='profesorado-asignatura')

                for profesorado in seccion_profesorado:
                    tipo_profesorado = profesorado.find('h3').text.strip()
                    profesores = profesorado.find_all('li', class_='profesor')

                    for profesor in profesores:
                        nombre_profesor = profesor.a.text.strip()
                        nombre_profesor = nombre_profesor.replace('-', ' ')
                        grupos = profesor.find(
                            'span', class_='grupos').text.strip().split()[-1]

                        # Encuentra la sección de horarios
                        seccion_horarios = soup_asignatura.find(
                            'div', class_='horario')

                        if seccion_horarios:
                            # Encuentra todas las filas de horarios
                            filas_horarios = seccion_horarios.find_all('tr')

                            # Obtiene los nombres de los días de la semana
                            dias_semana = []
                            for dia in filas_horarios[0].find_all('div', class_='dia-red'):
                                dia_abreviatura = dia.text.strip()
                                dias_semana.append(dia_abreviatura)

                            # Itera a través de las filas de horarios
                            for fila in filas_horarios[1:]:
                                # Obtiene las celdas de horario
                                celdas_horario = fila.find_all('td')

                                # Itera a través de las celdas de horario
                                for i, celda in enumerate(celdas_horario):
                                    if celda.find('div', class_='clase'):
                                        grupo = celda.find(
                                            'div', class_='grupo').text.strip().split(' ')[1]
                                        otros_datos = celda.find(
                                            'div', class_='otros-datos').text.strip()
                                        info_horario = otros_datos.split('\n')
                                        aula = info_horario[0].split(': ')[1]
                                        fechas_horario = info_horario[2].split(': ')[1]
                                        horario = info_horario[3].split(': ')[1]
                                        horario = horario.split(' ')[1::2]

                                        # Crea una lista con los datos a guardar en formato CSV
                                        course_data = [
                                            index,
                                            nombre_titulacion,
                                            asignatura,
                                            especialidad,
                                            curso,
                                            semestre,
                                            grupo,
                                            tipo_profesorado,
                                            nombre_profesor,
                                            dias_abreviaturas[dias_semana[i]],
                                            horario[0]+":00",
                                            horario[1]+":00"
                                        ]

                                        # Aplica unidecode a cada cadena en los datos, excepto index y horas
                                        for j in range(len(course_data)):
                                            # Evita aplicar unidecode a index, hora de inicio y hora de fin
                                            if j not in [0, 10, 11]:
                                                if isinstance(course_data[j], str):
                                                    course_data[j] = unidecode(course_data[j])

                                        data.append(course_data)
                                        index += 1

# Define the filename based on the selected language
if language == 'es':
    filename = 'data/ugr_data_es.csv'
    print('Datos guardados en ugr_data_es.csv')
elif language == 'en':
    filename = 'data/ugr_data_en.csv'
    print('Data saved in ugr_data_en.csv')

# Save the data to a CSV file
with open(filename, 'w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerows(data)
