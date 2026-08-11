function ResultsSection() {
  return (
    <section className="container section">
      {" "}
      <div className="section-heading">
        {" "}
        <div>
          {" "}
          <span className="eyebrow">COSTA RICA</span>{" "}
          <h2>Resultados recientes</h2>{" "}
        </div>
        <a href="/resultados">Ver resultados →</a>
      </div>
      <div className="scoreboard">
        <div className="match-row">
          <div>
            <span>Equipo local</span>
            <strong>Equipo A</strong>
          </div>

          <div className="score">
            2 <i>-</i> 1
          </div>

          <div className="right">
            <span>Final</span>
            <strong>Equipo B</strong>
          </div>
        </div>

        <div className="match-row">
          <div>
            <span>Equipo local</span>
            <strong>Equipo C</strong>
          </div>

          <div className="score">
            0 <i>-</i> 0
          </div>

          <div className="right">
            <span>Final</span>
            <strong>Equipo D</strong>
          </div>
        </div>

        <div className="match-row">
          <div>
            <span>Equipo local</span>
            <strong>Equipo E</strong>
          </div>

          <div className="score">
            1 <i>-</i> 3
          </div>

          <div className="right">
            <span>Final</span>
            <strong>Equipo F</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResultsSection;
