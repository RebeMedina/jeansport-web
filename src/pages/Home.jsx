import Hero from "../components/Hero";
import ResultsSection from "../components/ResultsSection";
import StandingsSection from "../components/StandingsSection";
import StatsSection from "../components/StatsSection";
import InstagramCTA from "../components/InstagramCTA";

function Home() {
  return (
    <>
      {" "}
      <Hero /> <ResultsSection /> <StandingsSection /> <StatsSection /> <InstagramCTA />
    </>
  );
}

export default Home;
