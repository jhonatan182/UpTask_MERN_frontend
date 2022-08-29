import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';

const FormularioProyecto = () => {
    //? state
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState('');

    //? params
    const params = useParams();

    //?: context
    const { mostrarAlerta, alerta, submitProyecto, proyecto, editarProyecto } =
        useProyectos();

    //? llenando el form cuando se este actualizando
    useEffect(() => {
        if (params.id) {
            setId(proyecto._id);
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]);
            setCliente(proyecto.cliente);
        }
    }, [proyecto]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los Campos son Obligatorios',
                error: true,
            });
            return;
        }

        //? pasar los datos hacia el provider

        if (params.id) {
            await editarProyecto({
                id,
                nombre,
                descripcion,
                fechaEntrega,
                cliente,
            });
        } else {
            await submitProyecto({
                nombre,
                descripcion,
                fechaEntrega,
                cliente,
            });
        }

        //? limpiar campos
        setId('');
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        setCliente('');
    };

    const { msg } = alerta;

    return (
        <form
            className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta} />}
            <div className="mt-5">
                <label
                    htmlFor="nombre"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Nombre Proyecto
                </label>

                <input
                    type="text"
                    id="nombre"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Proyecto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </div>

            <div className="mt-5">
                <label
                    htmlFor="descripcion"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Descripcion
                </label>

                <textarea
                    id="descripcion"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Descripcion del Proyecto"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div className="mt-5">
                <label
                    htmlFor="fecha-entrega"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Fecha Entrega
                </label>

                <input
                    type="date"
                    id="fecha-entrega"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                />
            </div>

            <div className="mb-5 mt-5">
                <label
                    htmlFor="cliente"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Nombre Cliente
                </label>

                <input
                    type="text"
                    id="cliente"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                />
            </div>

            <input
                type="submit"
                value={id ? 'Editar Proyecto' : 'Crear Proyecto'}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white cursor-pointer rounded hover:bg-sky-700 transition-colors"
            />
        </form>
    );
};

export default FormularioProyecto;
