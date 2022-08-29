import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/Alerta';
//? context
import useAuth from '../hooks/useAuth';

const Login = () => {
    //? states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alerta, setAlerta] = useState({});

    //? context
    const { setAuth } = useAuth();

    //? useNavigate
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true,
            });
            return;
        }

        try {
            const { data } = await clienteAxios.post('/usuarios/login', {
                email,
                password,
            });

            localStorage.setItem('token', data.token);
            //? Almacenando el objeto de la respuesta en el context
            setAuth(data);
            setAlerta({});
            navigate('/proyectos');
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
                Inicia sesión y admistra tus{' '}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}
            <form
                onSubmit={handleSubmit}
                className="my-10 bg-white shadow rounded-lg p-10"
            >
                <div className="my-5">
                    <label
                        htmlFor="email"
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email de Registro"
                        id="email"
                        name="email"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="my-5">
                    <label
                        htmlFor="password"
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password de Registro"
                        id="password"
                        name="password"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <input
                    type="submit"
                    value="Iniciar Sesion"
                    className="bg-sky-700 mb-5 w-full py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/registrar"
                >
                    ¿No tienes una cuenta? Registrate
                </Link>

                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/olvide-password"
                >
                    Olvide mi Password
                </Link>
            </nav>
        </>
    );
};

export default Login;
