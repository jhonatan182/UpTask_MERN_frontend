import useProyectos from '../hooks/useProyectos';
const Colaborador = ({ colaborador }) => {
    const { handleModalEliminarColaborador } = useProyectos();
    const { nombre, email, _id } = colaborador;
    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-700">{nombre}</p>
                <p>{email}</p>
            </div>

            <div>
                <button
                    className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    type="button"
                    onClick={() => handleModalEliminarColaborador(colaborador)}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default Colaborador;