function TablaEstadisticas({ columnas, datos }) {
  return (
    <div className="tabla-estadisticas-wrap">
      <table className="tabla-estadisticas">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.key}>{columna.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {datos.map((fila, index) => (
            <tr key={fila.id ?? index}>
              {columnas.map((columna) => (
                <td key={columna.key}>
                  {columna.render
                    ? columna.render(fila, index)
                    : fila[columna.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaEstadisticas;
