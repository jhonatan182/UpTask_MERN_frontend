import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';

const OlvidePassword = () => {
    const [email, setEmail] = useState('');
    const [alerta, setAlerta] = useState({});
    const er =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === '') {
            setAlerta({
                msg: 'El Email es obligatorio',
                error: true,
            });
            return;
        }

        if (!er.test(email)) {
            setAlerta({
                msg: 'El Email no es Válido',
                error: true,
            });
            return;
        }

        try {
            const { data } = await clienteAxios.post(
                `/usuarios/olvide-password`,
                { email }
            );

            setAlerta({
                msg: data.msg,
                error: false,
            });
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
                Recuperar tu acceso y no pierdas tus{' '}
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
                        type="text"
                        placeholder="Email de Registro"
                        id="email"
                        name="email"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <input
                    type="submit"
                    value="Enviar instrucciones"
                    className="bg-sky-700 mb-5 w-full py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/"
                >
                    ¿Ya tienes una cuenta? Inicia Sesión
                </Link>

                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/registrar"
                >
                    ¿No tienes una cuenta? Registrate
                </Link>
            </nav>
        </>
    );
};

export default OlvidePassword;
