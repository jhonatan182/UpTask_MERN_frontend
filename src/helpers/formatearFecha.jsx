export const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha.split('T')[0].split('-'));

    return nuevaFecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        weekday: 'long',
    });
};
