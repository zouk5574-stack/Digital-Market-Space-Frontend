// Ajoutez cette route dans votre système de navigation admin :
import CategoryManager from './CategoryManager';

// Exemple d'intégration dans les routes :
const AdminPanel = () => {
  return (
    <Routes>
      {/* ... autres routes admin existantes ... */}
      <Route path="categories" element={<CategoryManager />} />
    </Routes>
  );
};