import './Spinner.css';

const Spinner = () => {
    return (
        <>
            <div className="flex justify-center items-center mt-20">
                <div className="sk-chase">
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                </div>
            </div>
            <p className="text-center mt-10 text-4xl uppercase text-sky-700">
                Cargando...
            </p>
        </>
    );
};

export default Spinner;
