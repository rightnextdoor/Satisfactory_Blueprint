// src/components/planner/view/ResourceSection.tsx

import React from 'react';
import type { PlannerDto } from '../../../types/planner';
import '../../../styles/planner/ResourceSection.css';

interface ResourceSectionProps {
  planner: PlannerDto;
}

interface Usage {
  product: string;
  amount: number;
}

interface ResourceSummary {
  name: string;
  total: number;
  usages: Usage[];
}

const ResourceSection: React.FC<ResourceSectionProps> = ({ planner }) => {
  // 1) Initialize a map for each raw resource → total + empty usages
  const map = new Map<string, ResourceSummary>();
  planner.resources.forEach((r) => {
    map.set(r.item.name, {
      name: r.item.name,
      total: r.amount,
      usages: [],
    });
  });

  // 2) Populate usages from every entry's ingredientAllocations
  planner.entries.forEach((entry) => {
    const productName = entry.targetItem.name;
    entry.ingredientAllocations.forEach((a) => {
      const resource = map.get(a.item.name);
      if (resource) {
        resource.usages.push({
          product: productName,
          amount: a.amount,
        });
      }
    });
  });

  // 3) Convert map to array and alphabetize resources and their usages
  const summary: ResourceSummary[] = Array.from(map.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((res) => ({
      ...res,
      usages: res.usages.sort((u1, u2) => u1.product.localeCompare(u2.product)),
    }));

  return (
    <div className="planner-view__section resource-section">
      <h2 className="resource-section__header">Resources</h2>
      <ul>
        {summary.map((res) => (
          <li key={res.name} className="resource-section__item">
            {res.name} – {res.total}
            {res.usages.length > 0 && (
              <ul className="resource-section__usage-list">
                {res.usages.map((u, i) => (
                  <li key={i} className="resource-section__usage">
                    {u.product} needs {u.amount}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceSection;
