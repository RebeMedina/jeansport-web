import Hero from "../components/Hero";
import ResultsSection from "../components/ResultsSection";
import StandingsSection from "../components/StandingsSection";
import StatsSection from "../components/StatsSection";
import SemifinalesSection from "../components/SemifinalesSection";

function Home() {
  return (
    <>
      {" "}
      <Hero /> <ResultsSection /> <SemifinalesSection /> <StandingsSection />{" "}
      <StatsSection />
    </>
  );
}

export default Home;
