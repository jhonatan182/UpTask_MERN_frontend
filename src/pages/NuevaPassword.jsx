import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';

const NuevaPassword = () => {
    const params = useParams();
    const { token } = params;

    const navigate = useNavigate();

    const [tokenValido, setTokenValido] = useState(false);
    const [alerta, setAlerta] = useState({});
    const [password, setPassword] = useState('');
    const [passwordModificado, setPasswordModificado] = useState(false);

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`);

                setTokenValido(true);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true,
                });
            }
        };

        comprobarToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setAlerta({
                msg: 'El Password debe de tener minimo 6 caracteres',
                error: true,
            });
            return;
        }

        try {
            const url = `/usuarios/olvide-password/${token}`;

            const { data } = await clienteAxios.post(url, {
                password,
            });

            setPasswordModificado(true);

            setAlerta({
                msg: data.msg,
                error: false,
            });

            setTimeout(() => {
                navigate('/');
            }, 2500);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });
        }
    };

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Reestablece tu password y no pierdad acceso a tus{' '}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            {tokenValido && (
                <form
                    onSubmit={handleSubmit}
                    className="my-10 bg-white shadow rounded-lg p-10"
                >
                    <div className="my-5">
                        <label
                            htmlFor="password"
                            className="uppercase text-gray-600 block text-xl font-bold"
                        >
                            Nuevo Password
                        </label>
                        <input
                            type="password"
                            placeholder="Escribe tu nuevo password"
                            id="password"
                            name="password"
                            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <input
                        type="submit"
                        value="Guardar nuevo password"
                        className="bg-sky-700 mb-5 w-full py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                    />
                </form>
            )}

            {passwordModificado && (
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/"
                >
                    Inicia Sesión
                </Link>
            )}
        </>
    );
};

export default NuevaPassword;
