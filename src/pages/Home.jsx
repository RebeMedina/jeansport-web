import Hero from "../components/Hero";
import ResultsSection from "../components/ResultsSection";
import StandingsSection from "../components/StandingsSection";
import InstagramCTA from "../components/InstagramCTA";

function Home() {
  return (
    <>
      {" "}
      <Hero /> <ResultsSection /> <StandingsSection />{" "}
      <InstagramCTA />
    </>
  );
}

export default Home;
