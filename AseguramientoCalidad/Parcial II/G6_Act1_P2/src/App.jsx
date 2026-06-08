import { Suspense } from 'react';
import LandingPage from './components/LandingPage';
import { SkeletonLoader } from './components/UI/SharedComponents';

function App() {
  return (
    <Suspense fallback={<SkeletonLoader count={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />}>
      <LandingPage />
    </Suspense>
  );
}

export default App;
