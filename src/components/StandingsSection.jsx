function StandingsSection() {
  return (
    <section className="container section">
      {" "}
      <div className="section-heading">
        {" "}
        <div>
          {" "}
          <span className="eyebrow">CLASIFICACIÓN</span>{" "}
          <h2>Tabla de posiciones</h2>{" "}
        </div>
        <a href="/posiciones">Tabla completa →</a>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>PTS</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>
                <strong>Equipo A</strong>
              </td>
              <td>5</td>
              <td>4</td>
              <td>1</td>
              <td>0</td>
              <td>
                <strong>13</strong>
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>
                <strong>Equipo B</strong>
              </td>
              <td>5</td>
              <td>3</td>
              <td>1</td>
              <td>1</td>
              <td>
                <strong>10</strong>
              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>
                <strong>Equipo C</strong>
              </td>
              <td>5</td>
              <td>3</td>
              <td>0</td>
              <td>2</td>
              <td>
                <strong>9</strong>
              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>
                <strong>Equipo D</strong>
              </td>
              <td>5</td>
              <td>2</td>
              <td>2</td>
              <td>1</td>
              <td>
                <strong>8</strong>
              </td>
            </tr>

            <tr>
              <td>5</td>
              <td>
                <strong>Equipo E</strong>
              </td>
              <td>5</td>
              <td>2</td>
              <td>1</td>
              <td>2</td>
              <td>
                <strong>7</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StandingsSection;
