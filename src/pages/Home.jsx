import Hero from "../components/Hero";
import NewsSection from "../components/NewsSection";
import ResultsSection from "../components/ResultsSection";
import StandingsSection from "../components/StandingsSection";
import InstagramCTA from "../components/InstagramCTA";

function Home() {
  return (
    <>
      {" "}
      <Hero /> <NewsSection /> <ResultsSection /> <StandingsSection />{" "}
      <InstagramCTA />
    </>
  );
}

export default Home;
