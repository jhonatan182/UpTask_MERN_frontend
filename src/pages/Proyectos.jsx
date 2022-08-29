import { useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import PreviewProyecto from '../components/PreviewProyecto';
import Alerta from '../components/Alerta';
import io from 'socket.io-client';

let socket;
const hola = 'soy una variable desde el frontend';

const Proyectos = () => {
    const { proyectos, alerta } = useProyectos();

    useEffect(() => {
        //? creacion de la conexion al backend
        socket = io(import.meta.env.VITE_BACKEND_URL);

        //? enviar datos del frontend al backend
        socket.emit('prueba', hola);

        //? recibiendo datos desde el backend
        socket.on('desde el back', (persona) => {
            console.log('desde el backend', persona);
        });
    });

    const { msg } = alerta;
    return (
        <>
            <h1 className="text-4xl font-black">Proyectos</h1>

            {msg && <Alerta alerta={alerta} />}

            <div className="bg-white shadow mt-10 rounded-lg">
                {proyectos.length ? (
                    proyectos.map((proyecto) => (
                        <PreviewProyecto
                            key={proyecto._id}
                            proyecto={proyecto}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-600 uppercase p-5">
                        No hay proyectos aún
                    </p>
                )}
            </div>
        </>
    );
};

export default Proyectos;
