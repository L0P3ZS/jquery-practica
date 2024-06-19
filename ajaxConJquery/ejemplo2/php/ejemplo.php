<?php

$data = file_get_contents('php://input');

$data = json_decode($data, true);

if (isset($data['nombre'])) {
    echo $data['nombre'];
}else{
    echo 'El dato no fue enviado';
}

// echo $data;

?>