import { useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador, setModalEliminarColaborador] =
        useState(false);
    const [buscador, setBuscador] = useState(false);

    //? navigate
    const navigate = useNavigate();

    const { auth } = useAuth();

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({});
        }, 4000);
    };

    //? socket io
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, []);

    //? Obtener proyectos
    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) return;

                const { data } = await clienteAxios('/proyectos', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        };

        obtenerProyectos();
    }, [auth]);

    const submitProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) return;
            const { data } = await clienteAxios.post('/proyectos', proyecto, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false,
            });

            //? sincronizar el state cuando hayan nuevos proyectos
            setProyectos([...proyectos, data]);

            setTimeout(() => {
                navigate('/proyectos');
                setAlerta({});
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    const editarProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) return;

            const { data } = await clienteAxios.put(
                `/proyectos/${proyecto.id}`,
                proyecto,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            //? SINCRONIZAR EL STATE

            const proyectosActualizados = proyectos.map((proyectoState) =>
                proyectoState._id === data._id ? data : proyectoState
            );

            setProyectos(proyectosActualizados);

            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false,
            });

            setTimeout(() => {
                navigate(`/proyectos/`);
                setAlerta({});
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    //? obtener un proyecto
    const obtenerProyecto = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            setCargando(true);

            const { data } = await clienteAxios(`/proyectos/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setProyecto(data);
            setAlerta({});
        } catch (error) {
            setAlerta({ msg: error.response.data.msg, error: true });
            navigate('/proyectos');

            setTimeout(() => {
                setAlerta({});
            }, 2500);
        }

        setCargando(false);
    };

    const eliminarProyecto = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setAlerta({
                msg: data.msg,
                error: false,
            });

            //? sincroinzar el state
            const proyectosSincronizados = proyectos.filter(
                (proyectoState) => proyectoState._id !== id
            );
            setProyectos(proyectosSincronizados);

            setTimeout(() => {
                navigate('/proyectos');
                setAlerta({});
            }, 2500);
        } catch (error) {
            console.log(error);
        }
    };

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({});
    };

    const submitTarea = async (tarea) => {
        if (tarea.id) {
            await editarTarea(tarea);
        } else {
            await crearTarea(tarea);
        }
    };

    const crearTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.post('/tareas', tarea, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setModalFormularioTarea(!modalFormularioTarea);
            setAlerta({});

            //SOCKET IO
            socket.emit('nueva tarea', data);
        } catch (error) {
            console.log(error);
        }
    };

    const editarTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.put(
                `/tareas/${tarea.id}`,
                tarea,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setModalFormularioTarea(!modalFormularioTarea);
            setAlerta({});

            //socket
            socket.emit('actualizar tarea', data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    };

    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    };

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setAlerta({
                msg: data.msg,
                error: false,
            });

            setModalEliminarTarea(!modalEliminarTarea);

            socket.emit('eliminar tarea', tarea);

            setTimeout(() => {
                setAlerta({});
            }, 3000);

            //socket
        } catch (error) {
            console.log(error);
        }
    };

    const submitColaborador = async (email) => {
        try {
            setCargando(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.post(
                '/proyectos/colaboradores',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setColaborador(data);
            setAlerta({});
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });
        } finally {
            setCargando(false);
        }
    };

    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.post(
                `/proyectos/colaboradores/${proyecto._id}`,
                email,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAlerta({
                msg: data.msg,
                error: false,
            });
            setColaborador({});

            setTimeout(() => {
                setAlerta({});
            }, 3000);
        } catch (error) {
            setAlerta({ msg: error.response.data.msg, error: true });
            setColaborador({});
        }
    };

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador);

        setColaborador(colaborador);
    };

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.post(
                `/proyectos/eliminar-colaboradores/${proyecto._id}`,
                { id: colaborador._id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const proyectoActualizado = { ...proyecto };

            proyectoActualizado.colaboradores =
                proyectoActualizado.colaboradores.filter(
                    (colaboradorState) =>
                        colaboradorState._id !== colaborador._id
                );

            setProyecto(proyectoActualizado);
            setAlerta({
                msg: data.msg,
                error: false,
            });
            setColaborador({});
            setModalEliminarColaborador(false);

            setTimeout(() => {
                setAlerta({});
            }, 3000);
        } catch (error) {
            console.log(error.response);
        }
    };

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await clienteAxios.post(
                `/tareas/estado/${id}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            //socket

            socket.emit('cambiar estado', data);

            setTarea({});
            setAlerta({});
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleBuscador = () => {
        console.log('buscando');
        setBuscador(!buscador);
    };

    //socket io
    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto };

        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];

        setProyecto(proyectoActualizado);
    };

    const eliminarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
            (tareaState) => tareaState._id !== tarea._id
        );

        setProyecto(proyectoActualizado);
    };

    const actualizarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(
            (tareaState) => (tareaState._id === tarea._id ? tarea : tareaState)
        );

        setProyecto(proyectoActualizado);
    };

    const cambiarEstadoTarea = (tarea) => {
        const proyectoActualizado = { ...proyecto };

        proyectoActualizado.tareas = proyectoActualizado.tareas.map(
            (tareaState) => (tareaState._id === tarea._id ? tarea : tareaState)
        );

        setProyecto(proyectoActualizado);
    };

    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});
        setTarea({});
    };

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                alerta,
                mostrarAlerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                editarProyecto,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos,
            }}
        >
            {children}
        </ProyectosContext.Provider>
    );
};

export { ProyectosProvider };

export default ProyectosContext;
