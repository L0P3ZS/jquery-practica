<?php

$mesaje = $_GET['mensaje'] ?? '';

$respuesta = 'El servidor dice:'. $mesaje;

echo $respuesta;

?>