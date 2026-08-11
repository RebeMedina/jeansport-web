import Header from "../components/Header";
import Hero from "../components/Hero";
import NewsSection from "../components/NewsSection";
import ResultsSection from "../components/ResultsSection";
import StandingsSection from "../components/StandingsSection";
import InstagramCTA from "../components/InstagramCTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      {" "}
      <Header />
      <main>
        <Hero />
        <NewsSection />
        <ResultsSection />
        <StandingsSection />
        <InstagramCTA />
      </main>
      <Footer />
    </>
  );
}

export default Home;
