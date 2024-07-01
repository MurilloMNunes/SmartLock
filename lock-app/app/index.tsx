import React from 'react';
import { AuthProvider } from '../src/contexts/AuthContext';
import RootNavigator from '../src/navigation/RootNavigator';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
