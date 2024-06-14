
document.addEventListener('DOMContentLoaded', function () {
    var rutaActual = window.location.pathname;

    // Variables de URL
    var urlss = urlBase + '/traerCitas';
    var idUsuario = $('#idUsuarioVisible').val();
    var datoMedico = urlBase + '/traer-citas-medi/' + idUsuario;


    var eventosURL = (rutaActual.includes('/calendario')) ? urlss : datoMedico;
    const urlActualizarCita = urlBase + '/actualizarCita';
    let calendarEvent;



    function llenarFormulario(evento) {

        // console.log('Datos de respuesta:', evento);

        if (evento.id == $('#id_cita').val()) {
            $('#eventDetailsModal').modal('show');

            // Llenar opciones de fecha

            console.log(evento.extendedProps);

            var fechaInicio = evento.startStr.substring(0, 10);
            $('#fecha_inicio_citaUpdate').val(fechaInicio);

            // Establecer la fecha de fin y asegurarse de que no sea anterior a la fecha de inicio
            var fechaFin = evento.endStr.substring(0, 10);
            $('#fecha_fin_citaUpdate').val(fechaFin);
            $('#fecha_fin_citaUpdate').prop('min', fechaInicio);
            $('#nombre_usuario').val(evento.extendedProps.nombre_usuario);
            $('#hora_inicio_citaUpdate').val(evento.startStr.substring(11, 16));
            $('#hora_fin_citaUpdate').val(evento.endStr.substring(11, 16));
            $('#pacienteUpdate').val(evento.extendedProps.nombre_paciente);
            $('#sexo').val(evento.extendedProps.sexo);
            $('#servicios').val(evento.extendedProps.servicios);
            $('#edadUpdate').val(evento.extendedProps.edad);
            $('#fecha_ingresoUpdate').val(evento.extendedProps.fecha_ingreso);
            $('#observacionUpdate').val(evento.extendedProps.observaciones);
            $('#id_ingresos').val(evento.extendedProps.id_ingresos);
            $('#entidadSaludUpdate').val(evento.extendedProps.codigo);
            $('#nombreAcompañanteUpdate').val(evento.extendedProps.acompanante);
            $('#parentescoUpdate').val(evento.extendedProps.parentesco);
            $('#telefonoUpdate').val(evento.extendedProps.telefono);
            $('#direccionUpdate').val(evento.extendedProps.direccion);
            $('#numeroIndentificacion').val(evento.extendedProps.identificacion);
            $('#tipodocumentoUpdate').val(evento.extendedProps.tipo_documento);
            $('#tipoAfiliacionUpdate').val(evento.extendedProps.descripcion_afiliacion);
            $('#tipoIngresoUpdate').val(evento.extendedProps.tipo_ingreso);
            $('#tipoUsuarioUpdate').val(evento.extendedProps.tipo_usuario);
            $('#modalidadAtencionUpdate').val(evento.extendedProps.nombre_modalidad);
            $('#finalidadConsultaUpdate').val(evento.extendedProps.finalidad_descripcion);
            $('#causaExternaUpdate').val(evento.extendedProps.causa_descripcion);
            $('#accesoTsUpdate').val(evento.extendedProps.descripcion_tec_salud);
            $('#diagnosticoUpdate').val(evento.extendedProps.nombre_diagnostico);
            $('#numeroControlUpdate').val(evento.extendedProps.tipo_contrato);
            $('#tipoDiagnosticoUpdate').val(evento.extendedProps.descripcion_diagnostico);
        }

        var idIngreso = $('#id_ingresos').val();
        var ingreso = $('#datosUpdat');


        if (idIngreso === '') {
            ingreso.hide();
        } else {
            ingreso.show();
        }
    }


    function highlightCurrentDay() {
        var today = new Date().toISOString().split('T')[0];
        var currentDayCell = document.querySelector('.fc-day[data-date="' + today + '"]');
        if (currentDayCell) {
            currentDayCell.classList.add('current-day');
        }
    }

    function highlightPastDays() {
        var today = moment().startOf('day');
        document.querySelectorAll('.fc-day').forEach(function (dayCell) {
            var date = dayCell.getAttribute('data-date');
            var isPastDay = moment(date).isBefore(today, 'day');
            if (isPastDay) {
                dayCell.classList.add('past-day');
            }
        });
    }





    const calendarEl = document.getElementById('agenda');
    let calendarInstance;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        locale: 'es',
        editable: true,
        selectable: true,
        events: eventosURL,



        dateClick: function (info) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (info.date < today) {
                return;
            }

            $('#myModal').modal('show');
            var fechaSeleccionada = info.date.toISOString().split('T')[0];
            document.getElementById('fechaInicio').value = fechaSeleccionada
            $('#fechaFin').prop('min', fechaSeleccionada);

        },
        eventClick: function (info) {

            calendarEvent = info.event;


            $('#id_cita').val(calendarEvent.id);

            llenarFormulario(calendarEvent);

            // console.log('ID del evento al hacer clic:', calendarEvent.extendedProps.id_cita);
            // console.log('ID del evento antes de la solicitud AJAX:', $('#id_cita').val());
        },

        eventBackgroundColor: '#b7eae9',
        eventBorderColor: '#fff',
        eventTextColor: 'black',

        datesSet: function (info) {
            highlightCurrentDay();
            highlightPastDays();
        },

        eventDidMount: function (info) {
            var estadoCita = info.event.extendedProps.estado_cita;


            var inicioCita = info.event.extendedProps.start;
            var finCita = info.event.extendedProps.end;

            if (estadoCita === 'Cancelada') {
                info.el.style.background = '#e54852';
                info.el.style.borderColor = '#e54852';
                info.el.style.color = 'black';
            } else if (estadoCita === 'Efectuado') {
                info.el.style.backgroundColor = '#2BED00';
                info.el.style.borderColor = '#2BED00';
                info.el.style.color = 'black';

            } else if (inicioCita === finCita) {
                info.el.style.backgroundColor = '#b7eae9';
                info.el.style.borderColor = '#b7eae9';
                info.el.style.color = 'black';
            }

        },



        /**
         * Maneja el evento de arrastre de una cita en el calendario.
         * Actualiza la fecha de inicio y fin de la cita en el servidor mediante una llamada AJAX.
         *
         * @param {object} info - Información sobre el evento de arrastre.
         *                       Contiene detalles como el ID del evento, la nueva fecha de inicio y fin.
         * @author Sebastian Lopez <yoniersebastian23@gmail.com>
         */
        eventDrop:  (rutaActual.includes('/calendario')) ? function (info) {
            const idCita = info.event.id;
            const nuevaFechaInicio = info.event.start.toISOString();
            const nuevaFechaFin = info.event.end ? info.event.end.toISOString() : null;
            var csrfToken = $('meta[name="csrf-token"]').attr('content');

            // Realizar una llamada AJAX para enviar el evento actualizado al servidor
            $.ajax({
                url: urlBase + '/actualizarMov/' + idCita,
                type: 'PUT',
                data: {
                    start: nuevaFechaInicio,
                    end: nuevaFechaFin,
                    _token: csrfToken
                },
                success: function (response) {

                },
                error: function (error) {
                    console.error('Error en la solicitud AJAX:', error);
                }
            });
        }: null,

    });





     medicoEnvento = calendar;

    $(document).ready(function () {
        var token = $('meta[name="csrf-token"]').attr('content');


        $('#medicoOption').on('change', function() {

            var idMedico = $(this).val();

            traerMedicos(idMedico, token);
        });
    });


    function  traerMedicos(idMedico, token) {

        $.ajax({
            type: 'GET',
            url: urlBase + '/traerMedicoCita',
            headers: {
                'X-CSRF-TOKEN': token
            },
            data: {
                idMedico: idMedico
            },
            success: function (data) {


                // Elimina eventos existentes
                medicoEnvento.getEvents().forEach(function (event) {
                    event.remove();
                });

                // Agrega nuevos eventos
                medicoEnvento.addEventSource(data);

                // Renderiza el calendario después de agregar eventos
                medicoEnvento.render();
            },

        });
    }


    /**
     * Maneja el evento del botón 'saveEvent' para actualizar una cita  en el servidor.
     * Recolecta los datos del formulario de actualización, realiza una llamada AJAX al servidor
     * para actualizar la cita y redirige a la página de calendario si la actualización es exitosa.
     *
     * @param {object} event - Objeto de evento del botón 'saveEvent'.
     */

    $('#saveEvent').click(function (event) {
        event.preventDefault();


        var idCita = $('#id_cita').val()
        var idIngreso = $('#id_ingresos').val()
        var token = $('input[name=_token]').val();

        const updatedFormData = {
            'id_cita': idCita,
            'fecha_inicio_cita': $('#fecha_inicio_citaUpdate').val(),
            'hora_inicio_cita': $('#hora_inicio_citaUpdate').val(),
            'fecha_fin_cita': $('#fecha_fin_citaUpdate').val(),
            'hora_fin_cita': $('#hora_fin_citaUpdate').val(),
        };

        // console.log('ID del evento:', calendarEvent.id_cita);
        // console.log('Datos a enviar al servidor:', updatedFormData);

        try {
            $.ajax({
                url: urlActualizarCita + '/' + idCita,
                headers: { 'X-CSRF-TOKEN': token },
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ data: updatedFormData }),

                success: function (response) {
                    if (response.success) {
                        window.location.href = '/calendario';
                    } else {
                        console.error('Error al actualizar la cita:', response, calenda.id_cita);
                    }
                },

            });
        } catch (error) {
            console.error('Error en el bloque try-catch:', error);
        }
    });



    calendar.render();


});

$(document).ready(function () {
    $(".select-common").select2({
        dropdownParent: $("#myModal"),
        width: "100%"
    });
});

$(document).ready(function () {

    $(".select-co").select2({
        dropdownParent: $("#eventDetailsModal"),
        width: "100%"
    });

});

$(document).ready(function () {
    $("#selectObjeto").select2({
        dropdownParent: $("#myModal"),
        width: "100%"
    });


});

//


// Llama a buscarUs() en tiempo real (puede ser en el evento keyup)
$('#numeroDocumento').keyup(function () {
    buscarUs();
});


/**
 * Realiza una búsqueda de ingresos de pacientes por número de documento utilizando una llamada AJAX.
 */
function buscarUs() {
    var numeroDocumento = $('#numeroDocumento').val();
    var token = $('meta[name="csrf-token"]').attr('content');

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: urlBase + '/datosIngreso',
            method: 'GET',
            headers: { 'X-CSRF-TOKEN': token },
            data: { numeroDocumento: numeroDocumento },
            success: function (data) {
                resolve(data.ingresos);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la búsqueda:", textStatus, errorThrown);
                reject(errorThrown);
            }
        });
    });
}





$(document).ready(function () {
    // Manejar la tecla "Enter" en el campo de entrada
    $('#numeroDocumento').on('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            $('#btnListar').click();
        }
    });


    $('#btnListar').click(function () {
        buscarUs()
            .then(function (resultados) {
                if (resultados && resultados.length > 0) {
                    mostrarResultados(resultados);
                } else {
                    alertSwitch('info', 'No se encontraron datos.');
                }
            })
            .catch(function (error) {
                console.error("Error en la búsqueda:", error);
            });
    });

});




/**
 * Muestra los resultados de la búsqueda de ingresos en una tabla y abre un modal para visualizarlos.
 *
 * @param {Array} resultados - Lista de resultados de ingresos de pacientes.
 */

function mostrarResultados(resultados) {
    $('#myModal').modal('hide');
    $('#segundoModal').modal('show');

    var tablaCoincidencias = $('#ingresoTabla');
    if ($.fn.DataTable.isDataTable('#ingresoTabla')) {
        tablaCoincidencias.DataTable().destroy();
    }
    tablaCoincidencias.empty();



    if (resultados.length > 0) {
        tablaCoincidencias.append('<thead><tr><th>Ingreso</th><th>Fecha Ingreso</th><th>Tipo Ingreso</th><th>Estado</th><th>Acciones</th></tr></thead>');

        var tbody = $('<tbody></tbody>');

        $.each(resultados, function (index, ingreso) {
            var fila = '<tr class="rounded-row">' +
                '<td>' + ingreso.id + '</td>' +
                '<td>' + ingreso.fecha_ingreso + '</td>' +
                '<td>' + ingreso.tipo_ingreso + '</td>' +
                '<td>' + ingreso.estado_programacion + '</td>' +
                '<td>' +
                '<button class="btn btn-primary btn-guradar btn_1"  onclick="mostrarDetalles(' + ingreso.id + ')">' +
                '<i class="fa-solid fa-pen-to-square"></i>' +
                '</button>' +
                '</td>' +
                '</tr>';
            tbody.append(fila);

            $('#idPaciente').val(ingreso.id_paciente);
        });
        tablaCoincidencias.append(tbody);

        datTable();


    }
}

function datTable() {

    if ($.fn.DataTable.isDataTable('#ingresoTabla')) {
        $('#ingresoTabla').DataTable().destroy();
    }
    var table = $('#ingresoTabla').DataTable({

        initComplete: function (settings, json) {

            $('.ingresos_tabla .dataTables_filter input[type="search"]').each(function () {
                var input = $(this);
                var label = input.parent('label');
                input.insertAfter(label);
                label.remove();
            });

            $('.ingresos_tabla .dataTables_filter input[type="search"]').attr('type', 'text').attr('placeholder', 'Buscar...');

            var buttonHtml = '<button class="search-button" type="button">' +
                '<svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">' +
                '<path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>' +
                '</svg>' +
                '</button>';

            $('.ingresos_tabla .dataTables_filter ').prepend(buttonHtml);

            var resetButtonHtml = '<button class="reset" type="reset">' +
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">' +
                '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>' +
                '</svg>' +
                '</button>';

            $('.ingresos_tabla .dataTables_filter').append(resetButtonHtml);

            $('.reset').click(function () {
                table.search('').columns().search('').draw();
                $('.ingresos_tabla .dataTables_filter input[type="search"]').val('');
            });
        }

    });
}


$(document).ready(function () {
    $('#cambiarEstadoBtn').on('click', function () {
        // Puedes utilizar JavaScript para confirmar la acción con el usuario si es necesario

        // Obtiene el nuevo estado deseado
        var nuevoEstado = 'Cancelada';
        var idCita = $('#id_cita').val()

        // Obtiene el token CSRF
        var csrfToken = $('meta[name="csrf-token"]').attr('content');


        // Realiza una solicitud Ajax para cambiar el estado de la cita
        $.ajax({
            url: urlBase + '/cambiarEstadoCita/' + idCita,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nuevoEstado: nuevoEstado, _token: csrfToken }),
            success: function (data) {
                window.location.href = '/calendario';
            },
            error: function (error) {
                console.error('Error al cambiar el estado de la cita:', error);
            }

        });


    });
});




$(document).ready(function() {
    $('#efectuado').on('click', function() {
        // Puedes utilizar JavaScript para confirmar la acción con el usuario si es necesario

        // Obtiene el nuevo estado deseado
        var nuevoEstado = 'efectuado';
        var idCita = $('#id_cita').val()

        // Obtiene el token CSRF
        var csrfToken = $('meta[name="csrf-token"]').attr('content');

        // Realiza una solicitud Ajax para cambiar el estado de la cita
        $.ajax({
            url: urlBase + '/cambiarEstadoCita/' + idCita,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nuevoEstado: nuevoEstado, _token: csrfToken }),
            success: function(data) {
                console.log(data);
                window.location.href = '/calendario';
            },
            error: function(error) {
                console.error('Error al cambiar el estado de la cita:', error);
            }
        });
    });
});





/**
 * Trae los detalles del ingreso de usuarios y los muestra en el formulario.
 *
 * @param {number} idIngreso - ID del ingreso del usuario del cual se desean obtener los detalles.
 */
function mostrarDetalles(idIngreso) {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');

    // Realizar una llamada AJAX para obtener los detalles del ingreso
    $.ajax({
        url: urlBase + '/obtenerDetallesIngreso',
        method: 'POST',
        data: { idIngreso: idIngreso, _token: csrfToken },
        success: function (data) {



            alertSwitch('success', 'Los datos se cargaron.', 8000);



            $('#datos_ingresos').show();

            // Llenar los campos del formulario con los detalles obtenidos
            $('#telefono').val(data.detalles.telefono);
            $('#idPaciente').val(data.detalles.id_paciente);
            $('#fechaIngresos').val(data.detalles.fecha_ingreso);
            $('#observaciones').val(data.detalles.observaciones);
            $('#direccion_acompanante').val(data.detalles.direccion_acompanante);
            $('#acompanante').val(data.detalles.acompanante);
            $('#sexoIngreso').val(data.detalles.sexo);
            $('#edad').val(data.detalles.edad);
            $('#idIngresoExistente').val(data.detalles.id);
            $('#nombres_completos').val(`${data.detalles.primer_nombre} ${data.detalles.segundo_nombre}`);
            $('#parentescoFamiliar').val(data.detalles.parentesco);

            $('#estado_programacion').val(data.detalles.estado_programacion);
            $('#nombre_modalidad').val(data.detalles.nombre_modalidad);
            $('#tipo_usuario').val(data.detalles.tipo_usuario);
            $('#tipoAfiliacion').val(data.detalles.descripcion_afiliacion);
            $('#codigo_diagnostico').val(data.detalles.descripcion_diagnostico);
            $('#diagnostico_ingreso').val(data.detalles.nombre_diagnostico);
            $('#causa_externa').val(data.detalles.descripcion);
            $('#finalidad_consulta').val(data.detalles.descripcion);
            $('#acceso_ts').val(data.detalles.descripcion_tec_salud);
            $('#numero_contrato').val(data.detalles.numero_contrato);
            $('#entidadSalud').val(data.detalles.razon_social);
            $('#modalidad_atencion').val(data.detalles.nombre_modalidad);


            // llenarCampoSelectUnico('parentescoFamiliar', data.detalles.parentesco);
            llenarCampoSelectUnico('selectObjeto', data.detalles.identificacion);
            llenarCampoSelectUnico('selectTipoIdentificacion', data.detalles.abreviatura);


        },
    });

    // // Mostrar el modal con los detalles del ingreso
    $('#segundoModal').modal('hide');
    $('#myModal').modal('show');
}

/**
 * Llena un campo de selección con una opción única.
 *
 * @param {string} idCampoSelect - ID del campo de selección a llenar.
 * @param {string} opcion - Opción única a agregar al campo de selección.
 */
function llenarCampoSelectUnico(idCampoSelect, opcion) {
    var $campoSelect = $('#' + idCampoSelect);
    $campoSelect.empty();
    $campoSelect.append(`<option value="${opcion}" selected>${opcion}</option>`);
}


$(document).ready(function () {
    $('#cerrarModal2').click(function () {
        $('#myModal').modal('show');
        limpiarDatosModal();

    });

    $('#cerrar2').click(function () {
        $('#myModal').modal('show');

        limpiarDatosModal();
    });

    $('#cerrarModalCrearCita').click(function () {
        $('#datos_ingresos').hide();
        $('#myModal').modal('hide');

        limpiarDatosModal();
    });

    $('#datos_ingresos').hide();


});

function limpiarDatosModal() {
    $('.datos').val('');

    $('.dato').val('').trigger('change');


}



$('#guardar').click(function (envet) {

    var datos = $('.datosSelec').val();
    var horaInicio = $('#hora_inicio').val();
    var fechaFin = $('#fechaFin').val();
    var horaFin = $('#horaFin').val();


    if (datos === '') {
        envet.preventDefault();
        alertSwitch('error', 'Por favor seleccione la servicio')
    } else if (horaInicio === '') {
        envet.preventDefault();
        alertSwitch('error', 'Por favor ingrese la hora de inicio')
    } else if (fechaFin === '') {
        envet.preventDefault();
        alertSwitch('error', 'Por favor ingrese la fecha del fin de la cita ')
    } else if (horaFin === '') {
        envet.preventDefault();
        alertSwitch('error', 'Por favor ingrese la hora fin de la cita')
    }

})






/*
==========================================================
FUNCION PARA VER LAS HORAS DISPONIBLES Y SELECCIONARLAS
==========================================================

*/

function ObtenerCitasMedico(idMedico) {
    var fechaSeleccionada = $('#fechaInicio').val();

    $.ajax({
        type: 'GET',
        url: urlBase + '/ObtenerCitasMedico',
        dataType: 'json',
        data: {
            medico: idMedico,
            fechaInicio: fechaSeleccionada
        },
        success: function(response) {
            var tablaHoras = '<table class="table">';
            tablaHoras += '<thead><tr><th>Hora</th><th>Disponibilidad</th></tr></thead>';
            tablaHoras += '<tbody>';

            for (var i = 7; i < 18; i++) {
                var horaActual = i.toString().padStart(2, '0') + ':00';


                var citasHoraActual = response.filter(function(cita) {
                    return cita.hora_inicio_cita.substring(0, 2) === i.toString().padStart(2,
                        '0');
                });


                tablaHoras += '<tr class="hora" data-hora="' + horaActual + '">';
                tablaHoras += '<td>' + horaActual + '</td>';
                tablaHoras += '<td>';

                // Etiquetas de progreso
                tablaHoras += '<div class="progress-labels">';
                for (var l = 0; l < 60; l += 20) {
                    tablaHoras += '<div class="progress-label">' + l + '</div>';
                }

                tablaHoras += '</div>'; // Cierre del div de etiquetas de progreso

                // Barra de progreso
                tablaHoras += '<div class="progress">'; // Abre el div de la barra de progreso

                if (citasHoraActual.length > 0) {
                    // Calcular todos los minutos ocupados en la hora actual
                    var minutosOcupados = [];
                    citasHoraActual.forEach(function(cita) {
                        var inicio = new Date('2000-01-01T' + cita.hora_inicio_cita);
                        var fin = new Date('2000-01-01T' + cita.hora_fin_cita);
                        var ocupadoDesde = inicio.getMinutes();
                        var ocupadoHasta = fin.getMinutes();
                        for (var m = ocupadoDesde; m <= ocupadoHasta; m++) {
                            minutosOcupados.push(m);
                        }
                    });

                    // Generar la barra de progreso y ocultar los minutos ocupados
                    var progresoHTML = '';
                    var minutosOcupados = Array(60).fill(
                        false);
                    citasHoraActual.forEach(function(cita) {
                        var inicio = new Date('2000-01-01T' + cita.hora_inicio_cita);
                        var fin = new Date('2000-01-01T' + cita.hora_fin_cita);
                        var inicioMinuto = inicio.getMinutes();
                        var finMinuto = fin.getMinutes();
                        for (var j = inicioMinuto; j <= finMinuto; j++) {
                            minutosOcupados[j] = true;
                        }
                    });

                    for (var k = 0; k < 60; k++) {
                        if (minutosOcupados[k]) {
                            progresoHTML +=
                                '<div class="progress-bar bg-danger" role="progressbar" style="width: calc(100% / 60); padding:0.25em; cursor:pointer; font-size: 0.7em;" aria-valuenow="' +
                                k + '" aria-valuemin="0" aria-valuemax="59">' + k + '</div>';
                        } else {
                            progresoHTML +=
                                '<div class="progress-bar " role="progressbar" style="width: calc(100% / 60); background-color:#6ece84;padding:0.6em; cursor:pointer; font-size: 1em;" aria-valuenow="' +
                                k + '" aria-valuemin="0" aria-valuemax="59">' + k + '</div>';
                        }
                    }

                    tablaHoras += progresoHTML;

                    tablaHoras += '</div>'; // Cierre del div de la barra de progreso
                } else {
                    tablaHoras += '<p class="TextDisponible">Disponible</p>';
                }
                tablaHoras += '</td>';
                tablaHoras += '</tr>';
            }

            tablaHoras += '</tbody></table>';


            $('#horasDisponibles').html(tablaHoras);


            $('.hora').click(function() {
                var horaCompleta = $(this).data(
                    'hora');

                // Filtrar minutos ocupados
                var minutosOcupados = [];
                $(this).find('.progress-bar.bg-danger').each(function() {
                    var minutoOcupado = $(this).attr('aria-valuenow');
                    minutosOcupados.push(minutoOcupado);
                });

                // Crear un desplegable para seleccionar los minutos
                var selectMinutos = '<select id="selectMinutos" class="form-select form-select-lg mb-3">';
                for (var m = 0; m < 60; m++) {
                    var minutos = m.toString().padStart(2, '0');
                    if (!minutosOcupados.includes(minutos)) {
                        selectMinutos += '<option value="' + minutos + '">' + minutos + '</option>';
                    } else {
                        selectMinutos += '<option class="cita-ocupada" value="' + minutos + '" disabled>' + minutos + '</option>';
                    }
                }
                selectMinutos += '</select>';


                $('#minutosCita').html(selectMinutos);


                $('#selectMinutos').change(function() {
                    var minutosSeleccionados = $(this).val();

                    // Separar la hora y los minutos de la hora completa
                    var partesHora = horaCompleta.split(':');
                    var hora = partesHora[0];
                    var minutos = partesHora[1];


                    var horaInicioCita = hora + ':' + minutosSeleccionados;
                    miModal.style.display = "none";

                    $('#hora_inicio').val(horaInicioCita);
                });
            });
            $('.progress-bar.bg-danger').click(function() {
                event.stopPropagation();
                alertSwitch('error', 'Ya hay una cita en esa hora')
            });
            $('.progress-bar').click(function() {
                var minutosSeleccionados = $(this).attr('aria-valuenow');
                $('#selectMinutos').val(minutosSeleccionados).trigger('change');
            });

        }
    });
}


/*
================================================
FUNCION PARA ABRIR EL MODAL
================================================
*/

var abrirModalBtn = document.getElementById("abrirModalHorariosBtn");

var miModal = document.getElementById("citasModal");

var cerrarSpan = document.getElementsByClassName("cerrar")[0];

abrirModalBtn.onclick = function() {
    miModal.style.display = "block";
    $('#selectMedicos').on('change', function() {

        var idSeleccionado = $(this).val();
        $('#idMedico').val(idSeleccionado);
        ObtenerCitasMedico(idSeleccionado)
    });
}

cerrarSpan.onclick = function() {
    miModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == miModal) {
        miModal.style.display = "none";
    }
}
