import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import Spinner from '../components/Spinner';
import FormularioColaborador from '../components/FormularioColaborador';
import Alerta from '../components/Alerta';

const NuevoColaborador = () => {
    const params = useParams();

    const {
        obtenerProyecto,
        proyecto,
        cargando,
        colaborador,
        agregarColaborador,
        alerta,
    } = useProyectos();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, []);

    if (!proyecto?._id) return <Alerta alerta={alerta} />;

    return cargando ? (
        <Spinner />
    ) : (
        <>
            <h1 className="text-4xl font-black">
                Añadir Colaborador(a) al Proyecto: {proyecto.nombre}{' '}
            </h1>

            <div className="mt-10 flex justify-center">
                <FormularioColaborador />
            </div>

            {cargando ? (
                <Spinner />
            ) : (
                colaborador?._id && (
                    <div className="flex justify-center mt-10">
                        <div className="bg-white w-full py-10 px-5 md:w-1/2 rounded-lg shadow">
                            <h2 className="text-center mb-10 text-2xl font-bold">
                                Resultado:
                            </h2>

                            <div className="flex justify-between items-center">
                                <p>{colaborador.nombre}</p>
                                <button
                                    onClick={() =>
                                        agregarColaborador({
                                            email: colaborador.email,
                                        })
                                    }
                                    type="button"
                                    className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                                >
                                    Agregar al proyecto
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    );
};

export default NuevoColaborador;
