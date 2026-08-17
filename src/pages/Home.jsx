import Hero from "../components/Hero";
import ResultsSection from "../components/ResultsSection";
import StandingsSection from "../components/StandingsSection";
import StatsSection from "../components/StatsSection";
import SocialCTA from "../components/SocialCTA";

function Home() {
  return (
    <>
      {" "}
      <Hero /> <ResultsSection /> <StandingsSection /> <StatsSection /> <SocialCTA />
    </>
  );
}

export default Home;
