// src/pages/Generators.tsx
import React, { useState, useCallback } from 'react';
import GeneratorSidebar, {
  type GeneratorTab,
} from '../components/generators/GeneratorSidebar';
import ViewGenerators from '../components/generators/view/ViewGenerators';
import CreateGenerator from '../components/generators/create/CreateGenerator';
import UpdateGenerator from '../components/generators/update/UpdateGenerator';
import '../styles/generator/Generator.css';

const Generators: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<GeneratorTab>('view');
  const [selectedGeneratorId, setSelectedGeneratorId] = useState<number | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDone = useCallback(() => {
    // after create/update, return to view and refresh list
    setSelectedTab('view');
    setRefreshKey((prev) => prev + 1);
    // keep selectedGeneratorId so view stays on the same item
  }, []);

  const paneClasses = (tab: GeneratorTab) =>
    `absolute inset-0 overflow-y-auto ${
      selectedTab === tab ? 'visible' : 'invisible pointer-events-none'
    }`;

  return (
    <div className="generator-page">
      <GeneratorSidebar selected={selectedTab} onSelect={setSelectedTab} />

      <div className="flex-1 flex flex-col">
        <div className="generator-page__topbar">
          <h1 className="generator-page__title">Generators</h1>
        </div>

        <main className="generator-page__content relative flex-1">
          {/* View pane (always mounted to preserve scroll & selection) */}
          <div className={paneClasses('view')}>
            <ViewGenerators
              selectedGeneratorId={selectedGeneratorId}
              onSelect={setSelectedGeneratorId}
              refreshKey={refreshKey}
            />
          </div>

          {/* Create pane */}
          {selectedTab === 'create' && (
            <div className={paneClasses('create')}>
              <CreateGenerator onDone={handleDone} />
            </div>
          )}

          {/* Update pane */}
          {selectedTab === 'update' && (
            <div className={paneClasses('update')}>
              <UpdateGenerator
                generatorId={selectedGeneratorId}
                onDone={handleDone}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Generators;
