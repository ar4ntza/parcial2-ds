// Componente raíz. Ver docs/05-arquitectura.md: App es el ÚNICO componente con
// estado y el único que llama a src/data/. Menu, Orden y Confirmacion solo
// reciben props.
import { useEffect, useState } from 'react'
import Menu from './components/Menu'
import Orden from './components/Orden'
import Confirmacion from './components/Confirmacion'
import {
  MENSAJES,
  agregarPlatillo,
  asignarMesa,
  calcularTotal,
  cambiarCantidad,
  crearOrden,
  quitarPlatillo,
  validarOrden,
} from './logic/orden'
import { cargarMenu } from './data/menu'
import { guardarOrden } from './data/ordenes'

export default function App() {
  const [menu, setMenu] = useState([])
  const [orden, setOrden] = useState(crearOrden())
  const [cargando, setCargando] = useState(true)
  const [errorMenu, setErrorMenu] = useState(false)
  const [errores, setErrores] = useState([])
  const [folio, setFolio] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // HU-01-Ver el menú —Must
  useEffect(() => {
    cargarMenu()
      .then((platillos) => setMenu(platillos))
      .catch((error) => {
        console.error(error)
        setErrorMenu(true)
      })
      .finally(() => setCargando(false))
  }, [])


  // TODO HU-02, HU-03: manejadores que llamen a las funciones de src/logic/orden.js.
  //       Aquí no se escriben reglas: solo se llaman.
  function handleAgregar(platillo) {
    setOrden((actual) => agregarPlatillo(actual, platillo))
    setErrores([])
    setFolio(null)
  }

  function handleQuitar(id) {
    setOrden((actual) => quitarPlatillo(actual, id))
  }

  // hu03 total
  const total = calcularTotal(orden)

  let contenidoMenu
  if (cargando) {
    contenidoMenu = <p>Cargando menú…</p>
  } else if (errorMenu) {
    contenidoMenu = <p role="alert">No se pudo cargar el menú</p>
  } else {
    contenidoMenu = <Menu menu={menu} onAgregar={handleAgregar} />
  }

  //cantidades
  function handleCambiarCantidad(id, cantidad) {
    setOrden((actual) => cambiarCantidad(actual, id, cantidad))
  }

  function handleCambiarMesa(valor) {
    setOrden((actual) => asignarMesa(actual, valor))
    setErrores([])
  }



  // TODO HU-04 · RNF-02: confirmar la orden.

  return (
    <div className="app">
      <header className="encabezado">
        <h1>La Fonda de Doña Lupe</h1>
        <p>Toma de órdenes</p>
      </header>

      <main className="layout">
        <Menu menu={menu} onAgregar={() => {}} />
        <Orden orden={orden} />
      </main>

      <Confirmacion folio={null} />
    </div>
  )
}
