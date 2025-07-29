import Hero from '../components/Hero';
import OngoingProjects from '../components/OngoingProjects';
import CompletedProjects from '../components/CompletedProjects';

const Home = () => {
  return (
    <main className="main-content">
      <Hero />
      <OngoingProjects />
      <CompletedProjects />
    </main>
  );
};

export default Home;
