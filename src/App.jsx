import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import RutaProtegida from './layouts/RutaProtegida';

import ConfirmarCuenta from './pages/ConfirmarCuenta';
import Login from './pages/Login';
import NuevaPassword from './pages/NuevaPassword';
import OlvidePassword from './pages/OlvidePassword';
import Registrar from './pages/Registrar';
import Proyectos from './pages/Proyectos';
import NuevoProyecto from './pages/NuevoProyecto';
import Proyecto from './pages/Proyecto';
import EditarProyecto from './pages/EditarProyecto';
import NuevoColaborador from './pages/NuevoColaborador';

//? context/providers
import { AuthProvider } from './context/AuthProvider';
import { ProyectosProvider } from './context/ProyectosProvider';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ProyectosProvider>
                    <Routes>
                        <Route path="/" element={<AuthLayout />}>
                            <Route index element={<Login />} />
                            {/* index indica que se carga junto a la ruta principal '/' */}
                            {/* Las rutas hijas dentro de '/' para mostrarse en el componente de la ruta del padre se debe de definir un Outlet */}
                            <Route path="registrar" element={<Registrar />} />
                            <Route
                                path="olvide-password"
                                element={<OlvidePassword />}
                            />
                            <Route
                                path="olvide-password/:token"
                                element={<NuevaPassword />}
                            />
                            <Route
                                path="confirmar/:id"
                                element={<ConfirmarCuenta />}
                            />
                        </Route>

                        {/* rutas protegidas */}
                        <Route path="/proyectos" element={<RutaProtegida />}>
                            <Route index element={<Proyectos />} />
                            <Route
                                path="crear-proyecto"
                                element={<NuevoProyecto />}
                            />
                            <Route
                                path="nuevo-colaborador/:id"
                                element={<NuevoColaborador />}
                            />
                            <Route
                                path="editar/:id"
                                element={<EditarProyecto />}
                            />
                            <Route path=":id" element={<Proyecto />} />
                            {/* este placeholder simepre a permanceer a la ruta que agrupa otras rutas */}
                        </Route>
                    </Routes>
                </ProyectosProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
