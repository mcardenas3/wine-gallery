import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
  previousPath: string;
  sourceContext: 'winemakers' | 'collection' | 'other';
  specificWinemakerId: string | null;
  specificWinemakerName: string | null;
  specificWineId: string | null;
  specificWineName: string | null;
  setPreviousPath: (path: string) => void;
  setSpecificWinemaker: (id: string | null, name: string | null) => void;
  setSpecificWine: (id: string | null, name: string | null) => void;
}

const defaultContext: NavigationContextType = {
  previousPath: '/',
  sourceContext: 'collection',
  specificWinemakerId: null,
  specificWinemakerName: null,
  specificWineId: null,
  specificWineName: null,
  setPreviousPath: () => {},
  setSpecificWinemaker: () => {},
  setSpecificWine: () => {}
};

const NavigationContext = createContext<NavigationContextType>(defaultContext);

/**
 * Hook personalizado para acceder al contexto de navegación desde cualquier componente
 */
export const useNavigation = () => useContext(NavigationContext);

/**
 * Proveedor del contexto de navegación
 * Este componente mantiene el estado de navegación de la aplicación y proporciona
 * funciones para actualizarlo. Guarda el estado en localStorage para persistencia
 * entre sesiones y maneja automáticamente los cambios de ruta.
 */
export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [previousPath, setPreviousPath] = useState('/');
  const [sourceContext, setSourceContext] = useState<'winemakers' | 'collection' | 'other'>('collection');
  const [specificWinemakerId, setSpecificWinemakerId] = useState<string | null>(null);
  const [specificWinemakerName, setSpecificWinemakerName] = useState<string | null>(null);
  const [specificWineId, setSpecificWineId] = useState<string | null>(null);
  const [specificWineName, setSpecificWineName] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const storedPath = localStorage.getItem('previousPath');
    const storedContext = localStorage.getItem('navigationContext');
    const storedWinemakerId = localStorage.getItem('specificWinemakerId');
    const storedWinemakerName = localStorage.getItem('specificWinemakerName');
    const storedWineId = localStorage.getItem('specificWineId');
    const storedWineName = localStorage.getItem('specificWineName');
    
    if (storedPath) {
      setPreviousPath(storedPath);
    }
    
    if (storedContext === 'winemakers' || storedContext === 'collection') {
      setSourceContext(storedContext);
    }

    if (storedWinemakerId) {
      setSpecificWinemakerId(storedWinemakerId);
    }

    if (storedWinemakerName) {
      setSpecificWinemakerName(storedWinemakerName);
    }

    if (storedWineId) {
      setSpecificWineId(storedWineId);
    }
    if (storedWineName) {
      setSpecificWineName(storedWineName);
    }
  }, []);

  // Rastrear los cambios de ruta automáticamente
  useEffect(() => {
    const currentPath = location.pathname;
    
    if (!currentPath.includes('/wine/') && !currentPath.includes('/winemaker/')) {
      setPreviousPath(currentPath);
      localStorage.setItem('previousPath', currentPath);
      
      if (currentPath === '/' || currentPath === '/collection') {
        setSourceContext('collection');
        localStorage.setItem('navigationContext', 'collection');
        
        if (specificWinemakerId) {
          handleSetSpecificWinemaker(null, null);
        }
      } else if (currentPath === '/winemakers') {
        setSourceContext('winemakers');
        localStorage.setItem('navigationContext', 'winemakers');
        
        if (specificWineId) {
          handleSetSpecificWine(null, null);
        }
      }
    }
    
    if (currentPath === '/winemakers') {
      handleSetSpecificWine(null, null);
    }
    
    if (currentPath === '/') {
      handleSetSpecificWinemaker(null, null);
    }
  }, [location.pathname, specificWinemakerId, specificWineId]);

  const handleSetPreviousPath = (path: string) => {
    setPreviousPath(path);
    localStorage.setItem('previousPath', path);
    
    if (path === '/' || path.includes('/wine/')) {
      setSourceContext('collection');
      localStorage.setItem('navigationContext', 'collection');
    } else if (path === '/winemakers' || path.includes('/winemaker/')) {
      setSourceContext('winemakers');
      localStorage.setItem('navigationContext', 'winemakers');
    }
  };

  // Función para guardar el ID y nombre del winemaker específico
  const handleSetSpecificWinemaker = (id: string | null, name: string | null) => {
    setSpecificWinemakerId(id);
    setSpecificWinemakerName(name);
    
    if (id) {
      localStorage.setItem('specificWinemakerId', id);
      if (name) {
        localStorage.setItem('specificWinemakerName', name);
      }
    } else {
      localStorage.removeItem('specificWinemakerId');
      localStorage.removeItem('specificWinemakerName');
    }
  };

  // Función para guardar el ID y nombre del vino específico
  const handleSetSpecificWine = (id: string | null, name: string | null) => {
    setSpecificWineId(id);
    setSpecificWineName(name);
    
    if (id) {
      localStorage.setItem('specificWineId', id);
      if (name) {
        localStorage.setItem('specificWineName', name);
      }
    } else {
      localStorage.removeItem('specificWineId');
      localStorage.removeItem('specificWineName');
    }
  };

  return (
    <NavigationContext.Provider 
      value={{ 
        previousPath, 
        sourceContext,
        specificWinemakerId,
        specificWinemakerName,
        specificWineId,
        specificWineName,
        setPreviousPath: handleSetPreviousPath,
        setSpecificWinemaker: handleSetSpecificWinemaker,
        setSpecificWine: handleSetSpecificWine
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
