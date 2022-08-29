import { useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    //? use navigate
    const navigate = useNavigate();
    useEffect(() => {
        const autenticarUsuario = async () => {
            //? verficando si hay un token en LS
            const token = localStorage.getItem('token');

            if (!token) {
                setCargando(false);
                return;
            }

            try {
                const { data } = await clienteAxios('/usuarios/perfil', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                //navigate('/proyectos');
                setAuth(data);
            } catch (error) {
                setAuth({});
            } finally {
                setCargando(false);
            }
        };

        autenticarUsuario();
    }, []);

    const cerrarSesionAuth = () => {
        setAuth();
    };

    return (
        <AuthContext.Provider
            value={{ auth, setAuth, cargando, cerrarSesionAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

export { AuthProvider };
